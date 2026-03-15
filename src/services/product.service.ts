import api from "@/lib/api";
import { Product } from "@/types";
import { ProductResponse } from "@/types";
export const ProductService = {
    // Get all products
    getProducts: async (): Promise<ProductResponse> => {
        const response = await api.get<ProductResponse>("/spare-parts");
        return response.data;
    },

    // Get single product
    getProductById: async (id: string) => {
        const response = await api.get<ProductResponse>(`/spare-parts/${id}`);
        return response.data;
    },

    // Create product
    createProduct: async (data: Omit<Product, "id">) => {
        const response = await api.post<Product>("/spare-parts", data);
        return response.data;
    },

    // Update product
    updateProduct: async (id: string, data: Partial<Product>) => {
        const response = await api.patch<Product>(`/spare-parts/${id}`,data);
        return response.data;
    },

    // Delete product
    deleteProduct: async (id: string) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },
};
