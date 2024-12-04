"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ShoppingCartIcon,
  MenuIcon,
  XIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import CompanyLogoSection from "@/components/company-logo";
import DealsSection from "@/components/deals-section";
import CategorySection from "@/components/category-section";
import TestimonialSection from "@/components/testimonial-section";
import FeaturesSection from "@/components/features-section";
import CTASignUpSection from "@/components/cta-section";
import SiteFooter from "@/components/site-footer";
import ProductPage from "@/components/product-section";
import Header from "@/components/site-header";
import { getAllProducts } from "@/services/productService";
import { useSession } from "next-auth/react";
import { PlaceOrderResponse } from "@/types/orderTypes";
import { payOrder, placeOrder } from "@/services/orderService";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { postOrders } from "@/services/orderServices";
import PayModal from "@/components/orders/payModal";
import { checkInventory } from "@/services/inventoryServices";

const categories = [
  { name: "Marketing Tools", icon: "📈" },
  { name: "Design Software", icon: "🎨" },
  { name: "AI Solutions", icon: "🤖" },
  { name: "Project Management", icon: "📅" },
  { name: "Communication Tools", icon: "💬" },
  { name: "Analytics Platforms", icon: "📊" },
];

const deals = [
  {
    id: 7,
    name: "iphone_15",
    price: 79.99,
    originalPrice: 129.99,
    image: "https://via.placeholder.com/1000",
    tag: "New Product",
  },
  {
    id: 8,
    name: "Cloud Sync Ultimate",
    price: 49.99,
    originalPrice: 89.99,
    image: "https://via.placeholder.com/1000",
    tag: "Deal of the Day",
  },
  {
    id: 9,
    name: "Marketing Automation Suite",
    price: 159.99,
    originalPrice: 249.99,
    image: "https://via.placeholder.com/1000",
    tag: "Monthly Special",
  },
  {
    id: 10,
    name: "Collaboration Platform",
    price: 29.99,
    originalPrice: 59.99,
    image: "https://via.placeholder.com/1000",
    tag: "New Deal",
  },
];

