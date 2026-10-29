import { Search, Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

interface ProductSearchPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  products: Product[];
  onAddToCart: (product: Product) => void;
  isLoading?: boolean;
}

export function ProductSearchPanel({
  searchQuery,
  onSearchChange,
  products,
  onAddToCart,
  isLoading = false,
}: ProductSearchPanelProps) {
  return (
    <div className="lg:col-span-3 flex flex-col bg-card rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or SKU..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-9"
            autoFocus
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-8">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-muted-foreground">Loading products...</span>
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map(product => {
                const stock = product.currentStock ?? product.stock ?? 0;
                const threshold = product.lowStockThreshold ?? 5;
                return (
                  <tr key={product.id}>
                    <td>
                      <div>
                        <p className="font-medium">{product.partName}</p>
                        <p className="text-xs text-muted-foreground">{product.vehicleBrand}</p>
                      </div>
                    </td>
                    <td className="text-muted-foreground">{product.partCode}</td>
                    <td className="font-medium">₹{product.sellingPrice?.toLocaleString()}</td>
                    <td>
                      <span className={stock <= threshold ? (stock <= 5 ? "badge-danger" : "badge-warning") : "badge-success"}>
                        {stock}
                      </span>
                    </td>
                    <td>
                      <Button size="sm" variant="outline" onClick={() => onAddToCart(product)} disabled={stock <= 0}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
