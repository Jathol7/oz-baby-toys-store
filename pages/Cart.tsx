
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-50 flex flex-col items-center">
          <ShoppingBag size={80} className="text-slate-200 mb-6" />
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Your cart is empty</h2>
          <p className="text-slate-500 mb-8 text-lg">Looks like you haven't added any toys to your cart yet.</p>
          <Link to="/products" className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-8 py-3 rounded-full transition-colors">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-slate-800 mb-10">Shopping Cart ({totalItems})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50 flex gap-6 items-center">
              <img src={item.image_url} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
                <p className="text-pink-500 font-bold">${Number(item.price).toFixed(2)}</p>
              </div>
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden h-10">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 bg-slate-50 font-bold text-slate-500">-</button>
                <span className="px-4 font-bold text-slate-700">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 bg-slate-50 font-bold text-slate-500">+</button>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-50">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-green-500 font-medium">Free</span>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between text-xl font-extrabold text-slate-800">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout" className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-pink-100">
              Checkout Now <ArrowRight size={20} />
            </Link>
          </div>
          <div className="text-center">
            <Link to="/products" className="text-sm font-bold text-slate-400 hover:text-yellow-500 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
