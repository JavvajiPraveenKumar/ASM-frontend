// Mock data for Auto Spare Manager
import type { Product, Customer, Mechanic, Sale, Payment, InventoryTransaction } from "@/types";

// Re-export types for backward compatibility
export type { Product, Customer, Sale, SaleItem, Mechanic, Payment, InventoryTransaction } from "@/types";

export const products: Product[] = [
  { id: "P001", name: "Brake Pad Set - Front", sku: "BP-F-001", category: "Brakes", brand: "Bosch", price: 1200, stock: 45, lowStockThreshold: 10 },
  { id: "P002", name: "Oil Filter", sku: "OF-001", category: "Filters", brand: "Mann", price: 350, stock: 8, lowStockThreshold: 15 },
  { id: "P003", name: "Spark Plug - Iridium", sku: "SP-IR-001", category: "Ignition", brand: "NGK", price: 450, stock: 120, lowStockThreshold: 20 },
  { id: "P004", name: "Air Filter", sku: "AF-001", category: "Filters", brand: "K&N", price: 800, stock: 3, lowStockThreshold: 10 },
  { id: "P005", name: "Clutch Plate", sku: "CP-001", category: "Transmission", brand: "Valeo", price: 3500, stock: 12, lowStockThreshold: 5 },
  { id: "P006", name: "Timing Belt", sku: "TB-001", category: "Engine", brand: "Gates", price: 1800, stock: 18, lowStockThreshold: 8 },
  { id: "P007", name: "Radiator Coolant 1L", sku: "RC-001", category: "Cooling", brand: "Castrol", price: 280, stock: 55, lowStockThreshold: 15 },
  { id: "P008", name: "Headlight Bulb H4", sku: "HB-H4-001", category: "Electrical", brand: "Philips", price: 650, stock: 30, lowStockThreshold: 10 },
  { id: "P009", name: "Wiper Blade 18\"", sku: "WB-18-001", category: "Accessories", brand: "Bosch", price: 400, stock: 5, lowStockThreshold: 10 },
  { id: "P010", name: "Engine Oil 5W-30 4L", sku: "EO-5W30-001", category: "Lubricants", brand: "Mobil", price: 2200, stock: 22, lowStockThreshold: 10 },
];

export const customers: Customer[] = [
  { id: "C001", name: "Rajesh Kumar", phone: "9876543210", totalOutstanding: 4500, totalSales: 12 },
  { id: "C002", name: "Suresh Patel", phone: "9876543211", totalOutstanding: 0, totalSales: 8 },
  { id: "C003", name: "Amit Singh", phone: "9876543212", totalOutstanding: 12000, totalSales: 25 },
  { id: "C004", name: "Vikram Sharma", phone: "9876543213", totalOutstanding: 2200, totalSales: 5 },
  { id: "C005", name: "Deepak Verma", phone: "9876543214", totalOutstanding: 0, totalSales: 3 },
];

export const mechanics: Mechanic[] = [
  { id: "M001", name: "Ravi Mechanic", phone: "9988776601", commissionRate: 10, totalPending: 3200 },
  { id: "M002", name: "Sanjay Auto Works", phone: "9988776602", commissionRate: 8, totalPending: 1500 },
  { id: "M003", name: "Kiran Motors", phone: "9988776603", commissionRate: 12, totalPending: 5800 },
];

