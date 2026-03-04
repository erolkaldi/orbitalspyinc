export const typeDefs = `#graphql
  type User {
    id: String!
    name: String
    email: String
    money: Int!
    level: Int!
    satellites: [Satellite!]!
  }

  type Satellite {
    id: String!
    name: String!
    tier: Int!
  }

  type Query {
    me: User
  }
`