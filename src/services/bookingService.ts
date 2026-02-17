import { prisma } from "../lib/prisma.js";
import type { Booking } from "@prisma/client";

// Fetch single booking
export async function getBookingById(id: string): Promise<Booking | null> {
  return prisma.booking.findUnique({
    where: { id },
  });
}

// Fetch all bookings for a user
export async function getBookingsByUser(userId: string): Promise<Booking[]> {
  return prisma.booking.findMany({
    where: { userId },
  });
}
