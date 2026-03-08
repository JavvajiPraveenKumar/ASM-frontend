import api from "@/lib/api";
import { Category } from "@/types";

export interface CategoryResponse {
    data: Category[];
    meta: {
        page: number;
        take: number;
        itemCount: number;
        pageCount: number;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
    };
}

export const CategoryService = {
    // Get all categories
    getCategories: async (): Promise<CategoryResponse> => {
        const response = await api.get<CategoryResponse>("/categories");
        return response.data;
    },

    // Get single category
    getCategoryById: async (id: string) => {
        const response = await api.get<Category>(`/categories/${id}`);
        return response.data;
    },

    // Create category
    createCategory: async (data: Omit<Category, "id">) => {
        const response = await api.post<Category>("/categories/create", data);
        return response.data;
    },

    // Update category
    updateCategory: async (id: string, data: Partial<Category>) => {
        const response = await api.patch<Category>(`/categories/${id}`, data);
        return response.data;
    },

    // Delete category
    deleteCategory: async (id: string) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    },
};
