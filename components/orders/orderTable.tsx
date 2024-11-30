import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/orderTypes";
interface OrderTableProps {
  orders: Order[];
  setSelectedOrder: (order: Order) => void;
  setIsDetailsModalOpen: (isOpen: boolean) => void;
  setIsStatusModalOpen: (isOpen: boolean) => void;
  setIsPaymentModalOpen: (isOpen: boolean) => void;
}


function OrderTable({ orders, setSelectedOrder, setIsDetailsModalOpen, setIsStatusModalOpen,setIsPaymentModalOpen }: OrderTableProps) {
  console.log("orders", orders)
    return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order No</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Delivery Status</TableHead>
          <TableHead>Payment Status</TableHead>
          <TableHead>Ordered Date</TableHead>
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>${order.total}</TableCell>
            <TableCell>
                <Button onClick={() => { setSelectedOrder(order); setIsStatusModalOpen(true); }}>
                    {order.deliveryStatus}
                </Button>
            </TableCell>
            <TableCell>
                <Button onClick={() => { setSelectedOrder(order); setIsPaymentModalOpen(true); }}>
                    {order.paymentStatus}
                </Button>
            </TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell>
              <Button onClick={() => { setSelectedOrder(order); setIsDetailsModalOpen(true); }}>View</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default OrderTable;
