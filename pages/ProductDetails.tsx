import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft, ShieldCheck, RefreshCcw, Info, Package, AlertTriangle } from 'lucide-react';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await productService.getOne(id);
        // Ensure data is valid before setting state
        if (data) {
          setProduct(data);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-bold">Loading Toy Details...</p>
    </div>
  );
  
  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="bg-red-50 inline-block p-6 rounded-full mb-6">
        <AlertTriangle size={48} className="text-red-500" />
      </div>
      <h2 className="text-3xl font-bold text-slate-800">Toy Not Found</h2>
      <p className="text-slate-500 mt-2 mb-8">We couldn't find the product you're looking for.</p>
      <Link to="/products" className="bg-yellow-400 text-white px-8 py-3 rounded-full font-bold hover:bg-yellow-500 transition-all">
        Back to Store
      </Link>
    </div>
  );

  // Safety check for image and price
  const displayImage = product.image_url || `https://loremflickr.com/400/400/toy,baby?lock=${product.id}`;
  const displayPrice = Number(product.price || 0).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-500 hover:text-yellow-500 font-bold mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Products
      </Link>

      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl p-8 shadow-sm border border-slate-50">
          <div className="rounded-2xl overflow-hidden aspect-square bg-slate-50">
            <img 
              src={displayImage} 
              alt={product.name} 
              className="w-full h-full object-cover" 
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/400/400'; }}
            />
          </div>

          <div className="space-y-8">
            <div>
              <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase mb-4 tracking-wider">
                Category: {product.category?.name || 'Top Choice'}
              </div>
              <h1 className="text-4xl font-extrabold text-slate-800 mb-2">{product.name}</h1>
              <p className="text-pink-500 text-3xl font-bold">${displayPrice}</p>
            </div>

            <p className="text-slate-600 text-lg leading-relaxed">
              {product.description || "No description available for this wonderful toy."}
            </p>

            <div className="flex items-center gap-6">
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold"
                >
                  -
                </button>
                <span className="px-6 py-2 font-bold text-slate-800">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold"
                >
                  +
                </button>
              </div>
              
              <button 
                onClick={() => addToCart(product, quantity)}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-yellow-200"
              >
                <ShoppingCart size={22} /> Add to Cart
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-8">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                <ShieldCheck className="text-green-500" /> BPA Free & Safe
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                <RefreshCcw className="text-blue-500" /> 30-Day Returns
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-50">
              <div className="flex items-center gap-2 mb-6">
                <Info className="text-blue-500" size={24} />
                <h3 className="text-2xl font-bold text-slate-800">Product Description</h3>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
                <p>
                  The {product.name} has been meticulously crafted to ensure both safety and fun for your baby. 
                  Designed with early developmental milestones in mind, this toy encourages exploration and curiosity. 
                  Every material used has been tested to meet the highest international safety standards for infants and toddlers.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <Package size={18} className="text-yellow-500" /> Key Features
                    </h4>
                    <ul className="text-sm list-disc list-inside space-y-2">
                      <li>Ergonomic design for small hands</li>
                      <li>Vibrant colors to stimulate vision</li>
                      <li>Durable construction for long-term play</li>
                      <li>Easy to clean and maintain</li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <AlertTriangle size={18} className="text-pink-500" /> Safety Notes
                    </h4>
                    <p className="text-sm">
                      Recommended for ages 6 months and up. Always use under adult supervision. 
                      Free from lead, phthalates, and other harmful chemicals.
                    </p>
                  </div>
                </div>
              </div>
           </div>

           <div className="space-y-8">
             <div className="bg-pink-50 rounded-3xl p-8 border border-pink-100">
               <h4 className="text-xl font-bold text-pink-600 mb-4">Why choose us?</h4>
               <ul className="space-y-4">
                 <li className="flex items-start gap-3">
                   <div className="p-1 bg-pink-500 rounded-full mt-1"></div>
                   <p className="text-sm text-pink-700 font-medium">Eco-friendly packaging and sustainable materials.</p>
                 </li>
                 <li className="flex items-start gap-3">
                   <div className="p-1 bg-pink-500 rounded-full mt-1"></div>
                   <p className="text-sm text-pink-700 font-medium">Expertly curated by early childhood educators.</p>
                 </li>
                 <li className="flex items-start gap-3">
                   <div className="p-1 bg-pink-500 rounded-full mt-1"></div>
                   <p className="text-sm text-pink-700 font-medium">Thousands of happy parents and smiling babies.</p>
                 </li>
               </ul>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;