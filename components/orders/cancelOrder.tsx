import React from 'react';
import { Button } from '../ui/button';
 // Ensure Button component is imported from your component library or file

 interface CancelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
// Allows any valid React node, such as strings, JSX, etc.
  }
  

const CancelOrderModel = ({ isOpen, onClose, onConfirm }:CancelModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full transition-transform transform scale-95 hover:scale-100">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Are you sure you want to cancel?</h3>
      <div className="flex justify-between w-full">
  <Button 
    variant="outline" 
    className="flex-1 px-6 py-2 border-gray-400 hover:border-gray-500 hover:text-gray-800 text-gray-600 transition duration-200 mr-2" 
    onClick={onClose}
  >
    No
  </Button>
  <Button 
    variant="destructive" 
    className="flex-1 px-6 py-2 bg-red-600 text-white hover:bg-red-700 transition duration-200" 
    onClick={() => {
      onConfirm();
    }}
  >
    Yes
  </Button>
</div>

    </div>
  </div>
  
  );
};

export default CancelOrderModel;
