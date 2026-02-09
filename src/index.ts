import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const server = new ApolloServer({
  typeDefs: `#graphql
    type Query {
      health: String!
    }
  `,
  resolvers: {
    Query: {
      health: () => 'OK',
    },
  },
});

async function start() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`Server running at ${url}`);
}

start();
