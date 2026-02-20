import { AlertTriangle } from "lucide-react";
import { products } from "@/data/mockData";

export function LowStockAlert() {
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          Low Stock Alert
        </h3>
      </div>
      <div className="p-4 space-y-3">
        {lowStockProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground">All products are well stocked.</p>
        ) : (
          lowStockProducts.map(product => (
            <div key={product.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.brand}</p>
              </div>
              <span className={product.stock <= 5 ? "badge-danger" : "badge-warning"}>
                {product.stock} left
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
