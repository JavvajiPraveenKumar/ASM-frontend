import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { customers, mechanics } from "@/data/mockData";

interface CheckoutSectionProps {
  cartTotal: number;
  paidAmount: string;
  onPaidAmountChange: (value: string) => void;
  due: number;
  selectedCustomer: string;
  onCustomerChange: (value: string) => void;
  selectedMechanic: string;
  onMechanicChange: (value: string) => void;
  paymentMethod: string;
  onPaymentMethodChange: (value: string) => void;
  commissionPreview: number;
  onCompleteSale: () => void;
  cartEmpty: boolean;
}

export function CheckoutSection({
  cartTotal, paidAmount, onPaidAmountChange, due,
  selectedCustomer, onCustomerChange,
  selectedMechanic, onMechanicChange,
  paymentMethod, onPaymentMethodChange,
  commissionPreview, onCompleteSale, cartEmpty,
}: CheckoutSectionProps) {
  return (
    <div className="border-t p-4 space-y-3">
      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>₹{cartTotal.toLocaleString()}</span>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground">Paid Amount</label>
        <Input type="number" value={paidAmount} onChange={e => onPaidAmountChange(e.target.value)} placeholder="0" />
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Due Amount</span>
        <span className={due > 0 ? "font-bold text-destructive" : "font-bold text-success"}>₹{due.toLocaleString()}</span>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground">Customer</label>
        <Select value={selectedCustomer} onValueChange={onCustomerChange}>
          <SelectTrigger><SelectValue placeholder="Walk-in customer" /></SelectTrigger>
          <SelectContent>
            {customers.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name} - {c.phone}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground">Mechanic (optional)</label>
        <Select value={selectedMechanic} onValueChange={onMechanicChange}>
          <SelectTrigger><SelectValue placeholder="No mechanic" /></SelectTrigger>
          <SelectContent>
            {mechanics.map(m => (
              <SelectItem key={m.id} value={m.id}>{m.name} ({m.commissionRate}%)</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {commissionPreview > 0 && (
          <p className="text-xs text-info mt-1">Commission: ₹{commissionPreview.toLocaleString()}</p>
        )}
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground">Payment Method</label>
        <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Cash">Cash</SelectItem>
            <SelectItem value="UPI">UPI</SelectItem>
            <SelectItem value="Card">Card</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button className="w-full" size="lg" onClick={onCompleteSale} disabled={cartEmpty}>
        Complete Sale
      </Button>
    </div>
  );
}
