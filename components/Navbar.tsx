import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { UserRole } from '../types';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // We await the fixed logout sequence
      await logout();
      setIsOpen(false);
      // 'replace: true' prevents the user from clicking "Back" into the session
      navigate('/login', { replace: true });
    } catch (err) {
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
                OZ Baby Toys
              </span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <Link to="/" className="text-slate-600 hover:text-yellow-500 font-medium transition-colors">Home</Link>
              <Link to="/products" className="text-slate-600 hover:text-yellow-500 font-medium transition-colors">Products</Link>
              {user?.role === UserRole.ADMIN && (
                <Link to="/admin" className="text-pink-600 hover:text-pink-700 font-semibold transition-colors flex items-center gap-1">
                  <LayoutDashboard size={18} /> Admin Panel
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/cart" className="relative text-slate-600 hover:text-yellow-500 transition-colors">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ring-2 ring-white">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500 font-medium">Hello, {user?.name}</span>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-1 text-slate-600 hover:text-yellow-500 transition-colors">
                <User size={20} />
                <span className="font-medium">Login</span>
              </Link>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-slate-900 focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4 space-y-4 shadow-lg">
          <Link to="/" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-700">Home</Link>
          <Link to="/products" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-700">Products</Link>
          {user?.role === UserRole.ADMIN && (
             <Link to="/admin" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-pink-600">Admin Panel</Link>
          )}
          <Link to="/cart" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-700">
            Cart ({totalItems})
          </Link>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="block w-full text-left text-lg font-medium text-red-500">Logout</button>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-blue-500">Login / Register</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;