import { Order, StatusGroup, STATUS_GROUP_CONFIG } from "@/types/order";
import OrderCard from "./OrderCard";
import { useState } from "react";

interface KanbanColumnProps {
  group: StatusGroup;
  orders: Order[];
  onAdvance: (orderId: string) => void;
  onTapOrder: (order: Order) => void;
  onDragStart: (e: React.DragEvent, orderId: string) => void;
  onDrop: (group: StatusGroup) => void;
}

const groupStyles: Record<StatusGroup, { colorClass: string; dotClass: string; dropHighlight: string }> = {
  orders_in: {
    colorClass: "text-status-next",
    dotClass: "bg-status-next",
    dropHighlight: "border-status-next bg-status-next-bg",
  },
  baking: {
    colorClass: "text-status-now",
    dotClass: "bg-status-now animate-pulse-urgent",
    dropHighlight: "border-status-now bg-status-now-bg",
  },
  delivery: {
    colorClass: "text-status-later",
    dotClass: "bg-status-later",
    dropHighlight: "border-status-later bg-status-later-bg",
  },
  done: {
    colorClass: "text-status-done",
    dotClass: "bg-status-done",
    dropHighlight: "border-status-done bg-status-done-bg",
  },
};

export default function KanbanColumn({
  group,
  orders,
  onAdvance,
  onTapOrder,
  onDragStart,
  onDrop,
}: KanbanColumnProps) {
  const config = STATUS_GROUP_CONFIG[group];
  const style = groupStyles[group];
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(group);
  };

  return (
    <div
      className={`flex flex-col min-w-[280px] max-w-[380px] flex-1 rounded-xl p-3 transition-all duration-200 ${
        isDragOver ? `border-2 border-dashed ${style.dropHighlight}` : "border-2 border-transparent"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Lane header */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className={`w-3 h-3 rounded-full ${style.dotClass}`} />
        <h2 className={`font-mono font-bold text-lg tracking-wider ${style.colorClass}`}>
          {config.label}
        </h2>
        <span className="ml-auto text-sm font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
          {orders.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto pb-4">
        {orders.length === 0 && (
          <div className={`flex items-center justify-center h-24 rounded-lg border-2 border-dashed text-sm font-mono transition-colors ${
            isDragOver ? `${style.dropHighlight} ${style.colorClass}` : "border-border text-muted-foreground"
          }`}>
            {isDragOver ? "Drop here" : "No orders"}
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
              onDragStart={onDragStart}
            />
          ))}
      </div>
    </div>
  );
}
