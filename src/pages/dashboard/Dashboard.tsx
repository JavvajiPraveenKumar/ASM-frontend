import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { RecentSalesTable } from "@/components/dashboard/RecentSalesTable";
import { LowStockAlert } from "@/components/dashboard/LowStockAlert";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="page-header">Dashboard</h2>
      <SummaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentSalesTable />
        <LowStockAlert />
      </div>
    </div>
  );
}
