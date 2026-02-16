export type PaymentStatus = "INITIATED" | "SUCCESS" | "FAILED";

export interface Payment {
  id: string;
  bookingId: string;
  status: PaymentStatus;
  amount: number;
  initiatedAt: string;
  completedAt?: string;
}

const payments: Payment[] = [
  {
    id: "p1",
    bookingId: "1",
    status: "SUCCESS",
    amount: 5000,
    initiatedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
];

export function getPaymentByBookingId(bookingId: string): Payment | null {
  return payments.find((p) => p.bookingId === bookingId) ?? null;
}
