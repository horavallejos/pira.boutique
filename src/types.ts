export interface TechnicalSpec {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  thumbnails?: string[];
  stockStatus: 'InStock' | 'LowStock' | 'OutOfStock';
  tag?: string; // e.g. "PRECIO AMIGO", "Nuevo", "Sin Stock", "Elección Pro-Staff"
  modelOptions?: string[]; // e.g., ["7.1:1 (Derecho)", "7.1:1 (Zurdo)", "8.1:1 (Derecho)"]
  rating?: number;
  reviewCount?: number;
  specs?: TechnicalSpec[];
}

export interface Category {
  id: string;
  name: string; // e.g., "Anzuelos", "Cañas", "Señuelos", "Reeles", "Camping", "Accesorios"
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedModel?: string;
}

export interface Friend {
  id: string;
  name: string;
  whatsapp: string;
  createdAt: string;
  isMayorista?: boolean; // Wholesale / PRO status
  points?: number;       // Current Cofradía point balance
  email?: string;        // Optional email
  address?: string;      // Physical delivery address
  city?: string;         // City
  provincia?: string;    // Province
  cp?: string;           // Postal code
  isAdmin?: boolean;     // Admin status flag
}

export interface Order {
  id: string;
  customerName: string;
  customerWhatsapp: string;
  customerEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingProvincia: string;
  shippingCp: string;
  shippingNotes?: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    selectedModel?: string;
  }[];
  subtotal: number;
  shippingPrice: number;
  total: number;
  status: 'Pendiente' | 'En Tránsito' | 'Entregado' | 'Cancelado';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}
