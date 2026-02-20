import { prisma } from "../lib/prisma.js";

// Fetch single booking
export async function getBookingById(id: string) {
  return prisma.booking.findUnique({
    where: { id },
  });
}

// Fetch all bookings for a user
export async function getBookingsByUser(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
  });
}
