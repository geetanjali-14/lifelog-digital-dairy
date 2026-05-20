import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateReflectionPrompts } from '@/lib/ai';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const recentEntries = await prisma.diaryEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { entryDate: 'desc' },
      take: 5,
      select: { content: true },
    });

    const contents = recentEntries.map(e => e.content);
    const prompts = await generateReflectionPrompts(contents);

    return NextResponse.json({ prompts });
  } catch (error) {
    console.error('Failed to generate prompts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
