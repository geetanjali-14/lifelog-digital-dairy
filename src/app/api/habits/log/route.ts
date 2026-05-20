import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { addXP, XP_CONFIG } from '@/lib/gamification'

const habitLogSchema = z.object({
  habitId: z.string().uuid(),
  completed: z.boolean(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { habitId, completed } = habitLogSchema.parse(body)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const habit = await prisma.habit.findUnique({
      where: { id: habitId }
    })

    if (!habit || habit.userId !== session.user.id) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    const habitLog = await prisma.habitLog.upsert({
      where: {
        habitId_logDate: {
          habitId,
          logDate: today,
        }
      },
      update: {
        isCompleted: completed,
      },
      create: {
        habitId,
        logDate: today,
        isCompleted: completed,
      }
    })

    if (completed) {
      await addXP(session.user.id, XP_CONFIG.HABIT_COMPLETED)
    }

    return NextResponse.json(habitLog)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Failed to log habit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
