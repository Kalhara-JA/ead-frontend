import React from "react";
import { Order } from "@/types/orderTypes";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  newStatus: string;
  setNewStatus: (status: string) => void;
  onSave: (newStatus: string) => void;
  order: Order;
}


const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  newStatus,
  setNewStatus,
    onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Change Order Status</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-700 focus:outline-none ml-3">
            ✕
          </button>
        </div>
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none hover:bg-gray-100"
        >
          <option value="Pending">Pending</option>
          <option value="Orderd">Orderd</option>
          <option value="Recived">Recived</option>
          <option value="Canceled Orders">Canceled Orders</option>
        </select>
        <div className="flex justify-end mt-6 space-x-4">
          <button onClick={onClose} className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition">
            Cancel
          </button>
          <button onClick={() => onSave(newStatus)} className="py-2 px-4 bg-black hover:bg-gray-600 text-white rounded-md transition">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
