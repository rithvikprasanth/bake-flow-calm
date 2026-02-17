export type OrderStatus = 
  | "inquiry" 
  | "confirmed" 
  | "baking" 
  | "ready" 
  | "out_for_delivery" 
  | "delivered";

export type PaymentStatus = "unpaid" | "pending" | "paid";

export type StatusGroup = "orders_in" | "baking" | "delivery" | "done";

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

// Map status groups to columns
export const STATUS_GROUP_CONFIG: Record<StatusGroup, {
  label: string;
  statuses: OrderStatus[];
  defaultStatus: OrderStatus;
}> = {
  orders_in: {
    label: "ORDERS IN",
    statuses: ["inquiry", "confirmed"],
    defaultStatus: "inquiry",
  },
  baking: {
    label: "BAKING",
    statuses: ["baking"],
    defaultStatus: "baking",
  },
  delivery: {
    label: "DELIVERY",
    statuses: ["ready", "out_for_delivery"],
    defaultStatus: "ready",
  },
  done: {
    label: "DONE",
    statuses: ["delivered"],
    defaultStatus: "delivered",
  },
};

export const STATUS_GROUPS: StatusGroup[] = ["orders_in", "baking", "delivery", "done"];

export function getStatusGroup(status: OrderStatus): StatusGroup {
  for (const [group, config] of Object.entries(STATUS_GROUP_CONFIG)) {
    if (config.statuses.includes(status)) return group as StatusGroup;
  }
  return "orders_in";
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

export function getUrgencyLevel(deadline: Date): "urgent" | "soon" | "normal" {
  const now = new Date();
  const hours = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (hours <= 4) return "urgent";
  if (hours <= 24) return "soon";
  return "normal";
}
