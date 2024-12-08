import { Button } from "./ui/button";
import React from "react";
import { useSession } from "next-auth/react";

type CartItem = {
    id: number;
    skuCode: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  };

interface AddToWishListProps {
  cart: CartItem[];
  totalPrice: number;
  useDefaultAddress: boolean;
  setUseDefaultAddress: (value: boolean) => void;
  address: string;
  setAddress: (value: string) => void;
  handleMakePayment: () => void;
  setIsPaymentModalOpen: (value: boolean) => void;
}

const AddToWishList: React.FC<AddToWishListProps> = ({
  cart,
  totalPrice,
  useDefaultAddress,
  setUseDefaultAddress,
  address,
  setAddress,
  handleMakePayment,
  setIsPaymentModalOpen,
}) => {
  const { data: session } = useSession();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Wish Order Details</h2>
        <div>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between mb-4"
            >
              <div className="flex items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mx-5">{item.quantity}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mb-4 font-semibold">Total Amount: ${totalPrice.toFixed(2)}</p>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={useDefaultAddress}
            onChange={() => setUseDefaultAddress(!useDefaultAddress)}
            className="mr-2"
          />
          <label className="font-medium">Use default address</label>
        </div>

        {useDefaultAddress ? (
          <div className="p-4 border rounded-lg mb-4">
            <h3 className="font-semibold">Default Address</h3>
            <p>
              {session?.user?.address
                ? `${session.user.address.street_address}, ${session.user.address.locality}, ${session.user.address.region}, ${session.user.address.postal_code}, ${session.user.address.country}`
                : "No default address found."}
            </p>
          </div>
        ) : (
          <>
            <label className="block mb-2 font-medium">New Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              className="w-full p-2 border rounded-md mb-4"
            />
          </>
        )}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            className="mr-2"
            onClick={() => setIsPaymentModalOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleMakePayment}>Add to Wish List</Button>
        </div>
      </div>
    </div>
  );
};

export default AddToWishList;
