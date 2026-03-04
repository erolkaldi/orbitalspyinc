import { ApolloServer } from '@apollo/server'
import { NextRequest } from 'next/server'
import { typeDefs } from '@/graphql/schema'
import { resolvers } from '@/graphql/resolvers'

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.start()

export async function GET(req: NextRequest) {
  return server.executeHTTPGraphQLRequest({
    httpGraphQLRequest: {
      method: req.method!,
      headers: { entries: () => req.headers.entries() } as any,
      search: new URL(req.url).search,
      body: null,
    },
    context: async () => ({}),
  }) as any
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  return server.executeHTTPGraphQLRequest({
    httpGraphQLRequest: {
      method: req.method!,
      headers: { entries: () => req.headers.entries() } as any,
      search: new URL(req.url).search,
      body,
    },
    context: async () => ({}),
  }) as any
}