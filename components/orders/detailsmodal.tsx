import React from "react";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/orderTypes";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}
const DetailsModal: React.FC<DetailsModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!isOpen || !order) return null;

  console.log("DetailsModalProps", order);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <p>
          <strong>Order No:</strong> {order.id}
        </p>
        <p>
          <strong>Order Items:</strong>
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border border-gray-300 text-left">
                  Item Name
                </th>
                <th className="px-4 py-2 border border-gray-300 text-left">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((part) => (
                <tr key={part.skuCode} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-300">
                    {part.skuCode}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {part.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <strong>Total Price:</strong> ${order.total.toFixed(2)}
        </p>
        <p>
          <strong>Current Status:</strong> {order.deliveryStatus}
        </p>
        <p>
          <strong>Ordered Date:</strong> {order.date}
        </p>
        <Button onClick={onClose} className="mt-4">
          Close
        </Button>
      </div>
    </div>
  );
};

export default DetailsModal;
