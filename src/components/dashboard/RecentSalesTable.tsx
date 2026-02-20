import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { recentSales } from "@/data/mockData";

export function RecentSalesTable() {
  const navigate = useNavigate();

  return (
    <div className="lg:col-span-2 bg-card rounded-lg border shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-foreground">Recent Sales</h3>
        <button onClick={() => navigate("/sell")} className="text-sm text-primary flex items-center gap-1 hover:underline">
          View All <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Sale ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentSales.slice(0, 6).map(sale => (
              <tr key={sale.id}>
                <td className="font-medium">{sale.id}</td>
                <td>{sale.date}</td>
                <td>{sale.customerName || "Walk-in"}</td>
                <td>₹{sale.total.toLocaleString()}</td>
                <td>₹{sale.paid.toLocaleString()}</td>
                <td>
                  <span className={sale.status === "completed" ? "badge-success" : sale.status === "credit" ? "badge-danger" : "badge-warning"}>
                    {sale.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
