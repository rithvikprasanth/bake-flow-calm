import { Order, Lane } from "@/types/order";
import OrderCard from "./OrderCard";

interface KanbanColumnProps {
  lane: Lane;
  orders: Order[];
  onAdvance: (orderId: string) => void;
  onTapOrder: (order: Order) => void;
}

const laneConfig: Record<Lane, { label: string; colorClass: string; dotClass: string }> = {
  now: {
    label: "NOW",
    colorClass: "text-status-now",
    dotClass: "bg-status-now animate-pulse-urgent",
  },
  next: {
    label: "NEXT",
    colorClass: "text-status-next",
    dotClass: "bg-status-next",
  },
  later: {
    label: "LATER",
    colorClass: "text-status-later",
    dotClass: "bg-status-later",
  },
  done: {
    label: "DONE",
    colorClass: "text-status-done",
    dotClass: "bg-status-done",
  },
};

export default function KanbanColumn({ lane, orders, onAdvance, onTapOrder }: KanbanColumnProps) {
  const config = laneConfig[lane];

  return (
    <div className="flex flex-col min-w-[300px] max-w-[380px] flex-1">
      {/* Lane header */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className={`w-3 h-3 rounded-full ${config.dotClass}`} />
        <h2 className={`font-mono font-bold text-lg tracking-wider ${config.colorClass}`}>
          {config.label}
        </h2>
        <span className="ml-auto text-sm font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
          {orders.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto pb-4">
        {orders.length === 0 && (
          <div className="flex items-center justify-center h-24 rounded-lg border-2 border-dashed border-border text-muted-foreground text-sm font-mono">
            No orders
          </div>
        )}
        {orders
          .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
          .map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAdvance={onAdvance}
              onTap={onTapOrder}
            />
          ))}
      </div>
    </div>
  );
}
