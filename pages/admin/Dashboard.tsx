import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingBag, Users, TrendingUp, Clock } from 'lucide-react';
import { orderService } from '../../services/api';
import { Order } from '../../types';

const StatCard: React.FC<{ title: string, value: string | number, icon: React.ReactNode, color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
    <div className={`p-4 rounded-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const allOrders = await orderService.getAllOrders();
        setTotalOrdersCount(allOrders.length);
        
        // Sort by date (newest first) and take the top 5
        const sorted = [...allOrders].sort((a, b) => 
          new Date(b.created_at || (b as any).date).getTime() - 
          new Date(a.created_at || (a as any).date).getTime()
        ).slice(0, 5);
        
        setRecentOrders(sorted);
      } catch (error) {
        console.error("Error loading dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper to format the time ago (e.g., "5 mins ago")
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-pink-100 p-3 rounded-xl text-pink-600 shadow-lg shadow-pink-100">
          <LayoutDashboard size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500 font-medium">Overview of your store performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          title="Total Orders" 
          value={loading ? "..." : totalOrdersCount} 
          icon={<ShoppingBag size={24} className="text-blue-600" />} 
          color="bg-blue-50" 
        />
        <StatCard title="Total Products" value="45" icon={<Package size={24} className="text-yellow-600" />} color="bg-yellow-50" />
        <StatCard title="Categories" value="8" icon={<Tag size={24} className="text-pink-600" />} color="bg-pink-50" />
        <StatCard title="Customers" value="2,450" icon={<Users size={24} className="text-indigo-600" />} color="bg-indigo-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-8 px-2">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Link to="/admin/products" className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:border-yellow-400 hover:bg-yellow-50/30 transition-all text-center group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Package size={32} className="text-slate-400 group-hover:text-yellow-500 transition-colors" />
                </div>
                <span className="font-bold text-slate-700">Manage Products</span>
              </Link>
              <Link to="/admin/categories" className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:border-pink-400 hover:bg-pink-50/30 transition-all text-center group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Tag size={32} className="text-slate-400 group-hover:text-pink-500 transition-colors" />
                </div>
                <span className="font-bold text-slate-700">Manage Categories</span>
              </Link>
              <Link to="/admin/orders" className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-center group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <ShoppingBag size={32} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <span className="font-bold text-slate-700">View Orders</span>
              </Link>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 px-2">
              <TrendingUp size={20} className="text-green-500" /> Real-time Sales
            </h3>
            <div className="space-y-2">
              {loading ? (
                <p className="text-center py-10 text-slate-400">Loading sales...</p>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-10">
                  <ShoppingBag className="mx-auto text-slate-200 mb-2" size={40} />
                  <p className="text-slate-400 text-sm">No sales yet</p>
                </div>
              ) : (
                recentOrders.map(order => (
                  <div key={order.id} className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-2xl transition-colors border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                        <Users size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm truncate w-24">
                          {(order as any).customer?.name || (order as any).user?.name || 'Guest'}
                        </p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                          <Clock size={10} /> {getTimeAgo(order.created_at || (order as any).date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-black text-sm">+${order.total_amount.toFixed(2)}</p>
                      <p className="text-[9px] font-bold text-slate-300 uppercase">#ORD-{order.id}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link to="/admin/orders" className="block w-full text-center mt-6 bg-slate-50 hover:bg-slate-100 py-3 rounded-xl text-slate-600 font-bold text-sm transition-colors">
              View All Transactions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;