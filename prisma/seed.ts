import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.mission.deleteMany()

  await prisma.mission.createMany({
    data: [
      { country: "Almanya", flag: "🇩🇪", title: "Doğu sınırı askeri hareket izleme", reward: 4200, tier: 1, urgent: true, latitude: 52, longitude: 13 },
      { country: "Japonya", flag: "🇯🇵", title: "Nükleer tesis inşaat raporu", reward: 8800, tier: 2, urgent: false, latitude: 35, longitude: 139 },
      { country: "Brezilya", flag: "🇧🇷", title: "Amazon kaynak tespiti", reward: 3100, tier: 1, urgent: false, latitude: -15, longitude: -47 },
      { country: "Hindistan", flag: "🇮🇳", title: "Kuzey sınırı hava sahası analizi", reward: 5500, tier: 2, urgent: true, latitude: 28, longitude: 77 },
      { country: "Norveç", flag: "🇳🇴", title: "Arktik buz örtüsü değişim raporu", reward: 2900, tier: 1, urgent: false, latitude: 60, longitude: 8 },
    ],
  })

  console.log("Seed tamamlandı.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())