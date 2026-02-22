import { useState, useEffect } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductService } from "@/services/product.service";
import { Product, ProductResponse } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [meta, setMeta] = useState<ProductResponse["meta"] | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await ProductService.getProducts();
      setProducts(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.error("Failed to fetch products...:", error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = products.filter(p =>
    p.partName.toLowerCase().includes(searchQuery.toLowerCase()) || p.partCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="page-header">Spare-Parts</h2>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Spare Part</Button>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map(p => (
                    <tr key={p.id}>
                      <td className="font-medium">{p.partName}</td>
                      <td className="text-muted-foreground">{p.partCode}</td>
                      <td>{p.category}</td>
                      <td>{p.vehicleBrand}</td>
                      <td>₹{p.sellingPrice.toLocaleString()}</td>
                      <td>{p.stock}</td>
                      <td>
                        {p.stock <= p.lowStockThreshold ? (
                          <span className={p.stock <= 5 ? "badge-danger" : "badge-warning"}>Low Stock</span>
                        ) : (
                          <span className="badge-success">In Stock</span>
                        )}
                      </td>
                      <td><Button size="sm" variant="outline">Edit</Button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
