import { useState } from "react";
import { customers, recentSales } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Payments() {
  const { toast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedSale, setSelectedSale] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");

  const customer = customers.find(c => c.id === selectedCustomer);
  const outstandingSales = recentSales.filter(s => s.customerId === selectedCustomer && s.due > 0);
  const sale = outstandingSales.find(s => s.id === selectedSale);

  const handleSubmit = () => {
    const amt = parseFloat(amount);
    if (!sale || !amt || amt <= 0) {
      toast({ title: "Invalid payment", variant: "destructive" });
      return;
    }
    if (amt > sale.due) {
      toast({ title: "Amount exceeds due", description: `Max payable: ₹${sale.due}`, variant: "destructive" });
      return;
    }
    toast({ title: "Payment recorded!", description: `₹${amt.toLocaleString()} received from ${customer?.name}` });
    setAmount("");
    setSelectedSale("");
  };

  return (
    <div className="space-y-4">
      <h2 className="page-header">Payment Collection</h2>

      <div className="max-w-xl bg-card rounded-lg border shadow-sm p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Select Customer</label>
          <Select value={selectedCustomer} onValueChange={v => { setSelectedCustomer(v); setSelectedSale(""); }}>
            <SelectTrigger><SelectValue placeholder="Choose customer..." /></SelectTrigger>
            <SelectContent>
              {customers.filter(c => c.totalOutstanding > 0).map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name} (₹{c.totalOutstanding.toLocaleString()} due)</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCustomer && outstandingSales.length > 0 && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Outstanding Sales</label>
            <Select value={selectedSale} onValueChange={setSelectedSale}>
              <SelectTrigger><SelectValue placeholder="Select sale..." /></SelectTrigger>
              <SelectContent>
                {outstandingSales.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.id} - Due: ₹{s.due.toLocaleString()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedCustomer && outstandingSales.length === 0 && (
          <p className="text-sm text-muted-foreground">No outstanding sales for this customer.</p>
        )}

        {sale && (
          <>
            <div className="bg-muted/50 rounded-md p-3 text-sm space-y-1">
              <p><strong>Sale:</strong> {sale.id} · {sale.date}</p>
              <p><strong>Total:</strong> ₹{sale.total.toLocaleString()} · <strong>Paid:</strong> ₹{sale.paid.toLocaleString()} · <span className="text-destructive font-medium">Due: ₹{sale.due.toLocaleString()}</span></p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Payment Amount</label>
              <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" max={sale.due} />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSubmit} className="w-full">Submit Payment</Button>
          </>
        )}
      </div>
    </div>
  );
}
