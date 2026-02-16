export type RefundStatus = "INITIATED" | "SUCCESS" | "FAILED";

export interface Refund {
  id: string;
  bookingId: string;
  status: RefundStatus;
  amount: number;
  initiatedAt: string;
  completedAt?: string;
}

const refunds: Refund[] = [];

export function getRefundByBookingId(bookingId: string): Refund | null {
  return refunds.find((r) => r.bookingId === bookingId) ?? null;
}
