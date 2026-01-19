
import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingBag, Users, TrendingUp } from 'lucide-react';

const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode, color: string }> = ({ title, value, icon, color }) => (
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
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-pink-100 p-3 rounded-xl text-pink-600">
          <LayoutDashboard size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500">Overview of your store performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Orders" value="128" icon={<ShoppingBag size={24} className="text-blue-600" />} color="bg-blue-50" />
        <StatCard title="Total Products" value="45" icon={<Package size={24} className="text-yellow-600" />} color="bg-yellow-50" />
        <StatCard title="Categories" value="8" icon={<Tag size={24} className="text-pink-600" />} color="bg-pink-50" />
        <StatCard title="Customers" value="2,450" icon={<Users size={24} className="text-indigo-600" />} color="bg-indigo-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-bold text-slate-800">Quick Actions</h3>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <Link to="/admin/products" className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-yellow-400 transition-colors text-center group">
                 <Package size={32} className="mx-auto mb-3 text-slate-400 group-hover:text-yellow-500 transition-colors" />
                 <span className="font-bold text-slate-700">Manage Products</span>
               </Link>
               <Link to="/admin/categories" className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-pink-400 transition-colors text-center group">
                 <Tag size={32} className="mx-auto mb-3 text-slate-400 group-hover:text-pink-500 transition-colors" />
                 <span className="font-bold text-slate-700">Manage Categories</span>
               </Link>
               <Link to="/admin/orders" className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-blue-400 transition-colors text-center group">
                 <ShoppingBag size={32} className="mx-auto mb-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                 <span className="font-bold text-slate-700">View Orders</span>
               </Link>
             </div>
           </div>
        </div>

        <div>
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-green-500" /> Recent Sales
            </h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">Order #10{i}</p>
                    <p className="text-xs text-slate-400">2 mins ago</p>
                  </div>
                  <span className="text-green-600 font-bold text-sm">+$45.00</span>
                </div>
              ))}
            </div>
            <Link to="/admin/orders" className="block w-full text-center mt-6 text-pink-500 font-bold text-sm hover:underline">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
