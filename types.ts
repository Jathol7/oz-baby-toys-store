export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  sub_categories?: SubCategory[]; // For the categories tree
}

export interface SubCategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  products?: Product[]; // Nested products
}

export interface Product {
  id: number;
  name: string;
  slug: string; // Used for fetching details
  price: number;
  description: string;
  image: string | null; // Backend uses "image", not "image_url"
  sub_category_id: number; // Linked to SubCategory
  sub_category?: SubCategory;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  items?: OrderItem[];
  user?: User;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}