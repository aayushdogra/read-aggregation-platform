export type BookingStatus = "CREATED" | "CONFIRMED" | "CANCELLED" | "EXPIRED";

export interface Hotel {
  id: string;
  name: string;
  rating: number;
  city: string;
}

export type RoomType = "SINGLE" | "DOUBLE" | "DELUXE" | "SUITE";

export interface Booking {
  id: string;
  userId: string;
  hotel: Hotel;
  roomType: RoomType;
  nights: number;
  status: BookingStatus;
  createdAt: string;
}

// Mock data
const bookings: Booking[] = [
  {
    id: "1",
    userId: "u1",
    hotel: {
      id: "h1",
      name: "Taj Palace",
      rating: 4.7,
      city: "Bangkok",
    },
    roomType: "DELUXE",
    nights: 3,
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "u1",
    hotel: {
      id: "h2",
      name: "Hilton",
      rating: 4.9,
      city: "Phuket",
    },
    roomType: "SINGLE",
    nights: 2,
    status: "CREATED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    userId: "u2",
    hotel: {
      id: "h3",
      name: "Hyatt Regency",
      rating: 4.6,
      city: "Bangkok",
    },
    roomType: "SUITE",
    nights: 4,
    status: "CANCELLED",
    createdAt: new Date().toISOString(),
  },
];

// Service Functions
export function getBookingById(id: string): Booking | null {
  const booking = bookings.find((b) => b.id === id);
  return booking ?? null;
}

export function getBookingsByUser(userId: string): Booking[] {
  return bookings.filter((b) => b.userId === userId);
}
