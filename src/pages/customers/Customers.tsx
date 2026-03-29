import { useState, useEffect } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { recentSales, payments } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomerFormDialog from "@/components/customers/CustomerFormDialog";
import { CustomerService } from "@/services/customer.service";
import { useToast } from "@/hooks/use-toast";
import type { Customer } from "@/types";

export default function Customers() {
  const [customersList, setCustomersList] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await CustomerService.getCustomers();
      setCustomersList(data.data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data: Omit<Customer, "id">) => {
    try {
      if (editingCustomer) {
        await CustomerService.updateCustomer(editingCustomer.id, data);
        toast({ title: "Success", description: "Customer updated successfully" });
      } else {
        await CustomerService.createCustomer(data);
        toast({ title: "Success", description: "Customer added successfully" });
      }
      loadCustomers();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: `Failed to ${editingCustomer ? "update" : "add"} customer`,
        variant: "destructive",
      });
    }
  };

  const openAddForm = () => {
    setEditingCustomer(null);
    setIsAddFormOpen(true);
  };

  const filtered = customersList.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)
  );

  const customer = customersList.find(c => c.id === selectedCustomer);
  const customerSales = recentSales.filter(s => s.customerId === selectedCustomer);
  const customerPayments = payments.filter(p => p.customerId === selectedCustomer);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="page-header">Customers</h2>
        <Button onClick={openAddForm}><Plus className="h-4 w-4 mr-2" /> Add Customer</Button>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
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
                  <th>Outstanding</th>
                  <th>Total Sales</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td className="font-medium">{c.name}</td>
                    <td className="text-muted-foreground">{c.phone}</td>
                    <td>
                      <span className={(c.totalOutstanding || 0) > 0 ? "text-destructive font-medium" : "text-success"}>
                        ₹{(c.totalOutstanding || 0).toLocaleString()}
                      </span>
                    </td>
                    <td>{c.totalSales || 0}</td>
                    <td>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedCustomer(c.id)}>View</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Customer Detail Modal */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{customer?.name}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{customer?.phone} · Outstanding: <span className="text-destructive font-medium">₹{customer?.totalOutstanding.toLocaleString()}</span></p>

          <Tabs defaultValue="sales">
            <TabsList>
              <TabsTrigger value="sales">Sales History</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>
            <TabsContent value="sales">
              <table className="data-table">
                <thead><tr><th>Sale ID</th><th>Date</th><th>Total</th><th>Paid</th><th>Due</th><th>Status</th></tr></thead>
                <tbody>
                  {customerSales.map(s => (
                    <tr key={s.id}>
                      <td>{s.id}</td><td>{s.date}</td><td>₹{s.total.toLocaleString()}</td><td>₹{s.paid.toLocaleString()}</td>
                      <td className={s.due > 0 ? "text-destructive font-medium" : ""}>₹{s.due.toLocaleString()}</td>
                      <td><span className={s.status === "completed" ? "badge-success" : s.status === "credit" ? "badge-danger" : "badge-warning"}>{s.status}</span></td>
                    </tr>
                  ))}
                  {customerSales.length === 0 && <tr><td colSpan={6} className="text-center text-muted-foreground py-4">No sales found</td></tr>}
                </tbody>
              </table>
            </TabsContent>
            <TabsContent value="payments">
              <table className="data-table">
                <thead><tr><th>Payment ID</th><th>Date</th><th>Sale</th><th>Amount</th><th>Method</th></tr></thead>
                <tbody>
                  {customerPayments.map(p => (
                    <tr key={p.id}><td>{p.id}</td><td>{p.date}</td><td>{p.saleId}</td><td>₹{p.amount.toLocaleString()}</td><td>{p.method}</td></tr>
                  ))}
                  {customerPayments.length === 0 && <tr><td colSpan={5} className="text-center text-muted-foreground py-4">No payments found</td></tr>}
                </tbody>
              </table>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <CustomerFormDialog
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        customer={editingCustomer}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
