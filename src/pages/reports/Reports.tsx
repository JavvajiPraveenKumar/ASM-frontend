import { recentSales, customers, products, mechanics } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function Reports() {
  const lowStock = products.filter(p => p.stock <= p.lowStockThreshold);
  const creditSales = recentSales.filter(s => s.due > 0);
  const totalOutstanding = customers.reduce((sum, c) => sum + c.totalOutstanding, 0);
  const totalCommissions = mechanics.reduce((sum, m) => sum + m.totalPending, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="page-header">Reports</h2>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales */}
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-4 border-b"><h3 className="font-semibold">Daily Sales Report</h3></div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Sale ID</th><th>Date</th><th>Total</th><th>Paid</th><th>Due</th></tr></thead>
              <tbody>
                {recentSales.map(s => (
                  <tr key={s.id}><td>{s.id}</td><td>{s.date}</td><td>₹{s.total.toLocaleString()}</td><td>₹{s.paid.toLocaleString()}</td><td className={s.due > 0 ? "text-destructive" : ""}>₹{s.due.toLocaleString()}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Credit Outstanding */}
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-4 border-b"><h3 className="font-semibold">Credit Outstanding <span className="text-destructive ml-2">₹{totalOutstanding.toLocaleString()}</span></h3></div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Customer</th><th>Phone</th><th>Outstanding</th></tr></thead>
              <tbody>
                {customers.filter(c => c.totalOutstanding > 0).map(c => (
                  <tr key={c.id}><td className="font-medium">{c.name}</td><td>{c.phone}</td><td className="text-destructive font-medium">₹{c.totalOutstanding.toLocaleString()}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-4 border-b"><h3 className="font-semibold">Low Stock Report <span className="badge-warning ml-2">{lowStock.length} items</span></h3></div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Product</th><th>Brand</th><th>Stock</th><th>Threshold</th></tr></thead>
              <tbody>
                {lowStock.map(p => (
                  <tr key={p.id}><td className="font-medium">{p.name}</td><td>{p.brand}</td><td className={p.stock <= 5 ? "text-destructive font-medium" : "text-warning font-medium"}>{p.stock}</td><td>{p.lowStockThreshold}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mechanic Commissions */}
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-4 border-b"><h3 className="font-semibold">Mechanic Commissions <span className="text-warning ml-2">₹{totalCommissions.toLocaleString()}</span></h3></div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Mechanic</th><th>Rate</th><th>Pending</th></tr></thead>
              <tbody>
                {mechanics.map(m => (
                  <tr key={m.id}><td className="font-medium">{m.name}</td><td>{m.commissionRate}%</td><td className="text-warning font-medium">₹{m.totalPending.toLocaleString()}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
