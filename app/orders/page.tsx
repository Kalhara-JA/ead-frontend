"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import Header from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import OrderTable from "@/components/orders/orderTable";
import OrderFilter from "@/components/orders/orderFilter";
import DetailsModal from "@/components/orders/detailsmodal";
import StatusModal from "@/components/orders/statusModal";
import PaymentModal from "@/components/orders/paymentModal";
import { Order } from "@/types/orderTypes";
//import { toast } from "react-toastify";
//import "react-toastify/dist/ReactToastify.css";
import { getAllOrders } from "@/services/orderServices";
import PayModal from "@/components/orders/payModal";
import { getMyOrders, payOrder } from "@/services/orderService";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


function OrderPage() {
  const [ordersState, setOrdersState] = useState<Order[]>([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { data: session } = useSession();

  const [filters, setFilters] = useState({
    searchTerm: "",
    statusFilter: "All",
    filterDate: "",
  });
  const router = useRouter();

  const handleNavigation = (orderNumber:string) => {
    router.push(`/orders/${orderNumber}`);
  };


  const pay = async (orderId?: number) => {
    try {
      if (!orderId) {
        throw new Error("Invalid order ID");
      }
     const data= await payOrder(orderId);
      toast.success("Payment processed successfully!");
      fetchOrders();
      setIsPaymentModalOpen(false);
    } catch (error:any) {
      toast.error(error);
    }
  }

  const fetchOrders = async () => {
    try {
      const orders = await getMyOrders(session?.user?.email);
      setOrdersState(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
  if(session)
    fetchOrders();
  }, [session]);

  const filteredOrders = ordersState.filter(
    (order) =>
      (filters.statusFilter === "All" ||
        order.deliveryStatus === filters.statusFilter) &&
      (!filters.filterDate || order.date === filters.filterDate) &&
      order.id.toString().includes(filters.searchTerm)
  );
  const handlePaymentSuccess = (orderId: number) => {
    toast.success("Payment was successful!");
    setOrdersState((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, paymentStatus: "PAID" } : order
      )
    );
    setIsPaymentModalOpen(false);
  };
  console.log("orders", filteredOrders);
  return (
    <>
    <Toaster/>
      <Header
        setCurrentPage={() => {}}
        cart={[]}
        setCart={() => {}}
        isCartOpen={false}
        setIsCartOpen={() => {}}
      />
      
      <section className="w-full py-1 md:py-2 lg:py-3 bg-muted">
      


        <div className="p-6">
        <span className="font-bold  text-lg text-gray-500 ">My Orders</span>
        <br></br><br></br>
          <OrderFilter filters={filters} setFilters={setFilters} />
          <OrderTable
            orders={filteredOrders}
            setSelectedOrder={setSelectedOrder}
            setIsDetailsModalOpen={handleNavigation}
            setIsStatusModalOpen={setIsStatusModalOpen}
            setIsPaymentModalOpen={setIsPaymentModalOpen}
          />
        </div>
      </section>
      {isDetailsModalOpen && selectedOrder && (
        <DetailsModal
          isOpen={isDetailsModalOpen}
          order={selectedOrder}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}

      {isStatusModalOpen && selectedOrder && (
        <StatusModal
          isOpen={isStatusModalOpen}
          order={selectedOrder}
          newStatus={selectedOrder.deliveryStatus}
          setNewStatus={(newStatus: any) =>
            setSelectedOrder((prev) =>
              prev ? { ...prev, deliveryStatus: newStatus } : prev
            )
          }
          onClose={() => setIsStatusModalOpen(false)}
          onSave={(newStatus: any) =>
            setOrdersState((prev) =>
              prev.map((o) =>
                o.id === selectedOrder.id
                  ? { ...o, deliveryStatus: newStatus }
                  : o
              )
            )
          }
        />
      )}
      {isPaymentModalOpen && selectedOrder && (
         <PayModal orderId={selectedOrder.id} total={selectedOrder.total} pay={pay} setIsPayModalOpen={setIsPaymentModalOpen} />
      )}
      <SiteFooter />
    </>
  );
}

export default OrderPage;
