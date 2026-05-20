import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { subDays, format, eachDayOfInterval } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30', 10);

    const startDate = subDays(new Date(), days);

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
        expense: true,
      },
      orderBy: {
        entryDate: 'asc',
      },
    });

    const moodScores: Record<string, number> = {
      'Excellent': 5, 'Great': 5, 'Happy': 4, 'Good': 4,
      'Neutral': 3, 'Calm': 3, 'Sad': 2, 'Tired': 2,
      'Fair': 2, 'Poor': 1, 'Frustrated': 1, 'Angry': 1,
    };

    const interval = eachDayOfInterval({
      start: startDate,
      end: new Date(),
    });

    const chartData = interval.map((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayEntries = entries.filter(e => format(new Date(e.entryDate), 'yyyy-MM-dd') === dateStr);
      
      const avgMood = dayEntries.length > 0 
        ? dayEntries.reduce((sum, e) => sum + (moodScores[e.mood] || 3), 0) / dayEntries.length
        : null;

      const totalExpense = dayEntries.reduce((sum, e) => sum + (e.expense?.toNumber() || 0), 0);

      return {
        date: format(date, 'MMM d'),
        mood: avgMood,
        expense: totalExpense,
      };
    });

    // Mood distribution for pie chart
    const moodDistribution = await prisma.diaryEntry.groupBy({
      by: ['mood'],
      where: { userId, entryDate: { gte: startDate } },
      _count: { mood: true },
    });

    return NextResponse.json({
      trends: chartData,
      distribution: moodDistribution.map(m => ({ name: m.mood, value: m._count.mood })),
    });
  } catch (error) {
    console.error('Failed to fetch trend data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
