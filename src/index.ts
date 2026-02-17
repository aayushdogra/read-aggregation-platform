import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import {
  getBookingById,
  getBookingsByUser,
} from "./services/bookingService.js";
import { getPaymentByBookingId } from "./services/paymentService.js";
import { getRefundByBookingId } from "./services/refundService.js";

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
    refund: RefundSummary
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

    booking: async (_parent: unknown, args: { id: string }) => {
      const booking = await getBookingById(args.id);

      if (!booking) return null;

      // Temporary mapping for hotel object
      return {
        ...booking,
        hotel: {
          id: "temp-id",
          name: booking.hotelName,
          rating: 4.5,
          city: "Unknown",
        },
      };
    },

    bookingsByUser: async (_parent: unknown, args: { userId: string }) => {
      const bookings = await getBookingsByUser(args.userId);

      return bookings.map((booking) => ({
        ...booking,
        hotel: {
          id: "temp-id",
          name: booking.hotelName,
          rating: 4.5,
          city: "Unknown",
        },
      }));
    },

    userBookingSummary: async (_parent: unknown, args: { userId: string }) => {
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
    payment: (parent: { id: string }) => {
      return getPaymentByBookingId(parent.id);
    },

    refund: (parent: { id: string }) => {
      return getRefundByBookingId(parent.id);
    },
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
