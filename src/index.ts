import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import depthLimit from "graphql-depth-limit";
import { prisma } from "./lib/prisma.js";
import { createHotelLoader } from "./loaders/hotelLoader.js";
import {
  getBookingById,
  getBookingsByUser,
} from "./services/bookingService.js";

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
    userId: ID!
    hotel: HotelSummary!
    roomType: RoomType!
    nights: Int!
    status: BookingStatus!
    createdAt: DateTime!
    payment: PaymentSummary
    refunds: [RefundSummary!]!
  }

  type UserBookingSummary {
    userId: ID!
    totalBookings: Int!
    activeBookings: Int!
  }

  type Query {
    health: String!
    booking(id: ID!): BookingSummary
    bookingsByUser(userId: ID!): [BookingSummary!]!
    userBookingSummary(userId: ID!): UserBookingSummary
  }
`;

// Resolvers

const resolvers = {
  Query: {
    health: () => "OK",

    booking: async (_: unknown, args: { id: string }) => {
      return getBookingById(args.id);
    },

    bookingsByUser: async (_: unknown, args: { userId: string }) => {
      return getBookingsByUser(args.userId);
    },

    userBookingSummary: async (_: unknown, args: { userId: string }) => {
      const userBookings = await getBookingsByUser(args.userId);

      const totalBookings = userBookings.length;

      const activeBookings = userBookings.filter(
        (b) => b.status === "CREATED" || b.status === "CONFIRMED",
      ).length;

      return {
        userId: args.userId,
        totalBookings,
        activeBookings,
      };
    },
  },

  BookingSummary: {
    hotel: (parent: any, _: any, ctx: any) =>
      ctx.loaders.hotelLoader.load(parent.hotelId),

    payment: (parent: any) =>
      prisma.payment.findUnique({
        where: { bookingId: parent.id },
      }),

    refunds: (parent: any) =>
      prisma.refund.findMany({
        where: { bookingId: parent.id },
      }),
  },
};

// Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,

  // Security: Limit query depth to prevent abuse
  validationRules: [depthLimit(5)],

  // Error abstraction layer to prevent leaking internal details
  formatError: (formattedError) => {
    // Custom error mapping
    if (formattedError.extensions?.code === "BAD_USER_INPUT") {
      return { message: "BAD_REQUEST" };
    }

    if (formattedError.extensions?.code === "GRAPHQL_VALIDATION_FAILED") {
      return { message: "BAD_REQUEST" };
    }

    return { message: "INTERNAL_ERROR" };
  },
});

async function start() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },

    // Request-scoped DataLoader
    context: async () => ({
      prisma,
      loaders: {
        hotelLoader: createHotelLoader(prisma),
      },
    }),
  });

  console.log(`Server running at ${url}`);
}

start();
