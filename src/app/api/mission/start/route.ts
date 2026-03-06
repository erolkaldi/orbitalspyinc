import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { missionId, satelliteId } = await req.json()

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { assignments: { where: { status: 'active' } } },
  })

  if (!user) {
    return NextResponse.json({ message: 'Kullanıcı bulunamadı.' }, { status: 404 })
  }

  const isBusy = user.assignments.some(a => a.satelliteId === satelliteId)
  if (isBusy) {
    return NextResponse.json({ message: 'Uydu meşgul.' }, { status: 400 })
  }

  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
  })

  if (!mission) {
    return NextResponse.json({ message: 'Görev bulunamadı.' }, { status: 404 })
  }

  const endsAt = new Date(Date.now() + mission.duration * 60 * 1000)

  const assignment = await prisma.missionAssignment.create({
    data: {
      missionId,
      satelliteId,
      userId: user.id,
      status: 'active',
      endsAt,
    },
  })

  return NextResponse.json(assignment)
}