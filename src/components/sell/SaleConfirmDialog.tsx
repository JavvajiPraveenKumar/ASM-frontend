import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, ChevronDown, Loader2, AlertCircle } from "lucide-react";
import { CustomerService } from "@/services/customer.service";
import { customers as mockCustomers, mechanics } from "@/data/mockData";
import type { CartItem, Customer } from "@/types";

export interface CustomerConfirmData {
  id?: string;
  name: string;
  phone?: string;
  isNew?: boolean;
}

interface SaleConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  cartTotal: number;
  paid: number;
  due: number;
  paymentMethod: string;
  selectedCustomer: string;
  onCustomerChange?: (customerId: string) => void;
  selectedMechanic: string;
  commissionPreview: number;
  onConfirm: (customerData?: CustomerConfirmData) => void;
}

export function SaleConfirmDialog({
  open,
  onOpenChange,
  cart,
  cartTotal,
  paid,
  due,
  paymentMethod,
  selectedCustomer,
  onCustomerChange,
  selectedMechanic,
  commissionPreview,
  onConfirm,
}: SaleConfirmDialogProps) {
  const [showCustomerOptions, setShowCustomerOptions] = useState(false);
  const [customerMode, setCustomerMode] = useState<"existing" | "new">("existing");
  const [selectedCustomerId, setSelectedCustomerId] = useState(selectedCustomer || "");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [customersList, setCustomersList] = useState<Customer[]>(mockCustomers);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (open) {
      setSelectedCustomerId(selectedCustomer || "");
      setValidationError("");
      setNewCustomerName("");
      setNewCustomerPhone("");

      // If due > 0 and no customer is pre-selected, expand customer options automatically
      if (due > 0 && !selectedCustomer) {
        setShowCustomerOptions(true);
      } else {
        setShowCustomerOptions(false);
      }
      loadCustomers();
    }
  }, [open, selectedCustomer, due]);

  const loadCustomers = async () => {
    try {
      setIsLoadingCustomers(true);
      const res = await CustomerService.getCustomers();
      if (res?.data && res.data.length > 0) {
        setCustomersList(res.data);
      } else {
        setCustomersList(mockCustomers);
      }
    } catch {
      setCustomersList(mockCustomers);
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  const selectedCustomerObj = customersList.find((c) => c.id === selectedCustomerId);
  const mechanic = mechanics.find((m) => m.id === selectedMechanic);

  const getCustomerDisplayTitle = () => {
    if (customerMode === "new") {
      if (newCustomerName.trim()) {
        return `${newCustomerName.trim()} (New Customer)`;
      }
      return "New Customer (Not specified)";
    }
    if (selectedCustomerObj) {
      return `${selectedCustomerObj.customer_name || selectedCustomerObj.name} (${selectedCustomerObj.phone})`;
    }
    return due > 0 ? "None selected (Click to choose)" : "Walk-in Customer";
  };

  const handleConfirm = async () => {
    setValidationError("");

    // If due > 0, customer is a mandatory field
    if (due > 0) {
      if (customerMode === "existing") {
        if (!selectedCustomerId || selectedCustomerId === "none") {
          setShowCustomerOptions(true);
          setValidationError(
            "Customer is required when there is a due amount (Credit Sale). Please select an existing customer."
          );
          return;
        }
      } else if (customerMode === "new") {
        if (!newCustomerName.trim()) {
          setShowCustomerOptions(true);
          setValidationError("Customer Name is required for credit sales.");
          return;
        }
        if (!newCustomerPhone.trim()) {
          setShowCustomerOptions(true);
          setValidationError("Customer Phone is required for credit sales.");
          return;
        }
      }
    }

    // New customer submission
    if (customerMode === "new" && newCustomerName.trim()) {
      try {
        setIsSubmitting(true);
        const res = await CustomerService.createCustomer({
          customer_name: newCustomerName.trim(),
          phone: newCustomerPhone.trim(),
          totalOutstanding: due,
          totalSales: cartTotal,
        });

        onConfirm({
          id: res?.id,
          name: newCustomerName.trim(),
          phone: newCustomerPhone.trim(),
          isNew: true,
        });
        return;
      } catch (err) {
        console.error("Failed to create customer via API:", err);
        // Fallback: proceed with provided details so offline/mock works
        onConfirm({
          name: newCustomerName.trim(),
          phone: newCustomerPhone.trim(),
          isNew: true,
        });
        return;
      } finally {
        setIsSubmitting(false);
      }
    }

    // Existing customer selected
    if (customerMode === "existing" && selectedCustomerId && selectedCustomerId !== "none") {
      onConfirm({
        id: selectedCustomerId,
        name: selectedCustomerObj?.customer_name || selectedCustomerObj?.name || "Customer",
        phone: selectedCustomerObj?.phone,
        isNew: false,
      });
      return;
    }

    // Walk-in / No customer (allowed when due === 0)
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Sale</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2 bg-muted/30 p-3 rounded-lg border">
            <p>
              <strong>Items:</strong> {cart.length}
            </p>
            <p>
              <strong>Total:</strong> ₹{cartTotal.toLocaleString()}
            </p>
            <p>
              <strong>Paid:</strong> ₹{paid.toLocaleString()}
            </p>
            <p>
              <strong>Payment:</strong> {paymentMethod}
            </p>
            {due > 0 ? (
              <p className="col-span-2 text-destructive font-semibold">
                <strong>Due Amount:</strong> ₹{due.toLocaleString()} (Credit Sale)
              </p>
            ) : (
              <p className="col-span-2 text-success font-medium">
                <strong>Due Amount:</strong> ₹0 (Fully Paid)
              </p>
            )}
          </div>

          {mechanic && (
            <p className="text-xs text-muted-foreground">
              <strong>Mechanic:</strong> {mechanic.name} (Commission: ₹
              {commissionPreview.toLocaleString()})
            </p>
          )}

          {/* Clickable Customer Section */}
          <div className="space-y-2 pt-1">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setShowCustomerOptions(!showCustomerOptions)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setShowCustomerOptions(!showCustomerOptions);
                }
              }}
              className={`p-3 rounded-lg border transition-all cursor-pointer select-none ${
                due > 0 &&
                (!selectedCustomerId || selectedCustomerId === "none") &&
                (!newCustomerName.trim() || customerMode !== "new")
                  ? "border-destructive/60 bg-destructive/5 hover:bg-destructive/10"
                  : "border-border bg-card hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <User className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-semibold text-foreground shrink-0">Customer:</span>
                  <span className="text-foreground truncate font-medium">
                    {getCustomerDisplayTitle()}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {due > 0 ? (
                    <span className="text-[11px] bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full font-semibold">
                      Required *
                    </span>
                  ) : (
                    <span className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      Optional
                    </span>
                  )}
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      showCustomerOptions ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Revealed options on click: 1) Existing Customer or 2) New Customer */}
            {showCustomerOptions && (
              <div className="p-3 border rounded-lg bg-muted/20 space-y-3 animate-in fade-in-50 duration-150">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={customerMode === "existing" ? "default" : "outline"}
                    className="flex-1 text-xs"
                    onClick={() => {
                      setCustomerMode("existing");
                      setValidationError("");
                    }}
                  >
                    1) Existing Customer
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={customerMode === "new" ? "default" : "outline"}
                    className="flex-1 text-xs"
                    onClick={() => {
                      setCustomerMode("new");
                      setValidationError("");
                    }}
                  >
                    2) New Customer
                  </Button>
                </div>

                {customerMode === "existing" ? (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground flex justify-between">
                      <span>Select Existing Customer</span>
                      {due > 0 && <span className="text-destructive font-semibold">* Required</span>}
                    </label>
                    <Select
                      value={selectedCustomerId}
                      onValueChange={(val) => {
                        setSelectedCustomerId(val);
                        setValidationError("");
                        onCustomerChange?.(val === "none" ? "" : val);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            isLoadingCustomers ? "Loading customers..." : "Choose existing customer"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {due === 0 && (
                          <SelectItem value="none">-- None (Walk-in Customer) --</SelectItem>
                        )}
                        {customersList.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.customer_name || c.name || "Customer"} - {c.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedCustomerObj && (
                      <div className="p-2.5 rounded bg-card border text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="font-medium">{selectedCustomerObj.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Outstanding Balance:</span>
                          <span
                            className={
                              (selectedCustomerObj.totalOutstanding || 0) > 0
                                ? "text-destructive font-semibold"
                                : "text-success font-medium"
                            }
                          >
                            ₹{(selectedCustomerObj.totalOutstanding || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground flex justify-between mb-1">
                        <span>Customer Name</span>
                        {due > 0 && <span className="text-destructive font-semibold">* Required</span>}
                      </label>
                      <Input
                        placeholder="e.g. Rahul Sharma"
                        value={newCustomerName}
                        onChange={(e) => {
                          setNewCustomerName(e.target.value);
                          setValidationError("");
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground flex justify-between mb-1">
                        <span>Phone Number</span>
                        {due > 0 && <span className="text-destructive font-semibold">* Required</span>}
                      </label>
                      <Input
                        placeholder="e.g. 9876543210"
                        value={newCustomerPhone}
                        onChange={(e) => {
                          setNewCustomerPhone(e.target.value);
                          setValidationError("");
                        }}
                      />
                    </div>
                  </div>
                )}

                {validationError && (
                  <div className="flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 p-2 rounded">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
