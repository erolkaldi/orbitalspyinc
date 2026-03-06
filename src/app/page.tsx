import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import OrbitalSpyInc from '@/components/OrbitalSpyInc'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
  redirect('/login')
}

  const user = await prisma.user.findUnique({
  where: { email: session.user.email! },
  include: { 
    satellites: true,
    assignments: {
      where: { status: 'active' },
    },
  },
})

const missions = await prisma.mission.findMany()
if (!user?.isOnboarded) {
  redirect('/onboarding')
}
return (
  <OrbitalSpyInc
    username={user!.username ?? ''}
    companyName={user!.companyName ?? ''}
    money={user!.money}
    level={user!.level}
    satellites={user!.satellites}
    missions={missions}
    assignments={user!.assignments}
  />
)
}