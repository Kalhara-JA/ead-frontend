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
          {timeout: 5000}
          );
          console.log(response.data);
          return response.data; // Axios stores the response data in `data`
        } catch (error:any) {
          console.error("Error placing order:", error);
          if (typeof error.response.data.exceptions ==='string') throw error.response.data.exceptions;
          throw Error("Order placing failed").message;	
        }
      };

      export const payOrder = async (orderid:number) => {
        try {
          const response = await axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/orders/${orderid}/payment`);
          console.log(response.data);
          return response.data; // Axios stores the response data in `data`
        } catch (error:any) {
          console.error("Error placing order:", error);
          if (typeof error.response.data === 'string') throw error.response.data;
          throw Error("Payment failed").message;	
        }
      };

      export const cancelOrder = async (orderid:number) => {
        try {
          const response = await axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/v1/orders/${orderid}/cancel`);
          console.log(response.data);
          return response.data; // Axios stores the response data in `data`
        } catch (error:any) {
          //console.error("Error placing order:", error);
          if (typeof error.response.data === 'string') throw error.response.data;
          throw Error("Order cancel failed").message;	
        }
      };

      export const fetchOrderByOrderNumber = async (orderNumber:string) => {
        try {
          const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/orders/${orderNumber}`
          );
          return response.data;
        } catch (error) {
          console.error("Error fetching Order:", error);
          throw error;
        }
      };

      export const getMyOrders = async (email?:string) => {
        try {
            const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/orders/user/${email}/orders`);
            return response.data;
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    };
    
