import { Plus, Minus, X } from "lucide-react";
import type { CartItem } from "@/types";

interface CartPanelProps {
  cart: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemove: (productId: string) => void;
}

export function CartPanel({ cart, onUpdateQty, onRemove }: CartPanelProps) {
  if (cart.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">Add products to start a sale</p>;
  }

  return (
    <>
      {cart.map(item => (
        <div key={item.productId} className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-md">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.name}</p>
            <p className="text-xs text-muted-foreground">₹{item.price} × {item.quantity} = ₹{(item.price * item.quantity).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <button onClick={() => onUpdateQty(item.productId, -1)} className="p-1 rounded hover:bg-accent"><Minus className="h-3 w-3" /></button>
            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
            <button onClick={() => onUpdateQty(item.productId, 1)} className="p-1 rounded hover:bg-accent"><Plus className="h-3 w-3" /></button>
            <button onClick={() => onRemove(item.productId)} className="p-1 rounded hover:bg-destructive/10 text-destructive ml-1"><X className="h-3 w-3" /></button>
          </div>
        </div>
      ))}
    </>
  );
}
