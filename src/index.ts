import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#graphql
  scalar DateTime

  enum BookingStatus {
    CREATED
    CONFIRMED
    CANCELLED
    EXPIRED
  }

  enum PaymentStatus {
    INITIATED
    SUCCESS
    FAILED
  }

  enum RefundStatus {
    INITIATED
    SUCCESS
    FAILED
  }

  enum RoomType {
    SINGLE
    DOUBLE
    DELUXE
    SUITE
  }

  type PaymentSummary {
    paymentId: ID!
    status: PaymentStatus!
    amount: Float!
    initiatedAt: DateTime!
    completedAt: DateTime
  }

  type RefundSummary {
    refundId: ID!
    status: RefundStatus!
    amount: Float!
    initiatedAt: DateTime!
    completedAt: DateTime
  }

  type BookingSummary {
    bookingId: ID!
    hotelName: String!
    roomType: RoomType!
    nights: Int!
    status: BookingStatus!
    createdAt: String!
    payment: PaymentSummary
    refund: RefundSummary
  }

  type Query {
    health: String!
    booking(id: ID!): BookingSummary
    bookingsByUser(userId: ID!): [BookingSummary!]!
  }
`;

const resolvers = {
  Query: {
    health: () => "OK",
    booking: () => null,
    bookingsByUser: () => [],
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function start() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`Server running at ${url}`);
}

start();
