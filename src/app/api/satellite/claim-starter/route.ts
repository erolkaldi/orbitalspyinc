import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { satellites: true },
  })

  if (!user) {
    return NextResponse.json({ message: 'Kullanıcı bulunamadı.' }, { status: 404 })
  }

  if (user.satellites.length > 0) {
    return NextResponse.json({ message: 'Zaten uydun var.' }, { status: 400 })
  }

  await prisma.satellite.create({
    data: {
      name: 'SAT-01',
      tier: 1,
      userId: user.id,
      status: 'launching',
      launchPad: 'kennedy',
      orbitOffset: Math.random() * 360,
    },
  })

  return NextResponse.json({ success: true })
}