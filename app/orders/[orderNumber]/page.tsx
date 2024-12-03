"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleArrowLeft, Truck, CheckCircle, Loader, AlertTriangle, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
//import "./OrderDetailsPage.css"; // Import custom CSS for scroll styling
import toast, { Toaster } from 'react-hot-toast';
import {cancelOrder, fetchOrderByOrderNumber, payOrder } from "@/services/orderService";
import Header from "@/components/site-header";
import PayModal from "@/components/orders/payModal";
import CancelOrderModel from "@/components/orders/cancelOrder";

interface Order {
  id: number;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  date: string;
  shippingAddress: string;
  paymentStatus: string;
  deliveryStatus: string;
  email: string;
}

interface OrderItem {
  skuCode: string;
  quantity: number;
}

function OrderDetailsPage({ params }: { params: { orderNumber: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order>();
  const [isPayModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelModelOpen,setCancelModelOpen] = useState(false);
 

  const loadOrderData = async () => {
    try {
      const data = await fetchOrderByOrderNumber(params.orderNumber);
      setOrder(data);
    } catch (err) {
      console.error("Error fetching order data:", err);
    }
  };

  const pay = async (orderId?: number) => {
    try {
      if (!order?.id) {
        throw new Error("Invalid order ID");
      }
     const data= await payOrder(order?.id);
      toast.success("Payment processed successfully!");
      loadOrderData();
      setIsPaymentModalOpen(false);

    } catch (error:any) {
      toast.error(error);
    }
  }

  const cancel = async (orderId?: number) => {
    try {
      if (!order?.id) {
        throw new Error("Invalid order ID");
      }
     const data= await cancelOrder(order?.id);
      toast.success("Payment processed successfully!");
      loadOrderData();
      setCancelModelOpen(false);

    } catch (error:any) {
      toast.error(error);
    }
  }

  // const deliverOrder = async (id?: number) => {
  //   try {
  //     if(id==undefined) return;
  //     const data = await deliverOrderById(id);
  //     toast.success(data);
  //     loadOrderData();
  //   } catch (err:any) {
  //     if(err.response)
  //     toast.error(` ${err.response.data}`);
  //   }
  // }

  // const shipOrder = async (id?: number) => {
  //   try {
  //     if(id==undefined) return;
  //     const data = await shipOrderById(id);
  //     toast.success(data);
  //     loadOrderData();
  //   } catch (err:any) {
  //     if(err.response)
  //     toast.error(` ${err.response.data}`);
  //   }
  // }

  useEffect(() => {
    loadOrderData();
  }, []);

 

  const handleBackClick = () => {
    router.back();
  };


  return (
    <>
     <Header
        setCurrentPage={() => {}}
        cart={[]}
        setCart={() => {}}
        isCartOpen={false}
        setIsCartOpen={() => {}}
      />
    <div className="order-details-page h-full w-full p-8 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
      <Toaster  
      toastOptions={{
        style: {
          fontWeight: 'bold',
        }
          }}/>
      {/* Header Section */}
     
      <br></br>
      <div className="flex items-center mb-6">
        <CircleArrowLeft
          className="w-6 h-6 text-gray-600 cursor-pointer mr-4"
          onClick={handleBackClick}
          aria-label="Back"
        />
        <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
      </div>
      <hr className="mb-6 border-gray-200" />

      {/* Scrollable Order Details Section */}
      <div className="flex flex-col flex-grow overflow-y-auto custom-scrollbar">
        {/* Order Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div>
            <p className="font-sm text-gray-600">Order No:</p>
            <p className="text-sm font-semibold text-gray-600">{order?.orderNumber}</p>
          </div>
          <div>
            <p className="font-sm text-gray-600">Email:</p>
            <p className="text-sm font-semibold text-gray-600">{order?.email}</p>
          </div>
          <div>
            <p className="font-sm text-gray-600">Bill Value:</p>
            <p className="text-sm font-semibold text-gray-600">${order?.total}</p>
          </div>
          <div>
            <p className="font-sm text-gray-600">Date:</p>
            <p className="text-sm font-semibold text-gray-600">{order?.date}</p>
          </div>
          <div>
            <p className="font-sm text-gray-600">Payment Status:</p>
            <p
              className={`text-sm font-semibold ${
                order?.paymentStatus === "PAID" ? "text-green-600" : "text-red-600"
              }`}
            >
              {order?.paymentStatus}
            </p>
          </div>
          <div>
            <p className="font-sm text-gray-600">Shipping Address:</p>
            <p className="text-sm font-semibold text-gray-600">{order?.shippingAddress}</p>
          </div>
        </div>

<br/>
<div className="flex space-x-2 ">

  {order?.paymentStatus==="UNPAID"&&<Button variant="default" onClick={()=>setIsPaymentModalOpen(true)}>Make Payment</Button>}
  {order?.paymentStatus==="UNPAID"&&<Button variant="destructive" onClick={()=>setCancelModelOpen(true)}>Cancel Order</Button>}
  {isPayModalOpen&&<PayModal setIsPayModalOpen={setIsPaymentModalOpen}  pay={pay}   orderId={order?.id} total={order?.total} />}
  {isCancelModelOpen&&<CancelOrderModel isOpen={isCancelModelOpen} onClose={()=>setCancelModelOpen(false)} onConfirm={cancel}/>}
</div>
<br></br>

      <span className="text-lg font-semibold text-gray-800 mb-4">Order Status</span>
      {order?.deliveryStatus === "PENDING" && (
      <button className="flex items-center space-x-2 bg-green-400 rounded-lg p-4">PENDING</button>
      )}
      {order?.deliveryStatus === "SHIPPED" && (
      <button className="flex items-center space-x-2 bg-green-400 rounded-lg p-4">SHIPPED</button>
      )}
      {order?.deliveryStatus === "DELIVERED" && (
      <button className="flex items-center space-x-2 bg-green-400 rounded-lg p-4">DELIVERED</button>
      )}
      <br></br>
      

          {/* Order Items Section */}
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
          <div className="bg-gray-50 rounded-lg shadow-inner p-4">
            <ul className="divide-y divide-gray-200">
              {order?.items.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between py-2 px-2 bg-white hover:bg-gray-100 rounded-md transition"
                >
                  <div>
                    <p className="font-medium text-gray-700">SKU:</p>
                    <p className="text-gray-900">{item.skuCode}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Quantity:</p>
                    <p className="text-gray-900">{item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
</>
  );
}

export default OrderDetailsPage;
