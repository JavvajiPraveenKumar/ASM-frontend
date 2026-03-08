// Auto Spare Manager - Type Definitions
export interface ProductResponse {
  data: Product[];
  meta: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface Product {
  id: string;
  partName: string;
  partCode: string;
  category: string;
  vehicleBrand: string;
  sellingPrice: number;
  stock: number;
  lowStockThreshold: number;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
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
