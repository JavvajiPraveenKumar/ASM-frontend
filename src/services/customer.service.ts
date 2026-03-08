import api from "@/lib/api";
import { Customer } from "@/types";

export interface CustomerResponse {
    data: Customer[];
    meta: {
        page: number;
        take: number;
        itemCount: number;
        pageCount: number;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
    };
}

export const CustomerService = {
    // Get all customers
    getCustomers: async (): Promise<CustomerResponse> => {
        const response = await api.get<CustomerResponse>("/customers");
        return response.data;
    },

    // Get single customer
    getCustomerById: async (id: string) => {
        const response = await api.get<Customer>(`/customers/${id}`);
        return response.data;
    },

    // Create customer
    createCustomer: async (data: Omit<Customer, "id">) => {
        const response = await api.post<Customer>("/customers", data);
        return response.data;
    },

    // Update customer
    updateCustomer: async (id: string, data: Partial<Customer>) => {
        const response = await api.patch<Customer>(`/customers/${id}`, data);
        return response.data;
    },

    // Delete customer
    deleteCustomer: async (id: string) => {
        const response = await api.delete(`/customers/${id}`);
        return response.data;
    },
};
