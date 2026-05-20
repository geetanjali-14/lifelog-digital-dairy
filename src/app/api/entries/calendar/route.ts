import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { subDays, startOfDay, format } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '90', 10);

    const startDate = subDays(startOfDay(new Date()), days);

    const entries = await prisma.diaryEntry.findMany({
      where: {
        userId,
        entryDate: {
          gte: startDate,
        },
      },
      select: {
        entryDate: true,
        mood: true,
        title: true,
      },
      orderBy: {
        entryDate: 'asc',
      },
    });

    const habits = await prisma.habit.findMany({
      where: { userId, isActive: true },
      include: {
        habitLogs: {
          where: {
            logDate: {
              gte: startDate,
            },
            isCompleted: true,
          },
        },
      },
    });

    // Process data into a map for easy lookup
    const calendarData: Record<string, any> = {};

    entries.forEach((entry) => {
      const dateKey = format(new Date(entry.entryDate), 'yyyy-MM-dd');
      calendarData[dateKey] = {
        mood: entry.mood,
        title: entry.title,
        habitsCompleted: 0,
        totalHabits: habits.length,
      };
    });

    habits.forEach((habit) => {
      habit.habitLogs.forEach((log) => {
        const dateKey = format(new Date(log.logDate), 'yyyy-MM-dd');
        if (!calendarData[dateKey]) {
          calendarData[dateKey] = {
            mood: null,
            title: null,
            habitsCompleted: 0,
            totalHabits: habits.length,
          };
        }
        calendarData[dateKey].habitsCompleted += 1;
      });
    });

    return NextResponse.json(calendarData);
  } catch (error) {
    console.error('Failed to fetch calendar data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
