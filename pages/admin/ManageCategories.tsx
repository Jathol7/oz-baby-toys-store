
import React, { useEffect, useState } from 'react';
import { categoryService } from '../../services/api';
import { Category } from '../../types';
import { Plus, Edit, Trash2, Tag, X } from 'lucide-react';

const ManageCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });

  const loadCategories = async () => {
    setLoading(true);
    const data = await categoryService.getAll();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => { loadCategories(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      await categoryService.update(editingCategory.id, formData);
    } else {
      await categoryService.create(formData);
    }
    setShowModal(false);
    setEditingCategory(null);
    loadCategories();
  };

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, slug: cat.slug });
    setShowModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
          <Tag className="text-pink-500" /> Manage Categories
        </h1>
        <button 
          onClick={() => { setEditingCategory(null); setFormData({name:'', slug:''}); setShowModal(true); }}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-pink-100"
        >
          <Plus size={20} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading categories...</div>
          ) : categories.map(cat => (
            <div key={cat.id} className="p-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
              <div>
                <h4 className="text-lg font-bold text-slate-800">{cat.name}</h4>
                <p className="text-slate-400 text-sm">/{cat.slug}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(cat)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit size={20} />
                </button>
                <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Category Name</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-3 rounded-xl border border-slate-200"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">URL Slug</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50"
                  value={formData.slug}
                  readOnly
                />
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 text-slate-500 font-bold">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-lg">
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
