import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { satelliteId } = await req.json()

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ message: 'Kullanıcı bulunamadı.' }, { status: 404 })
  }

  const satellite = await prisma.satellite.findFirst({
    where: { id: satelliteId, userId: user.id },
  })

  if (!satellite) {
    return NextResponse.json({ message: 'Uydu bulunamadı.' }, { status: 404 })
  }

  if (satellite.status !== 'launching') {
    return NextResponse.json({ message: 'Uydu zaten aktif.' }, { status: 400 })
  }

  await prisma.satellite.update({
    where: { id: satelliteId },
    data: { status: 'active' },
  })

  return NextResponse.json({ success: true })
}