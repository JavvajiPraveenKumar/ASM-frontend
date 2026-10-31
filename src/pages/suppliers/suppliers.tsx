import { useState, useEffect } from "react";
import { Search, Plus, Loader2, Pencil, Trash2, Eye, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import SupplierFormDialog from "@/components/suppliers/SupplierFormDialog";
import { SupplierService } from "@/services/supplier.service";
import { useToast } from "@/hooks/use-toast";
import type { Supplier, SupplierPayload } from "@/types";

export default function Suppliers() {
  const [suppliersList, setSuppliersList] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setIsLoading(true);
      const res = await SupplierService.getSuppliers();
      setSuppliersList(res?.data || []);
    } catch (error) {
      console.error("Failed to load suppliers:", error);
      toast({
        title: "Error",
        description: "Failed to load suppliers from server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data: SupplierPayload) => {
    try {
      setIsSubmitting(true);
      if (editingSupplier) {
        await SupplierService.updateSupplier(editingSupplier.id, data);
        toast({
          title: "Success",
          description: "Supplier updated successfully.",
        });
      } else {
        await SupplierService.createSupplier(data);
        toast({
          title: "Success",
          description: "Supplier created successfully.",
        });
      }
      setIsAddFormOpen(false);
      setEditingSupplier(null);
      await loadSuppliers();
    } catch (error: any) {
      console.error("Supplier submission error:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          `Failed to ${editingSupplier ? "update" : "create"} supplier. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSupplier = async () => {
    if (!supplierToDelete) return;
    try {
      setIsDeleting(true);
      await SupplierService.deleteSupplier(supplierToDelete.id);
      toast({
        title: "Success",
        description: "Supplier deleted successfully.",
      });
      setSupplierToDelete(null);
      await loadSuppliers();
    } catch (error: any) {
      console.error("Failed to delete supplier:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to delete supplier. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const openAddForm = () => {
    setEditingSupplier(null);
    setIsAddFormOpen(true);
  };

  const openEditForm = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsAddFormOpen(true);
  };

  const filtered = suppliersList.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = (s.name || "").toLowerCase();
    const phone = (s.phone || "").toLowerCase();
    const address = (s.address || "").toLowerCase();
    return name.includes(q) || phone.includes(q) || address.includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="page-header">Suppliers</h2>
        <Button onClick={openAddForm}>
          <Plus className="h-4 w-4 mr-2" /> Add Supplier
        </Button>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, address..."
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
                  <th>Supplier Name</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-muted-foreground">
                      No suppliers found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id}>
                      <td className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span>{s.name}</span>
                        </div>
                      </td>
                      <td className="text-muted-foreground">{s.phone}</td>
                      <td className="text-muted-foreground max-w-[280px] truncate">
                        {s.address}
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 text-xs"
                            onClick={() => setSelectedSupplier(s)}
                            title="View supplier details"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 text-xs"
                            onClick={() => openEditForm(s)}
                            title="Edit supplier details"
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1 text-primary" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                            onClick={() => setSupplierToDelete(s)}
                            title="Delete supplier"
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

      {/* Supplier Detail Modal */}
      <Dialog
        open={!!selectedSupplier}
        onOpenChange={(open) => !open && setSelectedSupplier(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedSupplier?.name || "Supplier Details"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 text-sm bg-muted/30 p-4 rounded-lg border">
            <div className="flex items-start justify-between">
              <span className="text-xs text-muted-foreground">Supplier ID:</span>
              <span className="font-mono text-xs">{selectedSupplier?.id}</span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-xs text-muted-foreground">Name:</span>
              <span className="font-medium">{selectedSupplier?.name}</span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-xs text-muted-foreground">Phone:</span>
              <span className="font-medium">{selectedSupplier?.phone}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block mb-1">Address:</span>
              <p className="font-medium bg-card p-2 rounded border text-xs leading-relaxed">
                {selectedSupplier?.address}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Supplier Form Dialog (Add / Edit) */}
      <SupplierFormDialog
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        supplier={editingSupplier}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!supplierToDelete}
        onOpenChange={(open) => !open && setSupplierToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete supplier{" "}
              <strong className="text-foreground">{supplierToDelete?.name}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteSupplier();
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
                "Delete Supplier"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
