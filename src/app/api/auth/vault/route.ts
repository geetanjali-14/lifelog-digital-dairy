import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { pinCode: true },
    });

    return NextResponse.json({ hasPin: !!user?.pinCode });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { pin, action, currentPin } = await req.json();

    if (action === 'set') {
      const hashedPin = await bcrypt.hash(pin, 10);
      await prisma.user.update({
        where: { id: session.user.id },
        data: { pinCode: hashedPin },
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'verify') {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { pinCode: true },
      });

      if (!user?.pinCode) {
        return NextResponse.json({ error: 'No PIN set' }, { status: 400 });
      }

      const isValid = await bcrypt.compare(pin, user.pinCode);
      return NextResponse.json({ isValid });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Vault error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
