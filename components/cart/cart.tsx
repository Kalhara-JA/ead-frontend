import {
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import React, { useState } from "react";
import { payOrder, placeOrder } from "@/services/orderService";

import AddToWishList from "../AddToWishList";
import { Button } from "@/components/ui/button";
import PayModal from "@/components/orders/payModal";
import { PlaceOrderResponse } from "@/types/orderTypes";
import { checkInventory } from "@/services/inventoryServices";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

// Define types
type CartItem = {
  id: number;
  skuCode: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartComponentProps = {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

// Utility Component for Cart Item
const CartItemRow: React.FC<{
  item: CartItem;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
}> = ({ item, updateQuantity, removeItem }) => (
  <div className="flex items-center justify-between mb-4">
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
      <Button
        variant="outline"
        size="icon"
        onClick={() => updateQuantity(item.id, item.quantity - 1)}
      >
        <MinusIcon className="h-4 w-4" />
      </Button>
      <span className="mx-2">{item.quantity}</span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => updateQuantity(item.id, item.quantity + 1)}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="ml-2"
        onClick={() => removeItem(item.id)}
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

const CartComponent: React.FC<CartComponentProps> = ({
  cart,
  setCart,
  isCartOpen,
  setIsCartOpen,
}) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [placedOrder, setPlacedOrder] = useState<PlaceOrderResponse | null>(
    null
  );
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const [unavailableItems, setUnavailableItems] = useState<
    {
      skuCode: string;
      requestedQuantity: number;
      availableQuantity: number;
    }[]
  >([]);

  // Cart utility functions
  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Checkout and payment handlers
  const handleProceedToCheckout = async () => {
    console.log("Checking stock availability...");
    setLoading(true);
    const outOfStockItems = [];
    try {
      // Loop through cart items one by one and check availability
      console.log(cart);
      for (const item of cart) {
        const response = await checkInventory(item.skuCode, item.quantity);
        console.log(response.availableQuantity);

        // Check the response for availability
        if (response.isInStock == false) {
          outOfStockItems.push({
            skuCode: item.name,
            requestedQuantity: item.quantity,
            availableQuantity: response.availableQuantity || 0,
          });
        }
      }
      console.log(outOfStockItems);
      if (outOfStockItems.length > 0) {
        setUnavailableItems(outOfStockItems);
        alert(
          `The following items are out of stock:\n${outOfStockItems
            .map(
              (item) =>
                `${item.skuCode} (Requested: ${item.requestedQuantity}, Available: ${item.availableQuantity})`
            )
            .join("\n")}`
        );
      } else {
        toast.success("All items are in stock. Proceeding to checkout...");
        setIsPaymentModalOpen(true);
      }
    } catch (error) {
      console.error("Error checking stock availability:", error);
      toast.error("An error occurred while checking stock availability.");
    } finally {
      setLoading(false);
    }
  };
  console.log(cart);

  const handleMakePayment = async () => {
    const fullName = session?.user?.name || "";
    const [firstName, lastName] = fullName.split(" ");
    const email = session?.user?.email || "";
    const defaultAddress = `${session?.user?.address?.street_address}, ${session?.user?.address?.locality}, ${session?.user?.address?.region}, ${session?.user?.address?.postal_code}, ${session?.user?.address?.country}`;

    if (!useDefaultAddress) {
      if (!address) {
        return toast.error("Please enter your address.");
      }
    }

    console.log("cart", cart);

    try {
      const items = cart.map((item) => ({
        skuCode: item.skuCode,
        quantity: item.quantity,
      }));
      const order = {
        items: items,
        total: totalPrice,
        shippingAddress: useDefaultAddress ? defaultAddress : address,
        date: new Date().toISOString(),
        userDetails: {
          email: email,
          firstName: firstName,
          lastName: lastName,
        },
      };

      const data = await placeOrder(order);
      setPlacedOrder(data);
      toast.success("Order placed successfully!");
      setCart([]);
      setUseDefaultAddress(true);
      setIsPayModalOpen(true);
      setIsPaymentModalOpen(false);
    } catch (error: any) {
      toast.error(error);
    }
  };

  // Render logic
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
          <div className="w-full sm:w-96 bg-background shadow-lg p-6 overflow-y-auto z-50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Cart</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(false)}
              >
                <XIcon className="h-6 w-6" />
              </Button>
            </div>
            {cart.length === 0 ? (
              <p className="text-muted-foreground">Your cart is empty.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeItem={removeFromCart}
                  />
                ))}
                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      console.log("Button clicked");
                      handleProceedToCheckout();
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {isPaymentModalOpen && (
        <AddToWishList
          cart={cart}
          totalPrice={totalPrice}
          useDefaultAddress={useDefaultAddress}
          setUseDefaultAddress={setUseDefaultAddress}
          address={address}
          setAddress={setAddress}
          handleMakePayment={handleMakePayment}
          setIsPaymentModalOpen={setIsPaymentModalOpen}
        />
      )}
      {isPayModalOpen && (
        <PayModal
          pay={function (orderId: number): void {
            throw new Error("Function not implemented.");
          }}
          setIsPayModalOpen={function (isOpen: boolean): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </>
  );
};

export default CartComponent;
