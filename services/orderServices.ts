import axiosInstance from "@/lib/axiosInstance";


export const getAllOrders = async () => {
    try {
        const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/orders`);
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

export const postOrders = async (orderData: any) => {
    try {
        const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/orders`, orderData);
        return response.data;
    } catch (error) {
        console.error("Error posting order:", error);
        throw error;
    }
};
