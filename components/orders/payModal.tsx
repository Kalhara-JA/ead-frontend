import React from 'react';

interface PaymentModalProps {
    orderId?: number;
    total?:number;
    pay: (orderId: number) => void;
    setIsPayModalOpen: (isOpen: boolean) => void;
  }
  

const PayModal = ({ orderId, total, pay, setIsPayModalOpen }: PaymentModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Pay</h2>
        {/* Dummy Payment Gateway */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-between mb-4">
            <div className="w-1/2 pr-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-1/2 pl-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="text"
                placeholder="123"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          {/* Display Payment Amount */}
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4 flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">Total Amount</span>
            <span className="text-xl font-bold text-green-600">${total}</span>
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              onClick={() => pay(orderId?orderId:0)}
            >
              Confirm Payment
            </button>
            <button
              type="reset"
              className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500"
              onClick={() => setIsPayModalOpen(false)}
            >
              Pay Later
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PayModal;
