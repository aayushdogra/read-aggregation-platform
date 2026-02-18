import { prisma } from "./lib/prisma.js";

async function main() {
  const hotel = await prisma.hotel.create({
    data: {
      name: "Taj Palace",
      city: "Mumbai",
      rating: 4.7,
    },
  });

  const booking = await prisma.booking.create({
    data: {
      userId: "user1",
      hotelId: hotel.id,
      roomType: "DELUXE",
      nights: 2,
      status: "CONFIRMED",
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      status: "SUCCESS",
      amount: 5000,
      initiatedAt: new Date(),
      completedAt: new Date(),
    },
  });

  await prisma.refund.create({
    data: {
      bookingId: booking.id,
      status: "INITIATED",
      amount: 1000,
      initiatedAt: new Date(),
    },
  });
}

main().finally(() => prisma.$disconnect());