export const recentSales: Sale[] = [
  { id: "S001", date: "2026-02-19", customerName: "Rajesh Kumar", customerId: "C001", items: [{ productId: "P001", productName: "Brake Pad Set - Front", quantity: 1, price: 1200, subtotal: 1200 }], total: 1200, paid: 1200, due: 0, paymentMethod: "Cash", status: "completed" },
  { id: "S002", date: "2026-02-19", customerName: "Amit Singh", customerId: "C003", items: [{ productId: "P003", productName: "Spark Plug - Iridium", quantity: 4, price: 450, subtotal: 1800 }, { productId: "P010", productName: "Engine Oil 5W-30 4L", quantity: 1, price: 2200, subtotal: 2200 }], total: 4000, paid: 2000, due: 2000, paymentMethod: "Cash", mechanicName: "Ravi Mechanic", mechanicId: "M001", status: "credit" },
  { id: "S003", date: "2026-02-18", items: [{ productId: "P007", productName: "Radiator Coolant 1L", quantity: 2, price: 280, subtotal: 560 }], total: 560, paid: 560, due: 0, paymentMethod: "UPI", status: "completed" },
  { id: "S004", date: "2026-02-18", customerName: "Vikram Sharma", customerId: "C004", items: [{ productId: "P006", productName: "Timing Belt", quantity: 1, price: 1800, subtotal: 1800 }], total: 1800, paid: 1000, due: 800, paymentMethod: "Cash", mechanicName: "Sanjay Auto Works", mechanicId: "M002", status: "partial" },
  { id: "S005", date: "2026-02-18", items: [{ productId: "P008", productName: "Headlight Bulb H4", quantity: 2, price: 650, subtotal: 1300 }], total: 1300, paid: 1300, due: 0, paymentMethod: "Card", status: "completed" },
  { id: "S006", date: "2026-02-17", customerName: "Suresh Patel", customerId: "C002", items: [{ productId: "P005", productName: "Clutch Plate", quantity: 1, price: 3500, subtotal: 3500 }], total: 3500, paid: 3500, due: 0, paymentMethod: "UPI", mechanicName: "Kiran Motors", mechanicId: "M003", status: "completed" },
  { id: "S007", date: "2026-02-17", customerName: "Amit Singh", customerId: "C003", items: [{ productId: "P002", productName: "Oil Filter", quantity: 2, price: 350, subtotal: 700 }], total: 700, paid: 0, due: 700, paymentMethod: "Credit", status: "credit" },
  { id: "S008", date: "2026-02-16", items: [{ productId: "P009", productName: "Wiper Blade 18\"", quantity: 1, price: 400, subtotal: 400 }], total: 400, paid: 400, due: 0, paymentMethod: "Cash", status: "completed" },
];

export const inventoryTransactions: InventoryTransaction[] = [
  { id: "IT001", date: "2026-02-19", productId: "P001", productName: "Brake Pad Set - Front", type: "SALE", quantity: -1, referenceId: "S001" },
  { id: "IT002", date: "2026-02-19", productId: "P003", productName: "Spark Plug - Iridium", type: "SALE", quantity: -4, referenceId: "S002" },
  { id: "IT003", date: "2026-02-19", productId: "P010", productName: "Engine Oil 5W-30 4L", type: "SALE", quantity: -1, referenceId: "S002" },
  { id: "IT004", date: "2026-02-18", productId: "P007", productName: "Radiator Coolant 1L", type: "SALE", quantity: -2, referenceId: "S003" },
  { id: "IT005", date: "2026-02-18", productId: "P002", productName: "Oil Filter", type: "PURCHASE", quantity: 50, referenceId: "PO-101" },
  { id: "IT006", date: "2026-02-17", productId: "P004", productName: "Air Filter", type: "ADJUSTMENT", quantity: -2, referenceId: "ADJ-01" },
  { id: "IT007", date: "2026-02-16", productId: "P009", productName: "Wiper Blade 18\"", type: "SALE", quantity: -1, referenceId: "S008" },
];

export const payments: Payment[] = [
  { id: "PAY001", date: "2026-02-19", customerId: "C001", customerName: "Rajesh Kumar", saleId: "S001", amount: 1200, method: "Cash" },
  { id: "PAY002", date: "2026-02-19", customerId: "C003", customerName: "Amit Singh", saleId: "S002", amount: 2000, method: "Cash" },
  { id: "PAY003", date: "2026-02-18", customerId: "C004", customerName: "Vikram Sharma", saleId: "S004", amount: 1000, method: "Cash" },
  { id: "PAY004", date: "2026-02-17", customerId: "C002", customerName: "Suresh Patel", saleId: "S006", amount: 3500, method: "UPI" },
];

export const todaySummary = {
  totalSales: 5200,
  cashReceived: 3200,
  creditSales: 2000,
  totalOutstanding: 18700,
  pendingCommissions: 10500,
};
