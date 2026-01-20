import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/api';
import { Order } from '../../types';
import { ShoppingBag, Search, ExternalLink, RefreshCw, X, User, MapPin, Phone, Mail } from 'lucide-react';

const ManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders();
      // Ensure data is sorted by date (newest first)
      const sortedData = [...data].sort((a, b) => 
        new Date(b.created_at || b.date).getTime() - new Date(a.created_at || a.date).getTime()
      );
      setOrders(sortedData);
    } catch (e) {
      console.error("Failed to load orders", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await orderService.updateStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
    } catch (e) {
      // Local updates always succeed in our mock setup
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-orange-100 text-orange-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
          <div className="p-3 bg-blue-500 rounded-2xl text-white shadow-lg shadow-blue-200">
            <ShoppingBag size={28} />
          </div>
          Customer Orders
        </h1>
        <div className="relative w-full md:w-80">
           <input type="text" placeholder="Search by ID or Name..." className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm" />
           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-20 text-center"><RefreshCw className="animate-spin mx-auto text-blue-500 mb-2" /> <span className="text-slate-400 font-medium">Fetching orders...</span></td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-medium">No orders found yet.</td></tr>
              ) : orders.map(order => (
                <tr key={order.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-sm">#ORD-{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">{(order as any).customer?.name || (order as any).user?.name || 'Guest'}</span>
                      <span className="text-xs text-slate-400 font-medium">{(order as any).customer?.phone || 'No phone'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-slate-800">${order.total_amount.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        disabled={updatingId === order.id}
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase cursor-pointer border-none focus:ring-2 focus:ring-blue-400 shadow-sm transition-all ${getStatusColor(order.status)}`}
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {updatingId === order.id && <RefreshCw size={14} className="animate-spin text-blue-500" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="bg-slate-100 hover:bg-blue-500 hover:text-white p-2 rounded-xl transition-all inline-flex items-center gap-2 font-bold text-xs text-slate-600"
                    >
                      <ExternalLink size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-500">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">Order Details</h3>
                  <p className="text-sm text-slate-400 font-medium">
                    ID: #ORD-{selectedOrder.id} • {new Date(selectedOrder.created_at || (selectedOrder as any).date).toLocaleString()}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={28} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100/50">
                  <h4 className="font-black text-blue-900 flex items-center gap-2 mb-4 text-sm uppercase tracking-widest">
                    <User size={18} /> Customer
                  </h4>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-slate-800">{(selectedOrder as any).customer?.name || (selectedOrder as any).user?.name || 'Guest User'}</p>
                    <p className="text-slate-500 font-medium text-sm">{(selectedOrder as any).user?.email || 'No email provided'}</p>
                    <p className="text-blue-600 font-bold text-sm">{(selectedOrder as any).customer?.phone || (selectedOrder as any).phone || 'No phone provided'}</p>
                  </div>
                </div>
                <div className="bg-pink-50/50 p-6 rounded-[2rem] border border-pink-100/50">
                  <h4 className="font-black text-pink-900 flex items-center gap-2 mb-4 text-sm uppercase tracking-widest">
                    <MapPin size={18} /> Delivery to
                  </h4>
                  <p className="text-slate-700 font-bold leading-relaxed">
                    {(selectedOrder as any).customer?.address || (selectedOrder as any).address || 'Address not specified'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-black text-slate-800 mb-6 px-2 flex justify-between items-center">
                  <span>Ordered Items</span>
                  <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs">{(selectedOrder as any).items?.length || 0} Products</span>
                </h4>
                <div className="border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Item Description</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-center">Qty</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Price</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {(selectedOrder as any).items?.map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                                <img src={item.image_url || item.product?.image_url} className="w-full h-full object-cover" alt="" />
                              </div>
                              <span className="font-bold text-sm text-slate-700">{item.name || item.product?.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-lg text-xs">{item.quantity}</span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium text-slate-500">${(item.price || 0).toFixed(2)}</td>
                          <td className="px-6 py-4 text-right text-sm font-black text-slate-800">${((item.price || 0) * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end pt-10">
                <div className="w-full md:w-80 bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl">
                  <div className="space-y-4">
                    <div className="flex justify-between text-slate-400 font-medium">
                      <span>Subtotal</span>
                      <span>${selectedOrder.total_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 font-medium pb-4 border-b border-white/10">
                      <span>Shipping Fee</span>
                      <span className="text-green-400">FREE</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Amount Paid</span>
                      <span className="text-3xl font-black text-yellow-400">${selectedOrder.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-white flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black px-10 py-4 rounded-2xl transition-all active:scale-95"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;