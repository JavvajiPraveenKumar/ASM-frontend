// Auto Spare Manager - Type Definitions

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalOutstanding: number;
  totalSales: number;
}

export interface Sale {
  id: string;
  date: string;
  customerId?: string;
  customerName?: string;
  items: SaleItem[];
  total: number;
  paid: number;
  due: number;
  paymentMethod: string;
  mechanicId?: string;
  mechanicName?: string;
  status: "completed" | "credit" | "partial";
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Mechanic {
  id: string;
  name: string;
  phone: string;
  commissionRate: number;
  totalPending: number;
}

export interface Payment {
  id: string;
  date: string;
  customerId: string;
  customerName: string;
  saleId: string;
  amount: number;
  method: string;
}

export interface InventoryTransaction {
  id: string;
  date: string;
  productId: string;
  productName: string;
  type: "SALE" | "PURCHASE" | "ADJUSTMENT";
  quantity: number;
  referenceId: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}
