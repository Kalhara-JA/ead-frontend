import axiosInstance from "@/lib/axiosInstance";

export const getAllInventory = async () => {
    try {
        const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/inventory`);
        return response.data;
    } catch (error) {
        console.error("Error fetching inventory:", error);
        throw error;
    }
};

export const checkInventory = async (skuCode: string, quantity: number) => {
    try {
        const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/check-stock?skuCode=${skuCode}&quantity=${quantity}`);
        return response.data;
    } catch (error) {
        console.error("Error checking inventory:", error);
        throw error;
    }
};