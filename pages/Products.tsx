import React, { useEffect, useState } from 'react';
import { productService, categoryService } from '../services/api';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import { Filter, Search, ChevronRight, ChevronDown } from 'lucide-react';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSubCatId, setSelectedSubCatId] = useState<number | null>(null);
  const [openCategory, setOpenCategory] = useState<number | null>(null); // Track expanded accordion
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getAll(selectedSubCatId || undefined, searchQuery);
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    const timeoutId = setTimeout(loadProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedSubCatId, searchQuery]);

  // Toggle Accordion Function
  const toggleCategory = (id: number) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Accordion */}
        <aside className="w-full md:w-64 space-y-4">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Filter size={20} className="text-pink-500" /> Shop by Category
          </h3>
          
          <div className="space-y-2">
            {/* All Toys Button */}
            <button
              onClick={() => {
                setSelectedSubCatId(null);
                setOpenCategory(null);
              }}
              className={`w-full text-left px-4 py-3 rounded-2xl transition-all ${
                selectedSubCatId === null ? 'bg-yellow-400 text-white font-bold shadow-md' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Toys
            </button>

            {/* Main Categories Tree */}
            {categories.map(cat => {
              const isOpen = openCategory === cat.id;
              
              return (
                <div key={cat.id} className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                  {/* Header: Click to Open/Close */}
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${
                      isOpen ? 'bg-slate-50 text-pink-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </button>

                  {/* Body: Sub-Categories (Wrapped/Collapsed) */}
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-96 opacity-100 py-2' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {cat.sub_categories && cat.sub_categories.length > 0 ? (
                      cat.sub_categories.map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => setSelectedSubCatId(sub.id)}
                          className={`w-full text-left px-8 py-2 text-sm transition-colors flex items-center gap-2 ${
                            selectedSubCatId === sub.id 
                            ? 'text-pink-600 font-bold' 
                            : 'text-slate-500 hover:text-pink-400'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${selectedSubCatId === sub.id ? 'bg-pink-500' : 'bg-slate-200'}`} />
                          {sub.name}
                        </button>
                      ))
                    ) : (
                      <p className="px-8 py-2 text-xs text-slate-400 italic">No subcategories</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="flex-1">
          {/* ... (Keep the rest of your Main Grid code same as previous) ... */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-extrabold text-slate-800">
              {searchQuery ? `Results for "${searchQuery}"` : 'Our Collection'}
            </h2>
            
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                placeholder="Search toys..." 
                className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1,2,3].map(n => <div key={n} className="bg-slate-100 animate-pulse rounded-3xl h-80" />)}
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;