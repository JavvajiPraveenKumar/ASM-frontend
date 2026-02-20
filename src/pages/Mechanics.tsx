import { useState } from "react";
import { mechanics, recentSales } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function Mechanics() {
  const { toast } = useToast();
  const [selectedMechanic, setSelectedMechanic] = useState<string | null>(null);
  const mechanic = mechanics.find(m => m.id === selectedMechanic);
  const linkedSales = recentSales.filter(s => s.mechanicId === selectedMechanic);

  return (
    <div className="space-y-4">
      <h2 className="page-header">Mechanics</h2>

      <div className="bg-card rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Phone</th><th>Commission Rate</th><th>Pending</th><th></th></tr>
            </thead>
            <tbody>
              {mechanics.map(m => (
                <tr key={m.id}>
                  <td className="font-medium">{m.name}</td>
                  <td className="text-muted-foreground">{m.phone}</td>
                  <td>{m.commissionRate}%</td>
                  <td className="text-warning font-medium">₹{m.totalPending.toLocaleString()}</td>
                  <td><Button size="sm" variant="outline" onClick={() => setSelectedMechanic(m.id)}>View</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selectedMechanic} onOpenChange={() => setSelectedMechanic(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{mechanic?.name}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">{mechanic?.phone} · Rate: {mechanic?.commissionRate}% · Pending: <span className="text-warning font-medium">₹{mechanic?.totalPending.toLocaleString()}</span></p>

          <h4 className="text-sm font-semibold mt-2">Linked Sales</h4>
          <table className="data-table">
            <thead><tr><th>Sale</th><th>Date</th><th>Total</th><th>Commission</th></tr></thead>
            <tbody>
              {linkedSales.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td><td>{s.date}</td><td>₹{s.total.toLocaleString()}</td>
                  <td>₹{Math.round(s.total * (mechanic?.commissionRate || 0) / 100).toLocaleString()}</td>
                </tr>
              ))}
              {linkedSales.length === 0 && <tr><td colSpan={4} className="text-center text-muted-foreground py-4">No sales linked</td></tr>}
            </tbody>
          </table>

          <Button className="w-full mt-2" onClick={() => {
            toast({ title: "Commission marked as paid", description: `₹${mechanic?.totalPending.toLocaleString()} paid to ${mechanic?.name}` });
            setSelectedMechanic(null);
          }}>
            Mark Commission as Paid
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
