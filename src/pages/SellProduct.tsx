import { useState, useMemo } from "react";
import { products, mechanics } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import type { CartItem, Product } from "@/types";
import { ProductSearchPanel } from "@/components/sell/ProductSearchPanel";
import { CartPanel } from "@/components/sell/CartPanel";
import { CheckoutSection } from "@/components/sell/CheckoutSection";
import { SaleConfirmDialog } from "@/components/sell/SaleConfirmDialog";

export default function SellProduct() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paidAmount, setPaidAmount] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedMechanic, setSelectedMechanic] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [showConfirm, setShowConfirm] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(p => p.partName.toLowerCase().includes(q) || p.partCode.toLowerCase().includes(q));
  }, [searchQuery]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const paid = parseFloat(paidAmount) || 0;
  const due = Math.max(0, cartTotal - paid);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast({ title: "Stock limit reached", description: `Only ${product.stock} available`, variant: "destructive" });
          return prev;
        }
        return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      if (product.stock <= 0) {
        toast({ title: "Out of stock", variant: "destructive" });
        return prev;
      }
      return [...prev, { productId: product.id, name: product.partName, price: product.sellingPrice, quantity: 1, stock: product.stock }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId !== productId) return item;
      const newQty = item.quantity + delta;
      if (newQty <= 0) return item;
      if (newQty > item.stock) {
        toast({ title: "Stock limit reached", variant: "destructive" });
        return item;
      }
      return { ...item, quantity: newQty };
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      toast({ title: "Cart is empty", variant: "destructive" });
      return;
    }
    if (due > 0 && !selectedCustomer) {
      toast({ title: "Customer required for credit sale", description: "Select a customer when payment is less than total", variant: "destructive" });
      return;
    }
    setShowConfirm(true);
  };

  const confirmSale = () => {
    toast({ title: "Sale completed!", description: `Total: ₹${cartTotal.toLocaleString()} | Paid: ₹${paid.toLocaleString()}` });
    setCart([]);
    setPaidAmount("");
    setSelectedCustomer("");
    setSelectedMechanic("");
    setShowConfirm(false);
  };

  const mechanic = mechanics.find(m => m.id === selectedMechanic);
  const commissionPreview = mechanic ? Math.round(cartTotal * mechanic.commissionRate / 100) : 0;

  return (
    <div className="space-y-4">
      <h2 className="page-header">Sell Product</h2>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-10rem)]">
        <ProductSearchPanel
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          products={filteredProducts}
          onAddToCart={addToCart}
        />

        <div className="lg:col-span-2 flex flex-col bg-card rounded-lg border shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-foreground">Sale Summary</h3>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-2">
            <CartPanel cart={cart} onUpdateQty={updateQty} onRemove={removeFromCart} />
          </div>

          <CheckoutSection
            cartTotal={cartTotal}
            paidAmount={paidAmount}
            onPaidAmountChange={setPaidAmount}
            due={due}
            selectedCustomer={selectedCustomer}
            onCustomerChange={setSelectedCustomer}
            selectedMechanic={selectedMechanic}
            onMechanicChange={setSelectedMechanic}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            commissionPreview={commissionPreview}
            onCompleteSale={handleCompleteSale}
            cartEmpty={cart.length === 0}
          />
        </div>
      </div>

      <SaleConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        cart={cart}
        cartTotal={cartTotal}
        paid={paid}
        due={due}
        paymentMethod={paymentMethod}
        selectedCustomer={selectedCustomer}
        selectedMechanic={selectedMechanic}
        commissionPreview={commissionPreview}
        onConfirm={confirmSale}
      />
    </div>
  );
}
