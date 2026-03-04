import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export const resolvers = {
  Query: {
    me: async () => {
      const session = await getServerSession()
      if (!session?.user?.email) return null

      return prisma.user.findUnique({
        where: { email: session.user.email },
        include: { satellites: true },
      })
    },
  },
}