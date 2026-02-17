import { useState, useMemo, useEffect } from "react";
import {
  Order,
  StatusGroup,
  STATUS_GROUPS,
  STATUS_GROUP_CONFIG,
  getStatusGroup,
  getNextStatus,
  PaymentStatus,
} from "@/types/order";
import { mockOrders } from "@/data/mockOrders";
import KanbanColumn from "./KanbanColumn";
import OrderDetail from "./OrderDetail";
import AddOrderSheet from "./AddOrderSheet";
import { Plus, ChefHat, IndianRupee, Moon, Sun } from "lucide-react";

export default function KitchenBoard() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const groupedOrders = useMemo(() => {
    const grouped: Record<StatusGroup, Order[]> = {
      orders_in: [],
      baking: [],
      delivery: [],
      done: [],
    };
    orders.forEach((o) => {
      grouped[getStatusGroup(o.status)].push(o);
    });
    return grouped;
  }, [orders]);

  const handleAdvance = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const next = getNextStatus(o.status);
        return next ? { ...o, status: next } : o;
      })
    );
    setSelectedOrder((prev) => {
      if (!prev || prev.id !== orderId) return prev;
      const next = getNextStatus(prev.status);
      return next ? { ...prev, status: next } : prev;
    });
  };

  const handleUpdatePayment = (orderId: string, status: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o))
    );
    setSelectedOrder((prev) =>
      prev && prev.id === orderId ? { ...prev, paymentStatus: status } : prev
    );
  };

  const handleAddOrder = (order: Omit<Order, "id" | "createdAt">) => {
    const newOrder: Order = {
      ...order,
      id: String(Date.now()),
      createdAt: new Date(),
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleDragStart = (_e: React.DragEvent, orderId: string) => {
    setDraggedOrderId(orderId);
  };

  const handleDrop = (targetGroup: StatusGroup) => {
    if (!draggedOrderId) return;
    const config = STATUS_GROUP_CONFIG[targetGroup];
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== draggedOrderId) return o;
        // If already in this group, don't change
        if (config.statuses.includes(o.status)) return o;
        return { ...o, status: config.defaultStatus };
      })
    );
    setDraggedOrderId(null);
  };

  const totalPending = orders
    .filter((o) => o.status !== "delivered" && o.paymentStatus !== "paid")
    .reduce((sum, o) => sum + o.amount, 0);
  const activeCount = orders.filter((o) => o.status !== "delivered").length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-mono font-bold text-lg leading-tight">Kitchen Command</h1>
              <p className="text-xs text-muted-foreground font-mono">
                {activeCount} active · <IndianRupee className="w-3 h-3 inline" />{totalPending} pending
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              className="tap-target p-3 rounded-xl bg-secondary text-secondary-foreground transition-all active:scale-95"
              onClick={() => setIsDark((v) => !v)}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              className="tap-target flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-accent-foreground font-bold text-sm transition-all active:scale-95"
              onClick={() => setShowAddSheet(true)}
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Order</span>
            </button>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="flex-1 overflow-x-auto">
        <div className="flex gap-2 p-4 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
          {STATUS_GROUPS.map((group) => (
            <KanbanColumn
              key={group}
              group={group}
              orders={groupedOrders[group]}
              onAdvance={handleAdvance}
              onTapOrder={setSelectedOrder}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </main>

      {/* Order Detail Sheet */}
      <OrderDetail
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onAdvance={handleAdvance}
        onUpdatePayment={handleUpdatePayment}
      />

      {/* Add Order Sheet */}
      <AddOrderSheet
        open={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        onAdd={handleAddOrder}
      />
    </div>
  );
}
