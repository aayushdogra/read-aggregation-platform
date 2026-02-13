import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// Mock Data
const mockBookings = [
  {
    id: "1",
    hotel: {
      id: "h1",
      name: "Taj Palace",
      rating: 4.7,
      city: "Delhi",
    },
    roomType: "DELUXE",
    nights: 3,
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
    payment: null,
    refund: null,
  },
  {
    id: "2",
    hotel: {
      id: "h2",
      name: "Oberoi",
      rating: 4.9,
      city: "Mumbai",
    },
    roomType: "SINGLE",
    nights: 2,
    status: "CREATED",
    createdAt: new Date().toISOString(),
    payment: null,
    refund: null,
  },
];

// GraphQL Schema
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
    id: ID!
    status: PaymentStatus!
    amount: Float!
    initiatedAt: DateTime!
    completedAt: DateTime
  }

  type RefundSummary {
    id: ID!
    status: RefundStatus!
    amount: Float!
    initiatedAt: DateTime!
    completedAt: DateTime
  }

  type HotelSummary {
    id: ID!
    name: String!
    rating: Float!
    city: String!
  }

  type BookingSummary {
    id: ID!
    hotel: HotelSummary!
    roomType: RoomType!
    nights: Int!
    status: BookingStatus!
    createdAt: DateTime!
    payment: PaymentSummary
    refund: RefundSummary
  }

  type UserProfile {
    id: ID!
    name: String!
    totalBookings: Int!
    activeBookings: Int!
    recentBookings: [BookingSummary!]!
  }

  type Query {
    health: String!
    booking(id: ID!): BookingSummary
    bookingsByUser(userId: ID!): [BookingSummary!]!
    userProfile(userId: ID!): UserProfile
  }
`;

// Resolvers
const resolvers = {
  Query: {
    health: () => "OK",

    booking: (_parent: unknown, args: { id: string }) => {
      const booking = mockBookings.find((b) => b.id === args.id);
      return booking || null;
    },

    bookingsByUser: () => [],

    userProfile: (_parent: unknown, args: { userId: string }) => null,
  },
};

// Server Bootstrap
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
