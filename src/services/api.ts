import { Product, Category, Friend, Order, ContactMessage } from '../types';

const BASE_URL = '/api';

export const api = {
  // Products
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${BASE_URL}/products`);
    if (!res.ok) throw new Error('Error al obtener productos');
    return res.json();
  },

  async saveProduct(product: Product): Promise<{ success: boolean; product: Product }> {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Error al guardar el producto');
    return res.json();
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar el producto');
    return res.json();
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${BASE_URL}/categories`);
    if (!res.ok) throw new Error('Error al obtener categorías');
    return res.json();
  },

  async saveCategory(category: Category): Promise<{ success: boolean; category: Category }> {
    const res = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
    if (!res.ok) throw new Error('Error al guardar la categoría');
    return res.json();
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/categories/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar la categoría');
    return res.json();
  },

  // Friends / Cofradía
  async getFriends(): Promise<Friend[]> {
    const res = await fetch(`${BASE_URL}/friends`);
    if (!res.ok) throw new Error('Error al obtener amigos de la Cofradía');
    return res.json();
  },

  async joinCofradia(name: string, whatsapp: string, email?: string, address?: string, city?: string, provincia?: string, cp?: string): Promise<{ success: boolean; friend: Friend; message?: string }> {
    const res = await fetch(`${BASE_URL}/friends`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, whatsapp, email, address, city, provincia, cp })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Error al unirse a la Cofradía');
    }
    return res.json();
  },

  async loginFriend(whatsapp: string): Promise<{ success: boolean; friend?: Friend; notFound?: boolean; input?: string; error?: string }> {
    const res = await fetch(`${BASE_URL}/friends/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ whatsapp })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        notFound: errData.notFound,
        input: errData.input || whatsapp,
        error: errData.error || 'Error al iniciar sesión'
      };
    }
    const data = await res.json();
    return { success: true, friend: data.friend };
  },

  async updateFriendProfile(friend: Friend): Promise<{ success: boolean; friend: Friend }> {
    const res = await fetch(`${BASE_URL}/friends/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(friend)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'No se pudo actualizar tus datos de la Cofradía');
    }
    return res.json();
  },

  async adminUpdateFriend(id: string, points: number, isMayorista: boolean, isAdmin?: boolean): Promise<{ success: boolean; friend: Friend }> {
    const res = await fetch(`${BASE_URL}/friends/${id}/admin-update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points, isMayorista, isAdmin })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'No se pudo procesar la actualización del amigo');
    }
    return res.json();
  },

  async adminBulkPrice(category: string, provider: string, percentChange: number, operator: "multiply" | "add"): Promise<{ success: boolean; count: number; message: string }> {
    const res = await fetch(`${BASE_URL}/admin/bulk-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, provider, percentChange, operator })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Error al procesar actualización masiva de precios');
    }
    return res.json();
  },

  async deleteFriend(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/friends/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar el amigo de la Cofradía');
    return res.json();
  },

  async downloadBackup(): Promise<any> {
    const res = await fetch(`${BASE_URL}/admin/backup`);
    if (!res.ok) throw new Error('Error al generar la copia de seguridad');
    return res.json();
  },

  async restoreBackup(data: any): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/admin/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Error al restaurar copia de seguridad');
    }
    return res.json();
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${BASE_URL}/orders`);
    if (!res.ok) throw new Error('Error al obtener pedidos');
    return res.json();
  },

  async createOrder(orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<{ success: boolean; order: Order }> {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error('Error al crear el pedido');
    return res.json();
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<{ success: boolean; order: Order }> {
    const res = await fetch(`${BASE_URL}/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Error al actualizar el estado del pedido');
    return res.json();
  },

  async deleteOrder(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/orders/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar el pedido');
    return res.json();
  },

  // Contact Messages
  async getMessages(): Promise<ContactMessage[]> {
    const res = await fetch(`${BASE_URL}/messages`);
    if (!res.ok) throw new Error('Error al obtener los mensajes');
    return res.json();
  },

  async submitMessage(name: string, email: string, subject: string, message: string): Promise<{ success: boolean; message: ContactMessage }> {
    const res = await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    });
    if (!res.ok) throw new Error('Error al enviar el mensaje');
    return res.json();
  },

  async deleteMessage(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/messages/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar el mensaje');
    return res.json();
  }
};
