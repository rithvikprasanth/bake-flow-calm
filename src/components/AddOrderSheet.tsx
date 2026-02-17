import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { X, Plus } from "lucide-react";
import { Order, OrderStatus, PaymentStatus } from "@/types/order";

interface AddOrderSheetProps {
  open: boolean;
  onClose: () => void;
  onAdd: (order: Omit<Order, "id" | "createdAt">) => void;
}

const quickItems = [
  "Chocolate Cake",
  "Vanilla Cake",
  "Red Velvet Cake",
  "Cupcakes x12",
  "Cupcakes x24",
  "Brownies x12",
  "Cookies x24",
  "Banana Bread",
  "Cheesecake",
  "Fruit Cake",
];

const quickDeadlines = [
  { label: "3 hours", hours: 3 },
  { label: "6 hours", hours: 6 },
  { label: "Tomorrow", hours: 24 },
  { label: "2 days", hours: 48 },
  { label: "3 days", hours: 72 },
  { label: "1 week", hours: 168 },
];

export default function AddOrderSheet({ open, onClose, onAdd }: AddOrderSheetProps) {
  const [customerName, setCustomerName] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedDeadline, setSelectedDeadline] = useState<number | null>(null);
  const [amount, setAmount] = useState("");

  const reset = () => {
    setCustomerName("");
    setSelectedItem("");
    setSelectedDeadline(null);
    setAmount("");
  };

  const handleSubmit = () => {
    if (!customerName || !selectedItem || selectedDeadline === null) return;

    onAdd({
      customerName,
      items: selectedItem,
      quantity: 1,
      amount: Number(amount) || 0,
      status: "inquiry" as OrderStatus,
      paymentStatus: "unpaid" as PaymentStatus,
      deadline: new Date(Date.now() + selectedDeadline * 60 * 60 * 1000),
    });
    reset();
    onClose();
  };

  const isValid = customerName && selectedItem && selectedDeadline !== null;

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[90vh] overflow-y-auto bg-card p-0">
        <SheetHeader className="p-5 pb-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-mono text-xl">New Order</SheetTitle>
            <button
              onClick={() => { reset(); onClose(); }}
              className="tap-target p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </SheetHeader>

        <div className="px-5 pb-8 space-y-6">
          {/* Customer name */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Type name..."
              className="w-full tap-target px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground text-lg focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Quick-pick items */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              What are they ordering?
            </label>
            <div className="flex flex-wrap gap-2">
              {quickItems.map((item) => (
                <button
                  key={item}
                  className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all active:scale-95 ${
                    selectedItem === item
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full tap-target px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground text-lg font-mono focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Quick-pick deadline */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Deadline
            </label>
            <div className="grid grid-cols-3 gap-2">
              {quickDeadlines.map((d) => (
                <button
                  key={d.hours}
                  className={`tap-target py-3 rounded-lg font-semibold text-sm transition-all active:scale-95 ${
                    selectedDeadline === d.hours
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                  onClick={() => setSelectedDeadline(d.hours)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            className={`tap-target w-full py-5 rounded-xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
              isValid
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
            onClick={handleSubmit}
            disabled={!isValid}
          >
            <Plus className="w-5 h-5" />
            Add Order
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
