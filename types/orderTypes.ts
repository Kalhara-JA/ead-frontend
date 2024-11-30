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