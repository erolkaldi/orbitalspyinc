import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function generateReport(country: string, missionType: string, title: string) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `Sen bir uydu istihbarat analisti olarak çalışıyorsun. Aşağıdaki görev için kısa bir istihbarat raporu yaz:

Ülke: ${country}
Görev Tipi: ${missionType}
Görev: ${title}

Rapor şu alanları içermeli (JSON formatında):
- summary: 2-3 cümle genel özet
- targets: tespit edilen 3-5 hedef (her biri: name, type, status)
- threatLevel: LOW/MEDIUM/HIGH/CRITICAL
- confidence: 0-100 arası güven skoru

Sadece JSON döndür, başka bir şey yazma.`
        }],
      }),
    });

    const data = await response.json();
    const text = data.content[0].text;
    return JSON.parse(text);
  } catch (e) {
    console.log(e)
    return {
      summary: "İstihbarat verisi analiz edildi. Rapor oluşturulurken teknik bir sorun yaşandı.",
      targets: [
        { name: "Hedef A", type: "Askeri Tesis", status: "ACTIVE" },
        { name: "Hedef B", type: "Araç Konvoyu", status: "MOVING" },
        { name: "Hedef C", type: "İletişim İstasyonu", status: "ACTIVE" },
      ],
      threatLevel: "MEDIUM",
      confidence: 75,
    }
  }
}

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

  if (!assignment.endsAt || new Date() < assignment.endsAt) {
    return NextResponse.json({ message: 'Görev henüz tamamlanmadı.' }, { status: 400 })
  }

  const report = await generateReport(
    assignment.mission.country,
    assignment.mission.type,
    assignment.mission.title,
  )

  const newMoney = user.money + assignment.mission.reward

  await prisma.$transaction([
    prisma.missionAssignment.update({
      where: { id: assignmentId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        reportData: report,
      },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { money: newMoney },
    }),
  ])
  const activeMissions = await prisma.mission.findMany({
    select: { country: true, type: true, title: true },
    take: 10,
    orderBy: { createdAt: 'desc' },
  });

  const newMission = await generateMission(activeMissions);

  if (newMission) {
    await prisma.mission.create({
      data: {
        country: newMission.country,
        flag: newMission.flag,
        title: newMission.title,
        type: newMission.type,
        reward: newMission.reward,
        tier: newMission.tier,
        urgent: newMission.urgent,
        latitude: newMission.latitude,
        longitude: newMission.longitude,
        duration: newMission.duration,
      },
    });
  }
  return NextResponse.json({ success: true, reward: assignment.mission.reward, newMoney, report })
}

async function generateMission(existingMissions: { country: string; type: string; title: string }[]) {
  const existing = existingMissions.map(m => `${m.country} - ${m.type} - ${m.title}`).join('\n')

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 500,
        messages: [{
          role: "user",
          content: `Sen bir uydu istihbarat oyunu için görev üretiyorsun. Yıl 2030.

        Mevcut görevler (bunlardan farklı olsun):
        ${existing}

        Yeni bir görev üret. Farklı bir ülke ve görev tipi seç.

        Görev tipleri: surveillance, reconnaissance, intelligence, emergency

Şu JSON formatında döndür, başka hiçbir şey yazma:
{
  "country": "ülke adı (Türkçe)",
  "flag": "emoji bayrağı",
  "title": "kısa görev başlığı (Türkçe, max 6 kelime)",
  "type": "görev tipi",
  "reward": ödül miktarı (1000-8000 arası integer),
  "tier": tier (1-3 arası integer),
  "urgent": true veya false,
  "latitude": enlem (float),
  "longitude": boylam (float),
  "duration": süre (6, 12, 24 veya 48)
}`
        }],
      }),
    });
    console.log("Anthropic status:", response.status);
    const data = await response.json();
    const text = data.content[0].text.replace(/```json|```/g, '').trim();
    return JSON.parse(text);
  } catch (e) {
    console.error("generateReport error:", e);
    console.log(e)
    return null;
  }
}