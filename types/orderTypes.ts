export type Order = {
  id: number;
  ordername: string;
  total: number;
  date: string;
  shippingAddress: string;
  paymentStatus: string;
  deliveryStatus: string;
  items: Item[],
  }
  
  export type Item = {
      skuCode: string;
      quantity: number;
  }

  
  export type PlaceOrderResponse = {
      orderId: number;
      orderNumber: string;
      total: number;
      exceptions: string;
    };

  export  type OrderDetails = {
      items: { 
        skuCode: string; 
        quantity: number; 
      }[];
      total: number;
      shippingAddress: string;
      date: string;
      userDetails: {
        email: string;
        firstName: string;
        lastName: string;
      };
    };
    