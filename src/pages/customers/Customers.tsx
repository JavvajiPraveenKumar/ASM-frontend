import { useState, useEffect } from "react";
import { Search, Plus, Loader2, Pencil, Trash2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { recentSales, payments } from "@/data/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomerFormDialog from "@/components/customers/CustomerFormDialog";
import { CustomerService } from "@/services/customer.service";
import { useToast } from "@/hooks/use-toast";
import type { Customer, CustomerPayload } from "@/types";

export default function Customers() {
  const [customersList, setCustomersList] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await CustomerService.getCustomers();
      setCustomersList(res?.data || []);
    } catch (error) {
      console.error("Failed to load customers:", error);
      toast({
        title: "Error",
        description: "Failed to load customers from server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data: CustomerPayload) => {
    try {
      setIsSubmitting(true);
      if (editingCustomer) {
        await CustomerService.updateCustomer(editingCustomer.id, data);
        toast({
          title: "Success",
          description: "Customer updated successfully.",
        });
      } else {
        await CustomerService.createCustomer(data);
        toast({
          title: "Success",
          description: "Customer created successfully.",
        });
      }
      setIsAddFormOpen(false);
      setEditingCustomer(null);
      await loadCustomers();
    } catch (error: any) {
      console.error("Customer submission error:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          `Failed to ${editingCustomer ? "update" : "create"} customer. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;
    try {
      setIsDeleting(true);
      await CustomerService.deleteCustomer(customerToDelete.id);
      toast({
        title: "Success",
        description: "Customer deleted successfully.",
      });
      setCustomerToDelete(null);
      await loadCustomers();
    } catch (error: any) {
      console.error("Failed to delete customer:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to delete customer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const openAddForm = () => {
    setEditingCustomer(null);
    setIsAddFormOpen(true);
  };

  const openEditForm = (c: Customer) => {
    setEditingCustomer(c);
    setIsAddFormOpen(true);
  };

  const filtered = customersList.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = (c.customer_name || c.name || "").toLowerCase();
    const phone = (c.customer_phone || c.phone || "").toLowerCase();
    const email = (c.customer_email || c.email || "").toLowerCase();
    const address = (c.customer_address || c.address || "").toLowerCase();
    return (
      name.includes(q) ||
      phone.includes(q) ||
      email.includes(q) ||
      address.includes(q)
    );
  });

  const customer = customersList.find((c) => c.id === selectedCustomer);
  const customerSales = recentSales.filter((s) => s.customerId === selectedCustomer);
  const customerPayments = payments.filter((p) => p.customerId === selectedCustomer);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="page-header">Customers</h2>
        <Button onClick={openAddForm}>
          <Plus className="h-4 w-4 mr-2" /> Add Customer
        </Button>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
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
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Outstanding</th>
                  <th>Total Sales</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id}>
                      <td className="font-medium">
                        {c.customer_name || c.name || "-"}
                      </td>
                      <td className="text-muted-foreground">
                        {c.customer_phone || c.phone || "-"}
                      </td>
                      <td className="text-muted-foreground">
                        {c.customer_email || c.email || "-"}
                      </td>
                      <td className="text-muted-foreground max-w-[160px] truncate">
                        {c.customer_address || c.address || "-"}
                      </td>
                      <td>
                        <span
                          className={
                            (c.totalOutstanding || 0) > 0
                              ? "text-destructive font-medium"
                              : "text-success font-medium"
                          }
                        >
                          ₹{(c.totalOutstanding ?? 0).toLocaleString()}
                        </span>
                      </td>
                      <td>{c.totalSales || 0}</td>
                      <td>
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 text-xs"
                            onClick={() => setSelectedCustomer(c.id)}
                            title="View customer sales and payments"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 text-xs"
                            onClick={() => openEditForm(c)}
                            title="Edit customer details"
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1 text-primary" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                            onClick={() => setCustomerToDelete(c)}
                            title="Delete customer"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Customer Detail Modal */}
      <Dialog
        open={!!selectedCustomer}
        onOpenChange={() => setSelectedCustomer(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {customer?.customer_name || customer?.name || "Customer Details"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm bg-muted/30 p-3 rounded-lg border">
            <div>
              <span className="text-xs text-muted-foreground block">Phone</span>
              <span className="font-medium">
                {customer?.customer_phone || customer?.phone || "-"}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Email</span>
              <span className="font-medium truncate block">
                {customer?.customer_email || customer?.email || "-"}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Address</span>
              <span className="font-medium truncate block">
                {customer?.customer_address || customer?.address || "-"}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Outstanding</span>
              <span
                className={
                  (customer?.totalOutstanding || 0) > 0
                    ? "text-destructive font-semibold"
                    : "text-success font-medium"
                }
              >
                ₹{(customer?.totalOutstanding ?? 0).toLocaleString()}
              </span>
            </div>
          </div>

          <Tabs defaultValue="sales">
            <TabsList>
              <TabsTrigger value="sales">Sales History</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            {/* SALES */}
            <TabsContent value="sales">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Sale ID</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Due</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {customerSales.map((s) => (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>{s.date ?? "-"}</td>
                      <td>₹{(s.total ?? 0).toLocaleString()}</td>
                      <td>₹{(s.paid ?? 0).toLocaleString()}</td>
                      <td
                        className={
                          (s.due ?? 0) > 0 ? "text-destructive font-medium" : ""
                        }
                      >
                        ₹{(s.due ?? 0).toLocaleString()}
                      </td>
                      <td>
                        <span
                          className={
                            s.status === "completed"
                              ? "badge-success"
                              : s.status === "credit"
                              ? "badge-danger"
                              : "badge-warning"
                          }
                        >
                          {s.status ?? "-"}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {customerSales.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center text-muted-foreground py-4"
                      >
                        No sales found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </TabsContent>

            {/* PAYMENTS */}
            <TabsContent value="payments">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Date</th>
                    <th>Sale</th>
                    <th>Amount</th>
                    <th>Method</th>
                  </tr>
                </thead>

                <tbody>
                  {customerPayments.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.date ?? "-"}</td>
                      <td>{p.saleId ?? "-"}</td>
                      <td>₹{(p.amount ?? 0).toLocaleString()}</td>
                      <td>{p.method ?? "-"}</td>
                    </tr>
                  ))}

                  {customerPayments.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center text-muted-foreground py-4"
                      >
                        No payments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Customer Form Dialog (Add / Edit) */}
      <CustomerFormDialog
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        customer={editingCustomer}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!customerToDelete}
        onOpenChange={(open) => !open && setCustomerToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete customer{" "}
              <strong className="text-foreground">
                {customerToDelete?.customer_name || customerToDelete?.name}
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteCustomer();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Customer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
