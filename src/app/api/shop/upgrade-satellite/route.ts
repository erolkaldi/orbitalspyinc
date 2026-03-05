import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SHOP_PRICES } from '@/lib/gameConfig'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { satelliteId } = await req.json()

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { satellites: true },
  })

  if (!user) {
    return NextResponse.json({ message: 'Kullanıcı bulunamadı.' }, { status: 404 })
  }

  const satellite = user.satellites.find(s => s.id === satelliteId)

  if (!satellite) {
    return NextResponse.json({ message: 'Uydu bulunamadı.' }, { status: 404 })
  }

  if (satellite.tier >= 3) {
    return NextResponse.json({ message: 'Maksimum tier.' }, { status: 400 })
  }

  const price = SHOP_PRICES.upgrade[satellite.tier as keyof typeof SHOP_PRICES.upgrade]

  if (user.money < price) {
    return NextResponse.json({ message: 'Yetersiz bakiye.' }, { status: 400 })
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { money: user.money - price },
    }),
    prisma.satellite.update({
      where: { id: satelliteId },
      data: { tier: satellite.tier + 1 },
    }),
  ])

  return NextResponse.json({ success: true })
}