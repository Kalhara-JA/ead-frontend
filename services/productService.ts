import axiosInstance from "@/lib/axiosInstance";


export const getAllProducts = async () => {
    try {
        const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/products`);
        console.log(response);
        return response.data; // Axios stores the response data in `data`
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
    };

    export const getQuantityOfAProduct = async (skuCode: string) => {
        console.log("skuCode", skuCode);
        try {
            const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/getProductQuantity/${skuCode}`);
            console.log(response);
            return response.data; // Axios stores the response data in `data`
        } catch (error) {
            console.error("Error fetching product quantity:", error);
            throw error;
        }
    };