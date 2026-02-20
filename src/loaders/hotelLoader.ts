import DataLoader from "dataloader";
import { PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export const createHotelLoader = (prisma: PrismaClient) =>
  new DataLoader(async (hotelIds: readonly string[]) => {
    const hotels = await prisma.hotel.findMany({
      where: { id: { in: hotelIds as string[] } },
    });

    const hotelMap = new Map(hotels.map((h) => [h.id, h]));

    return hotelIds.map((id) => hotelMap.get(id) || null);
  });
