import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
    const { email, password } = await req.json()

    if (!email?.trim() || !password?.trim()) {
        return NextResponse.json({ message: 'Tüm alanları doldur.' }, { status: 400 })
    }

    if (password.length < 6) {
        return NextResponse.json({ message: 'Şifre en az 6 karakter olmalı.' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({
        where: { email },
    })

    if (existing) {
        return NextResponse.json({ message: 'Bu email zaten kayıtlı.' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    })

    return NextResponse.json({ success: true })
}