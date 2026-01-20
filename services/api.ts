import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const transformProduct = (product: any) => ({
  ...product,
  image_url: product.image_url || product.image || `https://loremflickr.com/400/400/toy,baby?lock=${product.id}`,
  price: Number(product.price || 0)
});

export const productService = {
  getAll: async (subCategoryId?: number, searchTerm?: string) => {
    try {
      const response = await api.get('/products', { 
        params: { sub_category_id: subCategoryId, search: searchTerm, per_page: 12 } 
      });
      const rawData = response.data?.data || [];
      return rawData.map((p: any) => transformProduct(p));
    } catch (e) {
      console.error("Fetch products failed", e);
      return [];
    }
  },

  getOne: async (slug: string) => {
    try {
      const response = await api.get(`/products/${slug}`);
      const p = response.data?.data || response.data;
      return transformProduct(p);
    } catch (e) {
      return null;
    }
  },

  getAdminProducts: () => api.get('/admin/products?per_page=12'),
  
  create: (formData: FormData) => api.post('/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const categoryService = {
  getAll: async () => {
    try {
      const response = await api.get('/categories?with_products=true&per_page=10');
      // Fix: Handle nested data structure
      return response.data?.data || response.data || [];
    } catch (e) {
      return [];
    }
  },
  
  // Admin Methods
  getAdminCategories: async () => {
    const response = await api.get('/admin/categories?per_page=10');
    return response.data?.data || response.data || [];
  },

  create: (data: {name: string, is_active?: boolean}) => 
    api.post('/admin/categories', { ...data, is_active: true }),

  update: (id: number, data: {name: string, is_active?: boolean}) => 
    api.put(`/admin/categories/${id}`, data),

  delete: (id: number) => 
    api.delete(`/admin/categories/${id}`),
};

export const authService = {
  login: (credentials: any) => api.post('/login', credentials),
  register: (data: any) => api.post('/register', data),
  logout: async () => {
    try {
      return await api.post('/logout');
    } catch (error: any) {
      if (error.response?.status === 401) {
        return Promise.resolve({ data: { message: 'Logged out' } });
      }
      throw error;
    }
  },
  getUserProfile: () => api.get('/user'),
};

export const orderService = {
  placeOrder: async (orderData: any) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const existingOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
    const newOrder = {
      ...orderData,
      id: Math.floor(Math.random() * 10000),
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    existingOrders.push(newOrder);
    localStorage.setItem('mock_orders', JSON.stringify(existingOrders));
    return { success: true, data: newOrder };
  },

  getUserOrders: async () => JSON.parse(localStorage.getItem('mock_orders') || '[]'),
  getAllOrders: async () => JSON.parse(localStorage.getItem('mock_orders') || '[]'),

  updateStatus: async (id: number, status: string) => {
    const orders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
    const updated = orders.map((o: any) => o.id === id ? { ...o, status } : o);
    localStorage.setItem('mock_orders', JSON.stringify(updated));
    return { success: true };
  }
};

export default api;