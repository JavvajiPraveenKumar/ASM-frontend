import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSubmit: (data: Omit<Product, "id">) => void;
}

const emptyForm = {id:"", partName: "", partCode: "", category: "", vehicleBrand: "", sellingPrice: 0, stock: 0, lowStockThreshold: 10 };

export default function ProductFormDialog({ open, onOpenChange, product, onSubmit }: Props) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = !!product;

  useEffect(() => {
    if (product) {
      setForm({ id:"",partName: product.partName,partCode: product.partCode, category: product.category, vehicleBrand: product.vehicleBrand, sellingPrice: product.sellingPrice, stock: product.stock, lowStockThreshold: product.lowStockThreshold });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [product, open]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.partName.trim()) e.name = "Name is required";
    if (!form.partCode.trim()) e.sku = "SKU is required";
    if (!form.category.trim()) e.category = "Category is required";
    if (form.sellingPrice <= 0) e.price = "Price must be greater than 0";
    if (form.stock < 0) e.stock = "Stock cannot be negative";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(form);
      onOpenChange(false);
    }
  };

  const set = (key: string, value: string | number) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Product Name</Label>
            <Input value={form.partName} onChange={e => set("name", e.target.value)} placeholder="e.g. Brake Pad Set" />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
          </div>
          <div>
            <Label>SKU</Label>
            <Input value={form.partCode} onChange={e => set("sku", e.target.value)} placeholder="e.g. BP-F-001" />
            {errors.sku && <p className="text-sm text-destructive mt-1">{errors.sku}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <Input value={form.category} onChange={e => set("category", e.target.value)} placeholder="e.g. Brakes" />
              {errors.category && <p className="text-sm text-destructive mt-1">{errors.category}</p>}
            </div>
            <div>
              <Label>Brand</Label>
              <Input value={form.vehicleBrand} onChange={e => set("brand", e.target.value)} placeholder="e.g. Bosch" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Price (₹)</Label>
              <Input type="number" value={form.sellingPrice} onChange={e => set("price", Number(e.target.value))} />
              {errors.price && <p className="text-sm text-destructive mt-1">{errors.price}</p>}
            </div>
            <div>
              <Label>Stock</Label>
              <Input type="number" value={form.stock} onChange={e => set("stock", Number(e.target.value))} />
              {errors.stock && <p className="text-sm text-destructive mt-1">{errors.stock}</p>}
            </div>
            <div>
              <Label>Low Stock Threshold</Label>
              <Input type="number" value={form.lowStockThreshold} onChange={e => set("lowStockThreshold", Number(e.target.value))} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEdit ? "Save Changes" : "Add Product"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
