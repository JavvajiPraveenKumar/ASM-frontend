import { useState } from "react";
import { inventoryTransactions } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Inventory() {
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = inventoryTransactions.filter(t => {
    if (typeFilter !== "ALL" && t.type !== typeFilter) return false;
    if (search && !t.productName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <h2 className="page-header">Inventory</h2>

      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-4 border-b flex gap-3 flex-wrap">
          <div className="relative max-w-xs">
            <Input placeholder="Filter by product..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="SALE">Sale</SelectItem>
              <SelectItem value="PURCHASE">Purchase</SelectItem>
              <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>Date</th><th>Product</th><th>Type</th><th>Quantity</th><th>Reference</th></tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td className="font-medium">{t.productName}</td>
                  <td>
                    <span className={t.type === "SALE" ? "badge-info" : t.type === "PURCHASE" ? "badge-success" : "badge-warning"}>
                      {t.type}
                    </span>
                  </td>
                  <td className={t.quantity < 0 ? "text-destructive font-medium" : "text-success font-medium"}>
                    {t.quantity > 0 ? "+" : ""}{t.quantity}
                  </td>
                  <td className="text-muted-foreground">{t.referenceId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
