import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Mechanic } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mechanic?: Mechanic | null;
  onSubmit: (data: Omit<Mechanic, "id" | "totalPending">) => void;
}

const emptyForm = { name: "", phone: "", commissionRate: 10 };

export default function MechanicFormDialog({ open, onOpenChange, mechanic, onSubmit }: Props) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = !!mechanic;

  useEffect(() => {
    if (mechanic) {
      setForm({ name: mechanic.name, phone: mechanic.phone, commissionRate: mechanic.commissionRate });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [mechanic, open]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (form.commissionRate < 0 || form.commissionRate > 100) e.commissionRate = "Rate must be 0-100";
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
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Mechanic" : "Add Mechanic"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Mechanic Name</Label>
            <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Ravi Mechanic" />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="e.g. 9876543210" />
            {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
          </div>
          <div>
            <Label>Commission Rate (%)</Label>
            <Input type="number" value={form.commissionRate} onChange={e => set("commissionRate", Number(e.target.value))} />
            {errors.commissionRate && <p className="text-sm text-destructive mt-1">{errors.commissionRate}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEdit ? "Save Changes" : "Add Mechanic"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
