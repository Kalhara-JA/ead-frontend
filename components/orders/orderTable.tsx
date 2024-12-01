import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/orderTypes";
interface OrderTableProps {
  orders: Order[];
  setSelectedOrder: (order: Order) => void;
  setIsDetailsModalOpen: (isOpen: boolean) => void;
  setIsStatusModalOpen: (isOpen: boolean) => void;
  setIsPaymentModalOpen: (isOpen: boolean) => void;
}

function OrderTable({
  orders,
  setSelectedOrder,
  setIsDetailsModalOpen,
  setIsStatusModalOpen,
  setIsPaymentModalOpen,
}: OrderTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order No</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Delivery Status</TableHead>
          <TableHead className="flex justify-center items-center">
            Payment Status
          </TableHead>
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
              <Button
                onClick={() => {
                  setSelectedOrder(order);
                  setIsStatusModalOpen(true);
                }}
                className={`inline-block w-36 px-4 py-2 text-sm font-semibold rounded-md text-center transition-all ${
                  order.deliveryStatus === "PENDING"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                    : order.deliveryStatus === "ORDERED"
                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                    : order.deliveryStatus === "RECEIVED"
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : order.deliveryStatus === "CANCELED"
                    ? "bg-red-100 text-red-800 border border-red-300"
                    : "bg-gray-100 text-gray-800 border border-gray-300"
                } hover:shadow-lg`}
              >
                {order.deliveryStatus}
              </Button>
            </TableCell>
            <TableCell>
              <div className="flex justify-center items-center">
                {order.paymentStatus !== "PAID" && (
                  <Button
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsPaymentModalOpen(true);
                    }}
                    className={`w-48 px-2 py-1 text-sm font-semibold rounded-md text-center transition-all ${
                      order.paymentStatus === "PAID"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-not-allowed"
                        : "bg-indigo-800 text-white hover:bg-indigo-600"
                    }`}
                    disabled={order.paymentStatus === "PAID"}
                  >
                    {order.paymentStatus === "PAID"
                      ? "Payment Successful"
                      : "Make Payment"}
                  </Button>
                )}
                {order.paymentStatus === "PAID" && (
                  <span className="w-48 px-2 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-md text-center">
                    ✅Payment Done!
                  </span>
                )}
              </div>
            </TableCell>

            <TableCell>{order.date}</TableCell>
            <TableCell>
              <Button
                onClick={() => {
                  setSelectedOrder(order);
                  setIsDetailsModalOpen(true);
                }}
              >
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default OrderTable;
