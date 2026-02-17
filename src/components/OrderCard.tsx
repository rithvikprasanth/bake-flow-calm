import { Order, getDeadlineLabel, STATUS_LABELS, getNextStatus, PaymentStatus, getUrgencyLevel } from "@/types/order";
import { Clock, ChevronRight, IndianRupee, Camera, MessageSquare, GripVertical } from "lucide-react";

interface OrderCardProps {
  order: Order;
  onAdvance: (orderId: string) => void;
  onTap: (order: Order) => void;
  onDragStart: (e: React.DragEvent, orderId: string) => void;
}

const paymentColors: Record<PaymentStatus, string> = {
  paid: "bg-payment-paid text-status-now-foreground",
  pending: "bg-payment-pending text-status-next-foreground",
  unpaid: "bg-payment-unpaid text-status-now-foreground",
};

const paymentLabels: Record<PaymentStatus, string> = {
  paid: "PAID",
  pending: "₹ PENDING",
  unpaid: "UNPAID",
};

export default function OrderCard({ order, onAdvance, onTap, onDragStart }: OrderCardProps) {
  const deadlineLabel = getDeadlineLabel(order.deadline);
  const isOverdue = deadlineLabel === "OVERDUE";
  const urgency = getUrgencyLevel(order.deadline);
  const nextStatus = getNextStatus(order.status);
  const isDone = order.status === "delivered";

  const urgencyBorder = isDone
    ? "border-border bg-muted/50 opacity-70"
    : isOverdue
    ? "border-status-now bg-status-now-bg status-glow-now"
    : urgency === "urgent"
    ? "border-status-now/40 bg-status-now-bg"
    : urgency === "soon"
    ? "border-status-next/40 bg-status-next-bg"
    : "border-border bg-card";

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, order.id)}
      className={`relative rounded-lg border-2 p-4 ticket-shadow transition-all active:scale-[0.98] animate-slide-up cursor-grab active:cursor-grabbing ${urgencyBorder}`}
      onClick={() => onTap(order)}
    >
      {/* Drag handle */}
      <div className="absolute top-2 right-2 text-muted-foreground/40">
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Top row: Customer + Deadline */}
      <div className="flex items-start justify-between gap-2 mb-3 pr-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate text-foreground">
            {order.customerName}
          </h3>
          <p className="text-sm text-muted-foreground truncate">{order.items}</p>
        </div>
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-mono text-sm font-bold shrink-0 ${
            isOverdue
              ? "bg-status-now text-status-now-foreground animate-pulse-urgent"
              : urgency === "urgent"
              ? "bg-status-now/20 text-status-now"
              : urgency === "soon"
              ? "bg-status-next/20 text-status-next"
              : isDone
              ? "bg-status-done text-status-done-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          {deadlineLabel}
        </div>
      </div>

      {/* Middle row */}
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center gap-0.5 text-sm font-semibold text-foreground">
          <IndianRupee className="w-3.5 h-3.5" />
          {order.amount}
        </span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${paymentColors[order.paymentStatus]}`}>
          {paymentLabels[order.paymentStatus]}
        </span>
        {order.notes && <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />}
        {order.paymentScreenshot && <Camera className="w-3.5 h-3.5 text-payment-paid" />}
      </div>

      {/* Bottom: Status + Advance */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          {STATUS_LABELS[order.status]}
        </span>
        {nextStatus && (
          <button
            className="tap-target flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground font-semibold text-sm transition-all active:scale-95 hover:opacity-90"
            onClick={(e) => {
              e.stopPropagation();
              onAdvance(order.id);
            }}
          >
            {STATUS_LABELS[nextStatus]}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {order.quantity > 1 && (
        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
          x{order.quantity}
        </div>
      )}
    </div>
  );
}
