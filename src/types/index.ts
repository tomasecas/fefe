export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'tortas' | 'cupcakes' | 'postres' | 'panes' | 'otros';
  image_url: string;
  available: boolean;
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  image_url: string;
  icon: string;
  active: boolean;
  display_order: number;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'pending' | 'read' | 'replied';
  created_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_date?: string;
  delivery_address?: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  notes?: string;
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
}