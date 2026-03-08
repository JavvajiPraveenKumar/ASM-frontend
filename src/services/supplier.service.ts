import api from "@/lib/api";
import { Supplier } from "@/types";

export interface SupplierResponse {
    data: Supplier[];
    meta: {
        page: number;
        take: number;
        itemCount: number;
        pageCount: number;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
    };
}

export const SupplierService = {
    // Get all suppliers
    getSuppliers: async (): Promise<SupplierResponse> => {
        const response = await api.get<SupplierResponse>("/suppliers");
        return response.data;
    },

    // Get single supplier
    getSupplierById: async (id: string) => {
        const response = await api.get<Supplier>(`/suppliers/${id}`);
        return response.data;
    },

    // Create supplier
    createSupplier: async (data: Omit<Supplier, "id">) => {
        const response = await api.post<Supplier>("/suppliers", data);
        return response.data;
    },

    // Update supplier
    updateSupplier: async (id: string, data: Partial<Supplier>) => {
        const response = await api.patch<Supplier>(`/suppliers/${id}`, data);
        return response.data;
    },

    // Delete supplier
    deleteSupplier: async (id: string) => {
        const response = await api.delete(`/suppliers/${id}`);
        return response.data;
    },
};
