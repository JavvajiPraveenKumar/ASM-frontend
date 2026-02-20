import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { customers, mechanics } from "@/data/mockData";
import type { CartItem } from "@/types";

interface SaleConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  cartTotal: number;
  paid: number;
  due: number;
  paymentMethod: string;
  selectedCustomer: string;
  selectedMechanic: string;
  commissionPreview: number;
  onConfirm: () => void;
}

export function SaleConfirmDialog({
  open, onOpenChange, cart, cartTotal, paid, due,
  paymentMethod, selectedCustomer, selectedMechanic,
  commissionPreview, onConfirm,
}: SaleConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Sale</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 text-sm">
          <p><strong>Items:</strong> {cart.length}</p>
          <p><strong>Total:</strong> ₹{cartTotal.toLocaleString()}</p>
          <p><strong>Paid:</strong> ₹{paid.toLocaleString()}</p>
          {due > 0 && <p className="text-destructive"><strong>Due:</strong> ₹{due.toLocaleString()} (Credit)</p>}
          <p><strong>Payment:</strong> {paymentMethod}</p>
          {selectedCustomer && <p><strong>Customer:</strong> {customers.find(c => c.id === selectedCustomer)?.name}</p>}
          {selectedMechanic && <p><strong>Mechanic:</strong> {mechanics.find(m => m.id === selectedMechanic)?.name} (₹{commissionPreview})</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
