import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SHOP_PRICES, SLOT_PER_LEVEL } from '@/lib/gameConfig'

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

  if (user.satellites.length >= user.level * SLOT_PER_LEVEL) {
    return NextResponse.json({ message: 'Slot dolu.' }, { status: 400 })
  }

  if (user.money < SHOP_PRICES.newSatellite) {
    return NextResponse.json({ message: 'Yetersiz bakiye.' }, { status: 400 })
  }

  const satNumber = user.satellites.length + 1

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { money: user.money - SHOP_PRICES.newSatellite },
    }),
    prisma.satellite.create({
      data: {
        name: `SAT-0${satNumber}`,
        tier: 1,
        userId: user.id,
        status: 'launching',
        launchPad: 'kennedy',
        orbitOffset: Math.random() * 360,
      },
    }),
  ])

  return NextResponse.json({ success: true })
}