
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
    const data = await orderService.getAllOrders();
    setOrders(data);
    setLoading(false);
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
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
          <ShoppingBag className="text-blue-500" /> Customer Orders
        </h1>
        <div className="relative w-64">
           <input type="text" placeholder="Search orders..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">Order ID</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">Customer</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">Total</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading orders...</td></tr>
            ) : orders.map(order => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">#ORD-{order.id}</td>
                <td className="px-6 py-4 text-slate-600">{(order as any).user?.name || 'Guest'}</td>
                <td className="px-6 py-4 font-bold text-slate-800">${order.total_amount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <select
                      disabled={updatingId === order.id}
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase cursor-pointer border-none focus:ring-2 focus:ring-blue-400 ${getStatusColor(order.status)}`}
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {updatingId === order.id && <RefreshCw size={14} className="animate-spin text-slate-400" />}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-500 hover:text-blue-600 inline-flex items-center gap-1 font-bold text-sm"
                  >
                    View <ExternalLink size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Order #ORD-{selectedOrder.id} Details</h3>
                <p className="text-sm text-slate-400">{new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-8">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 rounded-2xl space-y-3">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                    <User size={18} className="text-blue-500" /> Customer Info
                  </h4>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Mail size={14} /> {(selectedOrder as any).user?.email || 'N/A'}
                  </p>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <User size={14} /> {(selectedOrder as any).user?.name || 'Guest User'}
                  </p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl space-y-3">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                    <MapPin size={18} className="text-pink-500" /> Shipping Info
                  </h4>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <MapPin size={14} /> {(selectedOrder as any).address || '123 Baby Lane, Toyland City'}
                  </p>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Phone size={14} /> {(selectedOrder as any).phone || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-bold text-slate-800 mb-4 px-2">Ordered Items</h4>
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Item</th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-center">Qty</th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-right">Price</th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedOrder as any).items?.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <img src={item.product?.image_url} className="w-10 h-10 rounded-lg object-cover" alt="" />
                              <span className="font-bold text-sm text-slate-700">{item.product?.name || 'Product'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center text-sm font-medium text-slate-600">{item.quantity}</td>
                          <td className="px-4 py-4 text-right text-sm text-slate-600">${item.price.toFixed(2)}</td>
                          <td className="px-4 py-4 text-right text-sm font-bold text-slate-800">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div className="flex justify-end pt-4">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-slate-500 text-sm">
                    <span>Subtotal</span>
                    <span>${selectedOrder.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-sm">
                    <span>Shipping</span>
                    <span className="text-green-500">FREE</span>
                  </div>
                  <div className="flex justify-between text-xl font-extrabold text-slate-800 pt-3 border-t border-slate-100">
                    <span>Total</span>
                    <span className="text-pink-500">${selectedOrder.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold px-6 py-2 rounded-xl transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
