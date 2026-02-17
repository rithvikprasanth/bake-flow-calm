import {
  Order,
  STATUS_LABELS,
  getNextStatus,
  getDeadlineLabel,
  PaymentStatus,
  OrderStatus,
} from "@/types/order";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Clock,
  ChevronRight,
  Phone,
  IndianRupee,
  MessageSquare,
  Camera,
  X,
  CheckCircle2,
} from "lucide-react";

interface OrderDetailProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onAdvance: (orderId: string) => void;
  onUpdatePayment: (orderId: string, status: PaymentStatus) => void;
}

const statusSteps: OrderStatus[] = [
  "inquiry",
  "confirmed",
  "baking",
  "ready",
  "out_for_delivery",
  "delivered",
];

export default function OrderDetail({
  order,
  open,
  onClose,
  onAdvance,
  onUpdatePayment,
}: OrderDetailProps) {
  if (!order) return null;

  const nextStatus = getNextStatus(order.status);
  const deadlineLabel = getDeadlineLabel(order.deadline);
  const isOverdue = deadlineLabel === "OVERDUE";
  const currentIdx = statusSteps.indexOf(order.status);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto bg-card p-0">
        <SheetHeader className="p-5 pb-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-mono text-xl">{order.customerName}</SheetTitle>
            <button
              onClick={onClose}
              className="tap-target p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </SheetHeader>

        <div className="px-5 pb-8 space-y-6">
          {/* Order info */}
          <div className="space-y-2">
            <p className="text-lg font-semibold">{order.items}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <IndianRupee className="w-4 h-4" />
                {order.amount}
              </span>
              <span className={`flex items-center gap-1 font-bold ${isOverdue ? "text-status-now" : ""}`}>
                <Clock className="w-4 h-4" />
                {deadlineLabel}
              </span>
              {order.phone && (
                <a
                  href={`tel:${order.phone}`}
                  className="flex items-center gap-1 text-accent"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Phone className="w-4 h-4" />
                  Call
                </a>
              )}
            </div>
          </div>

          {/* Status pipeline - visual stepper */}
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Status Pipeline
            </p>
            <div className="flex items-center gap-1">
              {statusSteps.map((step, i) => (
                <div key={step} className="flex items-center gap-1 flex-1">
                  <div
                    className={`h-2 flex-1 rounded-full transition-colors ${
                      i <= currentIdx ? "bg-accent" : "bg-secondary"
                    }`}
                  />
                </div>
              ))}
            </div>
            <p className="text-sm font-mono text-accent">
              {STATUS_LABELS[order.status]}
            </p>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="space-y-1">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                Notes
              </p>
              <p className="text-sm bg-secondary p-3 rounded-lg">{order.notes}</p>
            </div>
          )}

          {/* Payment section */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Payment
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(["unpaid", "pending", "paid"] as PaymentStatus[]).map((ps) => (
                <button
                  key={ps}
                  className={`tap-target py-3 rounded-lg font-semibold text-sm transition-all active:scale-95 ${
                    order.paymentStatus === ps
                      ? ps === "paid"
                        ? "bg-payment-paid text-status-now-foreground"
                        : ps === "pending"
                        ? "bg-payment-pending text-status-next-foreground"
                        : "bg-payment-unpaid text-status-now-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                  onClick={() => onUpdatePayment(order.id, ps)}
                >
                  {ps === "paid" && <CheckCircle2 className="w-4 h-4 inline mr-1" />}
                  {ps.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Attach payment screenshot - placeholder */}
          <button className="tap-target w-full py-4 rounded-lg border-2 border-dashed border-border flex items-center justify-center gap-2 text-muted-foreground hover:border-accent hover:text-accent transition-colors active:scale-[0.98]">
            <Camera className="w-5 h-5" />
            <span className="font-semibold text-sm">Attach Payment Screenshot</span>
          </button>

          {/* Advance button - big and obvious */}
          {nextStatus && (
            <button
              className="tap-target w-full py-5 rounded-xl bg-accent text-accent-foreground font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              onClick={() => {
                onAdvance(order.id);
                if (nextStatus === "delivered") onClose();
              }}
            >
              Move to {STATUS_LABELS[nextStatus]}
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