export default function ECommerceApp() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [cart, setCart] = useState<
    {
      id: number;
      name: string;
      price: number;
      image: string;
      quantity: number;
    }[]
  >([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await getAllProducts();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  console.log(products);
  // if (loading) return <p>Loading...</p>;

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // @ts-ignore
  const addToCart = (product) => {
    // @ts-ignore
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      // @ts-ignore
      setCart(
        // @ts-ignore
        cart.map((item) =>
          // @ts-ignore
          item.id === product.id
            ? // @ts-ignore
              { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // @ts-ignore
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // @ts-ignore
  const removeFromCart = (productId) => {
    // @ts-ignore
    setCart(cart.filter((item) => item.id !== productId));
  };

  // @ts-ignore
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      // @ts-ignore
      removeFromCart(productId);
    } else {
      // @ts-ignore
      setCart(
        // @ts-ignore
        cart.map((item) =>
          // @ts-ignore
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // @ts-ignore
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  // @ts-ignore
  const totalPrice = cart.reduce(
    // @ts-ignore
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const renderLandingPage = () => (
    // Landing Page  Section
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-28 xl:py-28 bg-white dark:bg-black overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_700px] items-center">
            <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl xl:text-6xl/none text-black dark:text-white">
                Shop with Ease, Anytime, Anywhere
              </h1>
              <p className="max-w-[600px] text-gray-600 dark:text-gray-300 md:text-xl mx-auto lg:mx-0">
                Discover a world of products at your fingertips. From fashion to
                electronics, we've got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  className="inline-flex items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black shadow transition-colors hover:bg-gray-800 dark:hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
                  onClick={() => setCurrentPage("products")}
                >
                  Shop Now
                  <ShoppingBag className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="inline-flex items-center justify-center border-black text-black dark:border-white dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
                  onClick={() => window.open("https://easyui.pro", "_blank")}
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative mx-auto lg:order-last">
              <img
                alt="Hero"
                className="relative z-10 w-full h-[auto] max-w-[700px] aspect-[4/3] object-cover object-center"
                height="750"
                src="/shopUs3.jpg"
                width="700"
              />
              <div className="absolute -top-4 -left-4 w-6 h-6 bg-black dark:bg-white rounded-full" />
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-black dark:bg-white rounded-full" />

              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), rgba(0,0,0,0.05) 70%, transparent 70%)",
                }}
              />
            </div>
          </div>
        </div>
      </section>
      <CompanyLogoSection />
      <DealsSection deals={deals} addToCart={addToCart} />

      <CategorySection categories={categories} />

      <TestimonialSection />

      <FeaturesSection />

      <CTASignUpSection />
    </main>
  );
  const { data: session } = useSession();

  const renderCart = () => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isPayModalOpen, setIsPayModalOpen] = useState(false); // New state for Pay modal
    const [address, setAddress] = useState("");
    const [placedOrder, setPlacedOrder] = useState<PlaceOrderResponse | null>(null);
 

    const [useDefaultAddress, setUseDefaultAddress] = useState(true); // State to switch between default and new address
    const [unavailableItems, setUnavailableItems] = useState<
      {
        skuCode: string;
        requestedQuantity: number;
        availableQuantity: number;
      }[]
    >([]);
    const handleProceedToCheckout = async () => {
      setLoading(true);
      const outOfStockItems = [];
      try {
        // Loop through cart items one by one and check availability
        console.log(cart);
        for (const item of cart) {
          const response = await checkInventory(item.name, item.quantity);
          console.log(response.availableQuantity);

          // Check the response for availability
          if (response.inStock == false) {
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
          alert("All items are in stock. Proceeding to checkout...");
          setIsPaymentModalOpen(true);
        }
      } catch (error) {
        console.error("Error checking stock availability:", error);
        alert("An error occurred while checking stock availability.");
      } finally {
        setLoading(false);
      }
    };

    const defaultAddress = `${session?.user?.address?.street_address}, ${session?.user?.address?.locality}, ${session?.user?.address?.region}, ${session?.user?.address?.postal_code}, ${session?.user?.address?.country}`;
    const handleMakePayment = async () => {
      const fullName = session?.user?.name || "";
      const [firstName, lastName] = fullName.split(" ");
      const email = session?.user?.email || "";

      try {
        const items = cart.map((item) => ({
          skuCode: item.name,
          quantity: item.quantity,
        }));
        const order = {
          items: items,
          total: totalPrice,
          shippingAddress: useDefaultAddress ? defaultAddress : address,
          date: "2001-05-25",
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
        {/* Cart Section */}
        {isCartOpen && (
          <>
            <Toaster />
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => {
                setIsCartOpen(false);
                setUnavailableItems([]);
              }}
            />
            <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-background shadow-lg p-6 overflow-y-auto z-50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsCartOpen(false);
                    setUnavailableItems([]);
                  }}
                >
                  <XIcon className="h-6 w-6" />
                </Button>
              </div>
              {cart.length === 0 ? (
                <p className="text-muted-foreground">Your cart is empty.</p>
              ) : (
                <>
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
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <MinusIcon className="h-4 w-4" />
                        </Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                    {unavailableItems.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-red-500 font-semibold mb-2">
                          Out of Stock Items
                        </h3>
                        <ul>
                          {unavailableItems.map((item) => (
                            <li key={item.skuCode}>
                              {item.skuCode} - (Requested:{" "}
                              {item.requestedQuantity}, Available:{" "}
                              {item.availableQuantity})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      onClick={handleProceedToCheckout}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* Payment Modal */}
        {isPaymentModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Wish Order Details</h2>
              <p>
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
              </p>
              <p className="mb-4 font-semibold">
                Total Amount: ${totalPrice.toFixed(2)}
              </p>

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
                  <p>{`${session?.user?.address?.street_address}, ${session?.user?.address?.locality}, ${session?.user?.address?.region}, ${session?.user?.address?.postal_code}, ${session?.user?.address?.country}`}</p>
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
        )}

        {/* Pay Modal */}
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        setCurrentPage={setCurrentPage}
        cart={cart}
        setCart={setCart}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
      />
      {currentPage === "landing" ? (
        renderLandingPage()
      ) : (
        <ProductPage products={products} addToCart={addToCart} />
      )}
      {renderCart()}
      <SiteFooter />
    </div>
  );
}
