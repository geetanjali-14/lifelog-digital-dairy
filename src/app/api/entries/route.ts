import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { addXP, XP_CONFIG } from '@/lib/gamification'
import { analyzeJournalEntry } from '@/lib/ai'

const entrySchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  mood: z.string().min(1, 'Mood is required'),
  entryDate: z.string().optional(),
  gratitude: z.string().optional(),
  highlight: z.string().optional(),
  expense: z.number().optional().nullable(),
  isPrivate: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const entries = await prisma.diaryEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { entryDate: 'desc' },
      take: limit,
      skip: offset,
      include: {
        entryTags: {
          include: {
            tag: true
          }
        }
      }
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error('Failed to fetch entries:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = entrySchema.parse(body)

    const entry = await prisma.diaryEntry.create({
      data: {
        userId: session.user.id,
        title: validatedData.title,
        content: validatedData.content,
        mood: validatedData.mood,
        entryDate: validatedData.entryDate ? new Date(validatedData.entryDate) : new Date(),
        gratitude: validatedData.gratitude,
        highlight: validatedData.highlight,
        expense: validatedData.expense,
        isPrivate: validatedData.isPrivate || false,
      }
    })

    // AI Analysis
    const aiAnalysis = await analyzeJournalEntry(validatedData.content);
    if (aiAnalysis) {
      await prisma.diaryEntry.update({
        where: { id: entry.id },
        data: {
          sentimentScore: aiAnalysis.sentimentScore,
          aiSummary: aiAnalysis.summary,
        }
      });

      // Create AI Insights/Suggestions
      if (aiAnalysis.suggestions && aiAnalysis.suggestions.length > 0) {
        await prisma.aiInsight.create({
          data: {
            userId: session.user.id,
            type: 'suggestion',
            content: aiAnalysis.suggestions.join('\n'),
          }
        });
      }
    }

    await addXP(session.user.id, XP_CONFIG.NEW_ENTRY)

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Failed to create entry:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
