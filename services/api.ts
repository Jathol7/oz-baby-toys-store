import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor to add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- MOCK DATA (Fallback only) ---
const MOCK_CATEGORIES = [
  { id: 1, name: 'Soft Toys', slug: 'soft-toys' },
  { id: 2, name: 'Educational', slug: 'educational' },
  { id: 3, name: 'Puzzles', slug: 'puzzles' },
  { id: 4, name: 'Outdoor', slug: 'outdoor' },
];

const MOCK_PRODUCTS = [
  { id: 1, name: 'Teddy Bear', slug: 'teddy-bear', price: 25.99, category_id: 1, stock_quantity: 10, image_url: 'https://picsum.photos/seed/teddy/400/400', description: 'A cuddly soft bear.' },
  { id: 2, name: 'Abacus', slug: 'abacus', price: 15.50, category_id: 2, stock_quantity: 5, image_url: 'https://picsum.photos/seed/abacus/400/400', description: 'Wooden math tool.' },
];

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to "fix" product data from backend (adds images & ensures price is a number)
const transformProduct = (product: any) => ({
  ...product,
  // If backend has no image, we generate a high-quality toy image based on its ID
  image_url: product.image_url || `https://loremflickr.com/400/400/toy,baby?lock=${product.id}`,
  // Force price to be a number so .toFixed() never crashes
  price: Number(product.price || 0)
});

// --- SERVICES ---

export const productService = {
  // Use 'sub_category_id' and 'search' as per your API
  getAll: async (subCategoryId?: number, searchTerm?: string) => {
    try {
      const response = await api.get('/products', { 
        params: { 
          sub_category_id: subCategoryId, 
          search: searchTerm,
          per_page: 12 
        } 
      });
      // Backend uses {"data": [...]}
      const rawData = response.data?.data || [];
      return rawData.map((p: any) => transformProduct(p));
    } catch (e) {
      console.error("Fetch products failed", e);
      return [];
    }
  },

  // Single Product uses SLUG now, not ID
  getOne: async (slug: string) => {
    try {
      const response = await api.get(`/products/${slug}`);
      const p = response.data?.data || response.data;
      return transformProduct(p);
    } catch (e) {
      console.error("Fetch product detail failed", e);
      return null;
    }
  },

  // Admin section: Products list
  getAdminProducts: () => api.get('/admin/products?per_page=12'),
  
  // Create must use FormData for images
  create: (formData: FormData) => api.post('/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const categoryService = {
  // Products.tsx expects "getAll", so we provide it here
  // It calls your real backend endpoint with the required parameters
  getAll: async () => {
    try {
      const response = await api.get('/categories?with_products=true&per_page=10');
      // Reach into the "data" key as per your backend structure
      return response.data?.data || response.data || [];
    } catch (e) {
      console.error("Failed to load categories tree", e);
      return [];
    }
  },
  
  // Admin Category Management
  getAdminCategories: () => api.get('/admin/categories?per_page=10'),
  addAdminCategory: (data: {name: string, is_active: boolean}) => api.post('/admin/categories', data),
  deleteAdminCategory: (id: number) => api.delete(`/admin/categories/${id}`),
};
export const authService = {
  login: (credentials: any) => api.post('/login', credentials),
  // Register now includes password_confirmation
  register: (data: any) => api.post('/register', data),
  logout: () => api.post('/logout'),
  getUserProfile: () => api.get('/user'), // For profile check
};
export const orderService = {
  placeOrder: (data: any) => api.post('/orders', data),
  getUserOrders: () => api.get('/orders'),
  getAllOrders: async () => {
     try {
       const response = await api.get('/admin/orders');
       return Array.isArray(response.data) ? response.data : (response.data?.orders || []);
     } catch(e) {
       return [];
     }
  },
  updateStatus: (id: number, status: string) => api.patch(`/orders/${id}/status`, { status }),
};

export default api;