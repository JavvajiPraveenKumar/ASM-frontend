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
import type { Customer, CustomerPayload } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer | null;
  onSubmit: (data: CustomerPayload) => Promise<void> | void;
  isLoading?: boolean;
}

const emptyForm: CustomerPayload = {
  customer_name: "",
  customer_phone: "",
  customer_email: "",
  customer_address: "",
};

export default function CustomerFormDialog({
  open,
  onOpenChange,
  customer,
  onSubmit,
  isLoading = false,
}: Props) {
  const [form, setForm] = useState<CustomerPayload>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = !!customer;

  useEffect(() => {
    if (customer) {
      setForm({
        customer_name: customer.customer_name || customer.name || "",
        customer_phone: customer.customer_phone || customer.phone || "",
        customer_email: customer.customer_email || customer.email || "",
        customer_address: customer.customer_address || customer.address || "",
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [customer, open]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customer_name.trim()) {
      e.customer_name = "Customer name is required";
    }
    if (!form.customer_phone.trim()) {
      e.customer_phone = "Phone number is required";
    }
    if (form.customer_email && form.customer_email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.customer_email.trim())) {
        e.customer_email = "Please enter a valid email address";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (validate()) {
      const payload: CustomerPayload = {
        customer_name: form.customer_name.trim(),
        customer_phone: form.customer_phone.trim(),
        customer_email: form.customer_email?.trim() || "",
        customer_address: form.customer_address?.trim() || "",
      };
      await onSubmit(payload);
    }
  };

  const set = (key: keyof CustomerPayload, value: string) => {
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
          <DialogTitle>{isEdit ? "Edit Customer" : "Add Customer"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the customer's contact details and information."
              : "Enter customer details to register them in the system."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customer_name">
              Customer Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="customer_name"
              value={form.customer_name}
              onChange={(e) => set("customer_name", e.target.value)}
              placeholder="e.g. Koushik"
              className={errors.customer_name ? "border-destructive" : ""}
              autoFocus
            />
            {errors.customer_name && (
              <p className="text-xs text-destructive mt-1">{errors.customer_name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="customer_phone">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="customer_phone"
              value={form.customer_phone}
              onChange={(e) => set("customer_phone", e.target.value)}
              placeholder="e.g. 9876543231"
              className={errors.customer_phone ? "border-destructive" : ""}
            />
            {errors.customer_phone && (
              <p className="text-xs text-destructive mt-1">{errors.customer_phone}</p>
            )}
          </div>

          <div>
            <Label htmlFor="customer_email">Email Address</Label>
            <Input
              id="customer_email"
              type="email"
              value={form.customer_email || ""}
              onChange={(e) => set("customer_email", e.target.value)}
              placeholder="e.g. Koushik@gmail.com"
              className={errors.customer_email ? "border-destructive" : ""}
            />
            {errors.customer_email && (
              <p className="text-xs text-destructive mt-1">{errors.customer_email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="customer_address">Address</Label>
            <Textarea
              id="customer_address"
              value={form.customer_address || ""}
              onChange={(e) => set("customer_address", e.target.value)}
              placeholder="e.g. Hyderabad, Telangana"
              rows={3}
            />
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
              {isEdit ? "Update Customer" : "Create Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
