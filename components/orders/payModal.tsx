import React, { useState } from 'react';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover } from 'react-icons/fa';

interface PaymentModalProps {
  orderId?: number;
  total?: number;
  pay: (orderId: number) => void;
  setIsPayModalOpen: (isOpen: boolean) => void;
}

const PayModal = ({ orderId, total, pay, setIsPayModalOpen }: PaymentModalProps) => {
  const [cardType, setCardType] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<{
    cardType?: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Validate Card Type
    if (!cardType) {
      newErrors.cardType = 'Please select a card type.';
    }

    // Validate Card Number
    if (!/^\d{16}$/.test(cardNumber)) {
      newErrors.cardNumber = 'Card number must be 16 digits.';
    }

    // Validate Expiry Date
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be in MM/YY format.';
    } else {
      const [month, year] = expiryDate.split('/').map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100; // Last two digits of the year
      const currentMonth = now.getMonth() + 1;

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiryDate = 'Expiry date is invalid or expired.';
      }
    }

    // Validate CVV
    if (!/^\d{3}$/.test(cvv)) {
      newErrors.cvv = 'CVV must be a 3-digit number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      pay(orderId || 0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Pay </h2>
        <form onSubmit={handleSubmit}>
          {/* Card Type */}
          <div className="mb-4">
            <div className="flex space-x-4">
              {[
                { type: 'Visa', icon: <FaCcVisa size={40} className="text-blue-600" /> },
                { type: 'Mastercard', icon: <FaCcMastercard size={40} className="text-yellow-600" /> },
                { type: 'Amex', icon: <FaCcAmex size={40} className="text-blue-800" /> },
                { type: 'Discover', icon: <FaCcDiscover size={40} className="text-orange-600" /> },
              ].map(({ type, icon }) => (
                <label
                  key={type}
                  className={`flex flex-col items-center border rounded-lg p-2 cursor-pointer ${
                    cardType === type ? 'border-blue-600' : 'border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="cardType"
                    value={type}
                    className="hidden"
                    onChange={() => setCardType(type)}
                  />
                  {icon}
                </label>
              ))}
            </div>
            {errors.cardType && <p className="text-red-500 text-sm mt-1">{errors.cardType}</p>}
          </div>

          {/* Card Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className={`w-full border ${
                errors.cardNumber ? 'border-red-500' : 'border-gray-300'
              } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
              maxLength={16}
            />
            {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
          </div>

          {/* Expiry Date and CVV */}
          <div className="flex justify-between mb-4">
            <div className="w-1/2 pr-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                className={`w-full border ${
                  errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
              {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
            </div>

            <div className="w-1/2 pl-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input
                type="text"
                placeholder="123"
                className={`w-full border ${
                  errors.cvv ? 'border-red-500' : 'border-gray-300'
                } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                maxLength={3}
              />
              {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4 flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">Total Amount</span>
            <span className="text-xl font-bold text-green-600">${total}</span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Confirm Payment
            </button>
            <button
              type="button"
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
