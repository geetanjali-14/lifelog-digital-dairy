import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { updateUserStats } from '@/lib/gamification'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Update and get user stats (streak, level)
    const gamificationStats = await updateUserStats(userId)

    // Get total entries count
    const totalEntries = await prisma.diaryEntry.count({
      where: { userId }
    })

    // Get total expenses from diary entries (Legacy)
    const legacyExpensesResult = await prisma.diaryEntry.aggregate({
      where: { userId },
      _sum: {
        expense: true
      }
    })
    const legacyExpenses = legacyExpensesResult._sum.expense?.toNumber() || 0

    // Get totals from new Transaction table
    const transactionStats = await prisma.transaction.groupBy({
      by: ['type'],
      where: { userId },
      _sum: {
        amount: true
      }
    })

    const totalIncome = transactionStats.find(s => s.type === 'INCOME')?._sum.amount?.toNumber() || 0
    const totalTransactionExpenses = transactionStats.find(s => s.type === 'EXPENSE')?._sum.amount?.toNumber() || 0
    
    const totalExpenses = legacyExpenses + totalTransactionExpenses

    // Get most frequent mood
    const moodCounts = await prisma.diaryEntry.groupBy({
      by: ['mood'],
      where: { userId },
      _count: {
        mood: true
      },
      orderBy: {
        _count: {
          mood: 'desc'
        }
      },
      take: 1
    })
    const topMood = moodCounts[0]?.mood || 'Neutral'

    return NextResponse.json({
      totalEntries,
      totalExpenses,
      totalIncome,
      topMood,
      streak: gamificationStats?.streak || 0,
      level: gamificationStats?.level || 1,
      xp: gamificationStats?.xp || 0
    })
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
