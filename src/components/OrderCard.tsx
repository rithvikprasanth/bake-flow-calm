import { Order, getDeadlineLabel, STATUS_LABELS, getNextStatus, PaymentStatus } from "@/types/order";
import { Clock, ChevronRight, Phone, IndianRupee, Camera, MessageSquare } from "lucide-react";

interface OrderCardProps {
  order: Order;
  onAdvance: (orderId: string) => void;
  onTap: (order: Order) => void;
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

export default function OrderCard({ order, onAdvance, onTap }: OrderCardProps) {
  const deadlineLabel = getDeadlineLabel(order.deadline);
  const isOverdue = deadlineLabel === "OVERDUE";
  const nextStatus = getNextStatus(order.status);
  const isDone = order.status === "delivered";

  return (
    <div
      className={`relative rounded-lg border-2 p-4 ticket-shadow transition-all active:scale-[0.98] animate-slide-up ${
        isDone
          ? "border-border bg-muted/50 opacity-70"
          : isOverdue
          ? "border-status-now bg-status-now-bg status-glow-now"
          : "border-border bg-card hover:ticket-shadow-hover"
      }`}
      onClick={() => onTap(order)}
    >
      {/* Top row: Customer + Deadline */}
      <div className="flex items-start justify-between gap-2 mb-3">
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
              : isDone
              ? "bg-status-done text-status-done-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          {deadlineLabel}
        </div>
      </div>

      {/* Middle row: Amount + Payment + Notes indicators */}
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center gap-0.5 text-sm font-semibold text-foreground">
          <IndianRupee className="w-3.5 h-3.5" />
          {order.amount}
        </span>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${paymentColors[order.paymentStatus]}`}
        >
          {paymentLabels[order.paymentStatus]}
        </span>
        {order.notes && (
          <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
        )}
        {order.paymentScreenshot && (
          <Camera className="w-3.5 h-3.5 text-payment-paid" />
        )}
      </div>

      {/* Bottom: Status + Advance button */}
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

      {/* Quantity badge */}
      {order.quantity > 1 && (
        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
          x{order.quantity}
        </div>
      )}
    </div>
  );
}
