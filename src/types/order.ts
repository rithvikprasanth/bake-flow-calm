export type OrderStatus = 
  | "inquiry" 
  | "confirmed" 
  | "baking" 
  | "ready" 
  | "out_for_delivery" 
  | "delivered";

export type PaymentStatus = "unpaid" | "pending" | "paid";

export type Lane = "now" | "next" | "later" | "done";

export interface Order {
  id: string;
  customerName: string;
  items: string;
  quantity: number;
  amount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deadline: Date;
  notes?: string;
  paymentScreenshot?: string;
  createdAt: Date;
  phone?: string;
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  inquiry: "Inquiry",
  confirmed: "Confirmed",
  baking: "Baking",
  ready: "Ready",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

export const STATUS_FLOW: OrderStatus[] = [
  "inquiry",
  "confirmed",
  "baking",
  "ready",
  "out_for_delivery",
  "delivered",
];

export function getNextStatus(current: OrderStatus): OrderStatus | null {
  const idx = STATUS_FLOW.indexOf(current);
  if (idx === -1 || idx === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[idx + 1];
}

export function getOrderLane(order: Order): Lane {
  if (order.status === "delivered") return "done";
  
  const now = new Date();
  const hoursUntilDeadline = (order.deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hoursUntilDeadline <= 4 || order.status === "baking" || order.status === "ready" || order.status === "out_for_delivery") {
    return "now";
  }
  if (hoursUntilDeadline <= 24) {
    return "next";
  }
  return "later";
}

export function getDeadlineLabel(deadline: Date): string {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diff < 0) return "OVERDUE";
  if (hours < 1) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
