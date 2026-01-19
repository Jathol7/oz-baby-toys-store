import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Truck, ShieldCheck, Zap } from 'lucide-react';

const Home: React.FC = () => {
  // Always initialize as an empty array []
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getAll();
        
        // Defensive check: Ensure data exists and is an array before slicing
        if (data && Array.isArray(data)) {
          setFeaturedProducts(data.slice(0, 4));
        } else {
          console.error("API did not return an array:", data);
          setFeaturedProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/babytoys/1920/1080" 
            className="w-full h-full object-cover brightness-75"
            alt="Hero background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Best Toys for Your <span className="text-yellow-400">Little Wonders</span>
            </h1>
            <p className="text-xl text-slate-100 mb-8 font-medium">
              Discover a world of imagination and learning with our curated collection of safe, fun, and educational baby toys.
            </p>
            <div className="flex gap-4">
              <Link to="/products" className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-8 py-4 rounded-full text-lg transition-all flex items-center gap-2">
                Shop Now <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Truck className="text-blue-500" />, title: 'Free Delivery', desc: 'On orders over $50' },
            { icon: <ShieldCheck className="text-pink-500" />, title: 'Safe & Non-Toxic', desc: '100% Baby-friendly materials' },
            { icon: <Zap className="text-yellow-500" />, title: 'Fast Support', desc: '24/7 dedicated help desk' },
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-50 flex items-center gap-6">
              <div className="p-4 bg-slate-50 rounded-xl">{feature.icon}</div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">{feature.title}</h3>
                <p className="text-slate-500">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Popular Toys</h2>
            <p className="text-slate-500">Hand-picked favorites for our youngest explorers</p>
          </div>
          <Link to="/products" className="text-pink-500 font-bold flex items-center gap-1 hover:gap-2 transition-all">
            View All Products <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(n => (
              <div key={n} className="bg-slate-200 animate-pulse rounded-2xl aspect-square" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-slate-500">
                No featured products available at the moment.
              </div>
            )}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-blue-500 rounded-3xl p-12 relative overflow-hidden flex items-center flex-col md:flex-row gap-10">
          <div className="relative z-10 md:w-1/2">
            <h2 className="text-4xl font-extrabold text-white mb-4">Join Our Baby Club!</h2>
            <p className="text-blue-100 text-lg mb-6">
              Sign up today and get 20% off your first order. Plus, receive exclusive monthly toy recommendations.
            </p>
            <Link to="/register" className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors">
              Get Started Now
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img src="https://picsum.photos/seed/gift/500/300" alt="Club gift" className="rounded-2xl shadow-2xl rotate-2" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;