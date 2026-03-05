import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { assignmentId } = await req.json()

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ message: 'Kullanıcı bulunamadı.' }, { status: 404 })
  }

  const assignment = await prisma.missionAssignment.findFirst({
    where: { id: assignmentId, userId: user.id, status: 'active' },
    include: { mission: true },
  })

  if (!assignment) {
    return NextResponse.json({ message: 'Görev bulunamadı.' }, { status: 404 })
  }

  const penalty = Math.floor(assignment.mission.reward / 2)
  const newMoney = Math.max(0, user.money - penalty)

  await prisma.$transaction([
    prisma.missionAssignment.update({
      where: { id: assignmentId },
      data: { status: 'cancelled' },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { money: newMoney },
    }),
  ])

  return NextResponse.json({ success: true, penalty, newMoney })
}
