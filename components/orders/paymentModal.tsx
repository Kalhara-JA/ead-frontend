import { Order } from "@/types/orderTypes";
import React, { useState } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onPaymentSuccess: (orderId: number) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  order,
  onPaymentSuccess,
}) => {
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const handlePayment = () => {
    setIsPaymentProcessing(true);

    // Simulating payment processing
    setTimeout(() => {
      setIsPaymentProcessing(false);
      setIsPaymentSuccessful(true);
      if (order) onPaymentSuccess(order.id); // Notify parent about payment success
    }, 2000); // Mock delay for processing
  };
  if (!isOpen || !order) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Payment Update</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-700 focus:outline-none ml-3"
          >
            ✕
          </button>
        </div>
        <p>
          <strong>Order No:</strong> {order.id}
        </p>
        <p>
          <strong>Total Price:</strong> ${order.total.toFixed(2)}
        </p>
        <p>
          <strong>Last Updated:</strong> {order.date}
        </p>
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition"
          >
            Cancel
          </button>
          <button
            onClick={isPaymentSuccessful ? onClose : handlePayment}
            className={`py-2 px-4 ${
              isPaymentSuccessful
                ? "bg-green-500 text-white"
                : "bg-black hover:bg-gray-600 text-white"
            } rounded-md transition`}
            disabled={isPaymentProcessing}
          >
            {isPaymentSuccessful
              ? "Payment Successful"
              : isPaymentProcessing
              ? "Processing..."
              : "Make Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
