import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { gameDate } = await req.json()

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      gameDate: new Date(gameDate),
      lastSyncAt: new Date(),
    },
  })

  return NextResponse.json({ success: true })
}