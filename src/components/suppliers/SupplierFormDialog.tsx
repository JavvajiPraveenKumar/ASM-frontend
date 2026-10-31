import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type { Supplier, SupplierPayload } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier?: Supplier | null;
  onSubmit: (data: SupplierPayload) => Promise<void> | void;
  isLoading?: boolean;
}

const emptyForm: SupplierPayload = {
  name: "",
  phone: "",
  address: "",
};

export default function SupplierFormDialog({
  open,
  onOpenChange,
  supplier,
  onSubmit,
  isLoading = false,
}: Props) {
  const [form, setForm] = useState<SupplierPayload>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = !!supplier;

  useEffect(() => {
    if (supplier) {
      setForm({
        name: supplier.name || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [supplier, open]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) {
      e.name = "Supplier name is required";
    }
    if (!form.phone.trim()) {
      e.phone = "Phone number is required";
    }
    if (!form.address.trim()) {
      e.address = "Address is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (validate()) {
      const payload: SupplierPayload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      };
      await onSubmit(payload);
    }
  };

  const set = (key: keyof SupplierPayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the supplier's contact details and information."
              : "Enter supplier details to register them in the system."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="supplier_name">
              Supplier Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="supplier_name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. ABC Auto Spares"
              className={errors.name ? "border-destructive" : ""}
              autoFocus
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="supplier_phone">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="supplier_phone"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="e.g. 9876543210"
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p className="text-xs text-destructive mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <Label htmlFor="supplier_address">
              Address <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="supplier_address"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="e.g. Hyderabad, Telangana"
              className={errors.address ? "border-destructive" : ""}
              rows={3}
            />
            {errors.address && (
              <p className="text-xs text-destructive mt-1">{errors.address}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEdit ? "Update Supplier" : "Create Supplier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

