import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import SellProduct from "./pages/sell/SellProduct";
import Customers from "./pages/customers/Customers";
import Products from "./pages/products/Products";
import Inventory from "./pages/inventory/Inventory";
import Payments from "./pages/payments/Payments";
import Mechanics from "./pages/mechanics/Mechanics";
import Reports from "./pages/reports/Reports";
import SettingsPage from "./pages/settings/Settings";
import NotFound from "./pages/not-found/NotFound";
import ProductForm from "./pages/products/ProductForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sell" element={<SellProduct />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={<ProductForm />} />
            <Route path="/products/edit/:id" element={<ProductForm />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/mechanics" element={<Mechanics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
