"use client";

import React, { useState } from "react";
import { payOrder, placeOrder } from "@/services/orderService";

import AddToWishList from "../AddToWishList";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import PayModal from "../orders/payModal";
import { PlaceOrderResponse } from "@/types/orderTypes";
import { XIcon } from "lucide-react";
import { checkInventory } from "@/services/inventoryServices";
import toast from "react-hot-toast";
import { useCart } from "@/context/cartContext";
import { useSession } from "next-auth/react";

const CartSidebar = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    emptyCart,
  } = useCart();

  if (!isCartOpen) return null;

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
      emptyCart();
      setUseDefaultAddress(true);
      setIsPayModalOpen(true);
      setIsPaymentModalOpen(false);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const pay = async (orderId?: number) => {
    try {
      if (!orderId) {
        throw new Error("Invalid order ID");
      }
      const data = await payOrder(orderId);
      toast.success("Payment processed successfully!");
      setIsPayModalOpen(false);
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <>
      <div className="fixed inset-y-0 right-0 z-50 w-96 bg-white shadow-lg transform translate-x-0 transition-transform duration-300 ease-in-out">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <div className="overflow-y-auto h-[calc(100vh-200px)]">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center p-4 border-b hover:bg-gray-50 transition-colors"
              >
                <div className="relative w-16 h-16 mr-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    ${item.price.toFixed(2)}
                  </p>

                  <div className="flex items-center mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
            <div className="flex justify-between mb-4">
              <span className="font-bold">Total</span>
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
        )}
      </div>
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
        orderId={placedOrder?.orderId}
        total={placedOrder?.total}
        pay={pay}
        setIsPayModalOpen={setIsPayModalOpen}
      />
      )}
    </>
  );
};

export default CartSidebar;
