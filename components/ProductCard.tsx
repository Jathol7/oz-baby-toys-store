import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  // Handle image mapping: your backend uses 'image', frontend expects 'image_url'
  const displayImage = product.image_url || (product as any).image || `https://loremflickr.com/400/400/toy,baby?lock=${product.id}`;
  
  // Safety price formatting
  const displayPrice = Number(product.price || 0).toFixed(2);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-slate-50">
      <div className="relative overflow-hidden aspect-square">
        <img 
          src={displayImage} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/400/400'; }}
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* CRITICAL CHANGE: Navigate using SLUG for the detail page */}
        <Link 
          to={`/products/${product.slug}`}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur text-slate-700 px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0"
        >
          <Eye size={16} /> Quick View
        </Link>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{product.name}</h3>
          <span className="text-pink-500 font-bold text-lg">${displayPrice}</span>
        </div>
        
        <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
          {product.description || "Exciting new toy for early development."}
        </p>
        
        <button 
          onClick={() => addToCart(product)}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-sm"
        >
          <ShoppingCart size={18} /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;