import axiosInstance from "@/lib/axiosInstance";
import { OrderDetails } from "@/types/orderTypes";


export const getAllOrder = async () => {
    try {
        const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/products`);
        console.log(response);
        return response.data; // Axios stores the response data in `data`
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
    };

    export const placeOrder = async (orderDetails:OrderDetails) => {
        try {
          const response = await axiosInstance.post(
            `/v1/orders`,
            orderDetails,
          {timeout: 100000}
          );
          console.log(response.data);
          return response.data; // Axios stores the response data in `data`
        } catch (error:any) {
          console.error("Error placing order:", error);
          if (error.response.data.exceptions) throw error.response.data.exceptions;
          throw Error("Order placing failed").message;	
        }
      };

      export const payOrder = async (orderid:number) => {
        try {
          const response = await axiosInstance.put(`/v1/orders/${orderid}/payment`);
          console.log(response.data);
          return response.data; // Axios stores the response data in `data`
        } catch (error:any) {
          console.error("Error placing order:", error);
          if (error.response.data) throw error.response.data;
          throw Error("payment failed").message;	
        }
      };