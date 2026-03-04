import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { username, companyName } = await req.json()

  if (!username?.trim() || !companyName?.trim()) {
    return NextResponse.json({ message: 'Tüm alanları doldur.' }, { status: 400 })
  }

  const existing = await prisma.user.findFirst({
    where: {
      username,
      NOT: { email: session.user.email },
    },
  })

  if (existing) {
    return NextResponse.json({ message: 'Bu kullanıcı adı alınmış.' }, { status: 400 })
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { username, companyName },
  })

  return NextResponse.json({ success: true })
}