import React, { useState, useEffect } from 'react';
import { 
  BarChart3, ShoppingCart, UserCheck, Inbox, Plus, Edit2, Trash2, 
  Save, X, FolderMinus, MessageSquare, CheckCircle, PackageCheck, Send 
} from 'lucide-react';
import { Product, Category, Friend, Order, ContactMessage } from '../types';
import { api } from '../services/api';

interface AdminPanelProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  friends: Friend[];
  messages: ContactMessage[];
  onRefreshData: () => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  categories,
  orders,
  friends,
  messages,
  onRefreshData,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'products' | 'categories' | 'cofradia' | 'messages' | 'stats' | 'backups'>('orders');
  
  // Product state management Form
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    id: '', name: '', description: '', price: 0, originalPrice: 0, 
    category: '', image: '', stockStatus: 'InStock', tag: 'PRECIO AMIGO'
  });

  // Category state management Form
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState<Partial<Category>>({
    id: '', name: ''
  });

  const [notification, setNotification] = useState('');

  // Bulk price and database backup operations states
  const [bulkCategory, setBulkCategory] = useState('all');
  const [bulkProvider, setBulkProvider] = useState('');
  const [bulkPercent, setBulkPercent] = useState(10);
  const [bulkIsUpdating, setBulkIsUpdating] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Auto trigger notification resets
  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  // Metrics
  const totalSalesVolume = orders
    .filter(o => o.status === 'Entregado')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'Pendiente').length;

  // Products handlers
  const handleOpenProductCreate = () => {
    setProductForm({
      id: '', name: '', description: '', price: 0, originalPrice: 0, 
      category: categories[0]?.id || 'reeles', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVWfEsjcgm17AL0KTFvu3AD-PGSCL526WhnT9sHjQXxY67Is25BQ2LGhq_WsV5ZRwKIiZ6lAEuuA6OsTb06ltkm_0rBH39jXqQDdAvVa1o-JIGfVDu3NQ71aa4hOW3m2r-1YkXj9XHQKQ9uwTdw5xt7eZmvN3zcl6qB9APY4z03FbnLHevW_8jQrTsIQ1vVqNLps9s338yYBfVf9wn_061WslANK8gHZ1WeMOaPxaDu0LLvb5kWMIjXWbRiXL7xoB-UWmoMj2foL8', 
      stockStatus: 'InStock', tag: 'PRECIO AMIGO'
    });
    setIsEditingProduct(true);
  };

  const handleOpenProductEdit = (p: Product) => {
    setProductForm({ ...p });
    setIsEditingProduct(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.category) {
      alert('Por favor, completá los campos mínimos requeridos.');
      return;
    }

    try {
      await api.saveProduct(productForm as Product);
      setIsEditingProduct(false);
      await onRefreshData();
      showNotice('¡Producto guardado exitosamente!');
    } catch (err) {
      alert('Error al guardar el producto.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de que querés eliminar el producto del catálogo?')) return;
    try {
      await api.deleteProduct(id);
      await onRefreshData();
      showNotice('Producto eliminado del catálogo.');
    } catch (err) {
      alert('Error al eliminar producto.');
    }
  };

  // Categories handlers
  const handleOpenCategoryCreate = () => {
    setCategoryForm({ id: '', name: '' });
    setIsEditingCategory(true);
  };

  const handleOpenCategoryEdit = (c: Category) => {
    setCategoryForm({ ...c });
    setIsEditingCategory(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) {
      alert('Completá el nombre.');
      return;
    }

    try {
      // Create slug id from name
      if (!categoryForm.id) {
        categoryForm.id = categoryForm.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_");
      }
      await api.saveCategory(categoryForm as Category);
      setIsEditingCategory(false);
      await onRefreshData();
      showNotice('¡Categoría guardada exitosamente!');
    } catch (err) {
      alert('Error al guardar la categoría.');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('¿Estás seguro de que querés eliminar la categoría? Esto modificará los filtros.')) return;
    try {
      await api.deleteCategory(id);
      await onRefreshData();
      showNotice('Categoría removida.');
    } catch (err) {
      alert('Error al eliminar categoría.');
    }
  };

  // Orders handlers
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await api.updateOrderStatus(orderId, status);
      await onRefreshData();
      showNotice(`Pedido ${orderId} actualizado a ${status}.`);
    } catch (err) {
      alert('Error al actualizar estado del pedido.');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('¿Estás seguro de que querés eliminar este pedido de los registros históricos?')) return;
    try {
      await api.deleteOrder(orderId);
      await onRefreshData();
      showNotice('Pedido eliminado.');
    } catch (err) {
      alert('Error al eliminar pedido.');
    }
  };

  // Friends handlers
  const handleDeleteFriend = async (id: string) => {
    if (!confirm('¿Seguro quieres dar de baja a este miembro de la Cofradía?')) return;
    try {
      await api.deleteFriend(id);
      await onRefreshData();
      showNotice('Miembro eliminado.');
    } catch (err) {
      alert('Error al dar de baja al miembro.');
    }
  };

  const handleToggleAdminStatus = async (f: Friend) => {
    try {
      await api.adminUpdateFriend(f.id, f.points || 0, !!f.isMayorista, !f.isAdmin);
      await onRefreshData();
      showNotice(`¡Permisos de Admin actualizados para ${f.name}!`);
    } catch (err: any) {
      alert(err.message || 'Error al actualizar permisos de admin.');
    }
  };

  const handleToggleMayoristaStatus = async (f: Friend) => {
    try {
      await api.adminUpdateFriend(f.id, f.points || 0, !f.isMayorista, !!f.isAdmin);
      await onRefreshData();
      showNotice(`¡Nivel Mayorista de Elite actualizado para ${f.name}!`);
    } catch (err: any) {
      alert(err.message || 'Error al actualizar nivel mayorista.');
    }
  };

  const handleAdjustPoints = async (f: Friend, incrementalValue: number) => {
    try {
      const currentPts = f.points || 0;
      const nextPts = Math.max(0, currentPts + incrementalValue);
      await api.adminUpdateFriend(f.id, nextPts, !!f.isMayorista, !!f.isAdmin);
      await onRefreshData();
      showNotice(`Puntos de ${f.name} ajustados a ${nextPts}.`);
    } catch (err: any) {
      alert(err.message || 'Error al ajustar puntos.');
    }
  };

  // Messages handlers
  const handleDeleteMessage = async (id: string) => {
    if (!confirm('¿Quieres descartar esta consulta?')) return;
    try {
      await api.deleteMessage(id);
      await onRefreshData();
      showNotice('Consulta descartada.');
    } catch (err) {
      alert('Error al eliminar mensaje.');
    }
  };

  return (
    <div className="space-y-6" id="admin-panel-viewport">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-surface-container border border-outline-variant p-6 rounded-3xl gap-4">
        <div>
          <h2 className="font-display font-black text-xl md:text-2xl text-on-surface">
            Consola del Administrador ⚙️
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Gestión completa de catálogos, pedidos, pescadores de la Cofradía y consultas corporativas.
          </p>
        </div>

        {notification && (
          <div className="bg-tertiary/15 text-tertiary border border-tertiary/30 px-4 py-2 rounded-xl text-xs font-semibold animate-pulse">
            {notification}
          </div>
        )}
      </div>

      {/* Corporate Metrics grids */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="admin-metrics-row">
        
        {/* Total revenue */}
        <div className="bg-surface-container-low border border-outline-variant/65 p-4 rounded-2xl flex items-center space-x-3.5">
          <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Caja Entregada</p>
            <h3 className="font-display font-black text-sm sm:text-base text-primary">
              ${totalSalesVolume.toLocaleString('es-AR')}
            </h3>
          </div>
        </div>

        {/* Pending Orders Count */}
        <div className="bg-surface-container-low border border-outline-variant/65 p-4 rounded-2xl flex items-center space-x-3.5">
          <div className="h-10 w-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center animate-bounce">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Pendientes</p>
            <h3 className="font-display font-black text-sm sm:text-base text-secondary">
              {pendingOrdersCount} Pedidos
            </h3>
          </div>
        </div>

        {/* Registered Friends check */}
        <div className="bg-surface-container-low border border-outline-variant/65 p-4 rounded-2xl flex items-center space-x-3.5">
          <div className="h-10 w-10 bg-tertiary/10 text-tertiary rounded-xl flex items-center justify-center">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Cofradía</p>
            <h3 className="font-display font-black text-sm sm:text-base text-on-surface">
              {friends.length} Amigos
            </h3>
          </div>
        </div>

        {/* General Messages indicators */}
        <div className="bg-surface-container-low border border-outline-variant/65 p-4 rounded-2xl flex items-center space-x-3.5">
          <div className="h-10 w-10 bg-outline/10 text-on-surface rounded-xl flex items-center justify-center">
            <Inbox className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Mensajes</p>
            <h3 className="font-display font-black text-sm sm:text-base text-on-surface">
              {messages.length} Consultas
            </h3>
          </div>
        </div>
      </div>

      {/* Sub tabs layout buttons */}
      <div className="border-b border-outline-variant flex overflow-x-auto no-scrollbar" id="admin-subtabs">
        <button
          onClick={() => { setActiveSubTab('orders'); setIsEditingProduct(false); setIsEditingCategory(false); }}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 flex-shrink-0 ${
            activeSubTab === 'orders' 
              ? 'border-primary text-primary bg-primary/5' 
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Pedidos de Clientes ({orders.length})
        </button>
        <button
          onClick={() => { setActiveSubTab('products'); setIsEditingProduct(false); setIsEditingCategory(false); }}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 flex-shrink-0 ${
            activeSubTab === 'products' 
              ? 'border-primary text-primary bg-primary/5' 
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Editar Catálogo ({products.length})
        </button>
        <button
          onClick={() => { setActiveSubTab('categories'); setIsEditingProduct(false); setIsEditingCategory(false); }}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 flex-shrink-0 ${
            activeSubTab === 'categories' 
              ? 'border-primary text-primary bg-primary/5' 
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Categorías ({categories.length})
        </button>
        <button
          onClick={() => { setActiveSubTab('cofradia'); setIsEditingProduct(false); setIsEditingCategory(false); }}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 flex-shrink-0 ${
            activeSubTab === 'cofradia' 
              ? 'border-primary text-primary bg-primary/5' 
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Club Cofradía ({friends.length})
        </button>
        <button
          onClick={() => { setActiveSubTab('messages'); setIsEditingProduct(false); setIsEditingCategory(false); }}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 flex-shrink-0 ${
            activeSubTab === 'messages' 
              ? 'border-primary text-primary bg-primary/5' 
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Consultas Buzón ({messages.length})
        </button>
        <button
          onClick={() => { setActiveSubTab('stats'); setIsEditingProduct(false); setIsEditingCategory(false); }}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 flex-shrink-0 ${
            activeSubTab === 'stats' 
              ? 'border-primary text-primary bg-primary/5' 
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          📈 Stats & Precios Masivos
        </button>
        <button
          onClick={() => { setActiveSubTab('backups'); setIsEditingProduct(false); setIsEditingCategory(false); }}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 flex-shrink-0 ${
            activeSubTab === 'backups' 
              ? 'border-primary text-primary bg-primary/5' 
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          💿 Copia de Seguridad
        </button>
      </div>

      {/* Main content display */}
      <div id="admin-subviewport-content">
        
        {/* Category manager sub viewport */}
        {activeSubTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-black text-sm text-on-surface">Gestión de Rubros / Categorías</h3>
              {!isEditingCategory && (
                <button
                  onClick={handleOpenCategoryCreate}
                  className="px-4 py-2 bg-primary hover:bg-primary-container text-white text-xs font-black rounded-lg flex items-center space-x-1 uppercase"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Añadir Categoría</span>
                </button>
              )}
            </div>

            {isEditingCategory ? (
              <form onSubmit={handleSaveCategory} className="border border-outline-variant bg-surface-container-low p-4 rounded-2xl max-w-md space-y-4">
                <h4 className="font-display font-bold text-xs text-primary uppercase">
                  {categoryForm.id ? 'Modificar Rubro' : 'Nuevo Rubro del Catálogo'}
                </h4>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase">Nombre de la Categoría</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name || ''}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border bg-surface-container-lowest focus:outline-primary"
                    placeholder="Ej. Anzuelos, Cañas..."
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingCategory(false)}
                    className="flex-1 py-2 border text-xs rounded-lg hover:bg-surface-container"
                  >
                    Salir
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-primary text-white font-bold text-xs rounded-lg hover:bg-primary-container"
                  >
                    Guardar Rubro
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="admin-categories-grid">
                {categories.map((c) => (
                  <div key={c.id} className="border border-outline-variant p-4 bg-surface-container-lowest rounded-xl flex justify-between items-center shadow-sm">
                    <div>
                      <h4 className="font-bold text-sm text-on-surface">{c.name}</h4>
                      <p className="text-[9px] font-mono text-on-surface-variant uppercase">{c.id}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenCategoryEdit(c)}
                        className="p-1.5 rounded bg-surface-container hover:text-primary"
                        title="Modificar"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(c.id)}
                        className="p-1.5 rounded bg-error-container/20 text-error hover:bg-error-container/40"
                        title="Remover"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Product manager sub viewport */}
        {activeSubTab === 'products' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-black text-sm text-on-surface">Editar Productos</h3>
              {!isEditingProduct && (
                <button
                  onClick={handleOpenProductCreate}
                  className="px-4 py-2 bg-primary hover:bg-primary-container text-white text-xs font-black rounded-lg flex items-center space-x-1 uppercase"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Cargar Nuevo</span>
                </button>
              )}
            </div>

            {isEditingProduct ? (
              <form onSubmit={handleSaveProduct} className="border border-outline-variant bg-surface-container-low p-6 rounded-2xl space-y-4 max-w-2xl" id="admin-product-form">
                <h4 className="font-display font-black text-xs text-primary uppercase border-b pb-2">
                  {productForm.id ? `Editar: ${productForm.name}` : 'Crear Ficha de Producto de Río'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Nombre del Producto</label>
                    <input
                      type="text"
                      required
                      value={productForm.name || ''}
                      onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full text-xs px-3 py-2 rounded-lg border bg-surface"
                      placeholder="Ej. Shimano Curado"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Categoría / Rubro</label>
                    <select
                      value={productForm.category || ''}
                      onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full text-xs px-3 py-2 rounded-lg border bg-surface"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Precio ($ ARS)</label>
                    <input
                      type="number"
                      required
                      value={productForm.price || 0}
                      onChange={(e) => setProductForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                      className="w-full text-xs px-3 py-2 rounded-lg border bg-surface"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Precio Original (Opcional - Tachado)</label>
                    <input
                      type="number"
                      value={productForm.originalPrice || 0}
                      onChange={(e) => setProductForm(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) }))}
                      className="w-full text-xs px-3 py-2 rounded-lg border bg-surface"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Enlace / URL de la Imagen</label>
                    <input
                      type="text"
                      required
                      value={productForm.image || ''}
                      onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full text-xs px-3 py-2 rounded-lg border bg-surface"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Descripción Comercial</label>
                    <textarea
                      rows={2}
                      value={productForm.description || ''}
                      onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full text-xs px-3 py-2 rounded-lg border bg-surface"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Estado de Stock</label>
                    <select
                      value={productForm.stockStatus || 'InStock'}
                      onChange={(e) => setProductForm(prev => ({ ...prev, stockStatus: e.target.value as any }))}
                      className="w-full text-xs px-3 py-2 rounded-lg border bg-surface"
                    >
                      <option value="InStock">Con Stock Comercial</option>
                      <option value="OutOfStock">Sin Stock actualmente</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Etiqueta Visual</label>
                    <input
                      type="text"
                      value={productForm.tag || ''}
                      onChange={(e) => setProductForm(prev => ({ ...prev, tag: e.target.value }))}
                      className="w-full text-xs px-3 py-2 rounded-lg border bg-surface"
                    />
                  </div>
                </div>

                <div className="flex space-x-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setIsEditingProduct(false)}
                    className="flex-1 py-2 border text-xs font-semibold rounded-lg hover:bg-surface-container"
                  >
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-primary text-white font-extrabold text-xs rounded-lg hover:bg-primary-container"
                  >
                    Confirmar Guardado
                  </button>
                </div>
              </form>
            ) : (
              <div className="overflow-x-auto border border-outline-variant rounded-2xl" id="admin-products-table">
                <table className="w-full text-left text-xs text-on-surface-variant">
                  <thead className="bg-surface-container text-[10px] font-bold uppercase text-on-surface text-center">
                    <tr>
                      <th className="p-4 text-left">Foto</th>
                      <th className="p-4 text-left">Producto</th>
                      <th className="p-4">Rubro</th>
                      <th className="p-4">Precio</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
                    {products.map((p) => {
                      const catObj = categories.find(c => c.id === p.category);
                      return (
                        <tr key={p.id} className="hover:bg-surface-container-low/40">
                          <td className="p-4">
                            <img
                              referrerPolicy="no-referrer"
                              src={p.image || undefined}
                              alt={p.name}
                              className="h-11 w-11 rounded object-cover border bg-surface-container"
                            />
                          </td>
                          <td className="p-4 max-w-[200px]">
                            <p className="font-bold text-on-surface line-clamp-1">{p.name}</p>
                            {p.tag && (
                              <span className="inline-block text-[8px] bg-primary/10 text-primary font-bold px-1.5 py-0.2 rounded mt-0.5">
                                {p.tag}
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center font-bold text-secondary">
                            {catObj ? catObj.name : p.category}
                          </td>
                          <td className="p-4 text-center font-black text-on-surface font-mono">
                            ${p.price.toLocaleString('es-AR')}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                              p.stockStatus === 'InStock' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {p.stockStatus === 'InStock' ? 'Activo' : 'Sin Stock'}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center space-x-1.5">
                              <button
                                onClick={() => handleOpenProductEdit(p)}
                                className="p-1.5 rounded hover:bg-surface-container text-on-surface"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 rounded text-error hover:bg-error-container/20"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders managing panel Viewport */}
        {activeSubTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="font-display font-black text-sm text-on-surface">Panel de Control de Despachos</h3>
            
            <div className="space-y-4" id="admin-orders-scroller">
              {orders.length === 0 ? (
                <p className="text-xs text-on-surface-variant italic p-4 text-center">No hay pedidos registrados en el sistema.</p>
              ) : (
                orders.map((o) => (
                  <div key={o.id} className="border border-outline-variant bg-surface-container-lowest p-5 rounded-2xl space-y-4 shadow-sm">
                    {/* Header bar */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b/60 pb-3">
                      <div>
                        <h4 className="font-display font-black text-xs text-primary uppercase">
                          Pedido de Ventas {o.id}
                        </h4>
                        <p className="text-[10px] text-on-surface-variant font-medium">
                          Ingresado: {new Date(o.createdAt).toLocaleDateString()} a las {new Date(o.createdAt).toLocaleTimeString()}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-bold text-on-surface-variant">Estado:</span>
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                          className={`text-[11px] font-extrabold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                            o.status === 'Pendiente' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                            o.status === 'En Tránsito' ? 'bg-sky-100 text-sky-850 border-sky-300' :
                            o.status === 'Entregado' ? 'bg-emerald-100 text-emerald-850 border-emerald-300' :
                            'bg-red-100 text-red-800 border-red-350'
                          }`}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="En Tránsito">En Tránsito</option>
                          <option value="Entregado">Entregado</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </div>
                    </div>

                    {/* Particular and destination metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="space-y-0.5">
                        <p className="font-bold text-secondary uppercase text-[9px] tracking-widest">Ficha de Cliente</p>
                        <p className="font-bold text-on-surface">{o.customerName}</p>
                        <p className="text-on-surface-variant">Email: {o.customerEmail}</p>
                        <p className="text-on-surface-variant flex items-center">
                          WhatsApp: {o.customerWhatsapp}
                          <a
                            href={`https://wa.me/${o.customerWhatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-1 text-emerald-600 hover:scale-105"
                          >
                            💬
                          </a>
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <p className="font-bold text-secondary uppercase text-[9px] tracking-widest">Entrega / Dirección</p>
                        <p className="text-on-surface">{o.shippingAddress}</p>
                        <p className="text-on-surface-variant">{o.shippingCity}, {o.shippingProvincia.toUpperCase()} (CP: {o.shippingCp})</p>
                        {o.shippingNotes && (
                          <p className="text-on-surface-variant italic mt-1">"Notas: {o.shippingNotes}"</p>
                        )}
                      </div>

                      <div className="space-y-1 bg-surface-container-low p-3 rounded-xl border border-outline-variant/40">
                        <p className="font-bold text-secondary uppercase text-[9px] tracking-widest">Ítems Comprados</p>
                        <div className="space-y-1">
                          {o.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[10px]">
                              <span>{it.quantity}x {it.productName} {it.selectedModel ? `[${it.selectedModel}]` : ''}</span>
                              <span className="font-semibold">${it.price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-1 border-t flex justify-between font-bold mt-1 text-[11px]">
                          <span>Total General:</span>
                          <span className="text-primary">${o.total.toLocaleString()} ARS</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-dashed">
                      <button
                        onClick={() => handleDeleteOrder(o.id)}
                        className="text-[10px] text-error hover:bg-error-container/10 px-3 py-1 rounded transition-colors"
                      >
                        Descartar Historial
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Registered Friends check viewport */}
        {activeSubTab === 'cofradia' && (
          <div className="space-y-4">
            <h3 className="font-display font-black text-sm text-on-surface">Gabinete de Pescadores Cofradía</h3>
            
            <div className="overflow-x-auto border border-outline-variant rounded-2xl" id="admin-friends-table">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-surface-container text-[10px] font-bold uppercase text-on-surface">
                  <tr>
                    <th className="p-4">Amigo Pescador</th>
                    <th className="p-4">WhatsApp Contacto</th>
                    <th className="p-4">Puntos y Nivel de Fidelidad</th>
                    <th className="p-4 text-center">Nivel Mayorista</th>
                    <th className="p-4 text-center">Privilegio Admin</th>
                    <th className="p-4 text-center">Mensajear</th>
                    <th className="p-4 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
                  {friends.map((f) => {
                    const cleanPhone = f.whatsapp.replace(/[^0-9]/g, '');
                    const pts = f.points || 0;
                    
                    let rankLabel = "Iniciado de la Costa 🎣";
                    let rankColor = "text-on-surface-variant";
                    if (f.isMayorista || pts >= 500) {
                      rankLabel = "Mayorista de Elite 🏆";
                      rankColor = "text-amber-600 font-extrabold";
                    } else if (pts >= 200) {
                      rankLabel = "Amigo de Río 🌊";
                      rankColor = "text-primary font-bold";
                    }

                    return (
                      <tr key={f.id} className="hover:bg-surface-container-low/40">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-on-surface">{f.name}</span>
                            <span className="text-[10px] text-on-surface-variant italic">{f.email || 'Sin correo asignado'}</span>
                          </div>
                        </td>
                        <td className="p-4 text-on-surface-variant font-mono">{f.whatsapp}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex flex-col">
                              <span className="font-mono text-xs font-black">{pts} pts</span>
                              <span className={`text-[10px] uppercase tracking-wide ${rankColor}`}>{rankLabel}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleAdjustPoints(f, 10)}
                                className="h-6 w-6 rounded bg-stone-100 font-bold text-stone-700 hover:bg-stone-200"
                                title="Sumar 10 puntos"
                              >
                                +10
                              </button>
                              <button
                                onClick={() => handleAdjustPoints(f, 50)}
                                className="h-6 w-7 rounded bg-amber-100 font-bold text-amber-800 hover:bg-amber-200"
                                title="Sumar 50 puntos"
                              >
                                +50
                              </button>
                              <button
                                onClick={() => handleAdjustPoints(f, -50)}
                                disabled={pts === 0}
                                className="h-6 w-7 rounded bg-red-50 font-bold text-red-700 hover:bg-red-100 disabled:opacity-40"
                                title="Restar 50 puntos"
                              >
                                -50
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleMayoristaStatus(f)}
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                              f.isMayorista 
                                ? 'bg-amber-500 text-stone-950 font-black shadow-sm' 
                                : 'bg-stone-100 text-stone-500'
                            }`}
                          >
                            {f.isMayorista ? '🏆 Mayorista' : 'Minorista'}
                          </button>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleAdminStatus(f)}
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                              f.isAdmin 
                                ? 'bg-[#7f2225] text-white font-black shadow-sm' 
                                : 'bg-stone-150 text-stone-500'
                            }`}
                          >
                            {f.isAdmin ? '👮 Admin' : '👤 Amigo'}
                          </button>
                        </td>
                        <td className="p-4 text-center">
                          <a
                            href={`https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(f.name)}!%20Te%20escribimos%20desde%20Pirá%20Pará%20Itá%20Ibaté...`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 shadow-sm"
                          >
                            <Send className="h-4 w-4" />
                          </a>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteFriend(f.id)}
                            className="p-1 px-2.5 bg-red-100 text-error hover:bg-red-200 rounded text-[10px] font-bold"
                          >
                            Baja
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Customer contact queries messages viewport */}
        {activeSubTab === 'messages' && (
          <div className="space-y-4">
            <h3 className="font-display font-black text-sm text-on-surface">Mensajes del Buzón de Contacto</h3>
            
            <div className="grid grid-cols-1 gap-4" id="admin-messages-list">
              {messages.length === 0 ? (
                <p className="text-xs text-on-surface-variant italic p-4 text-center">Buzón vacío.</p>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className="border border-outline-variant p-5 bg-surface-container-lowest rounded-2xl space-y-3">
                    <div className="flex justify-between items-start border-b pb-2">
                      <div>
                        <h4 className="font-bold text-on-surface text-sm">{m.name}</h4>
                        <p className="text-[10px] text-on-surface-variant">{m.email} • {new Date(m.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteMessage(m.id)}
                        className="text-xs text-error bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded"
                      >
                        Remover
                      </button>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-secondary">Asunto: {m.subject}</p>
                      <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed bg-surface-container-low p-3 rounded-lg">
                        "{m.message}"
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 📈 COMPREHENSIVE ECONOMIC STATISTICS AND BULK PRICES VIEWPORT */}
        {activeSubTab === 'stats' && (
          <div className="space-y-8 animate-fade-in" id="admin-stats-viewport">
            
            {/* Massive pricing configuration widget */}
            <div className="bg-[#fdc483]/10 border border-[#fdc483]/50 p-6 rounded-3xl space-y-4 shadow-xs">
              <div className="space-y-1">
                <h4 className="font-display font-black text-sm text-[#80561f] uppercase tracking-wider">
                  ⚡ Modificación Masiva de Precios Litoral
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Actualizá los precios del catálogo entero de forma porcentual en un solo click. Podés afinar el impacto filtrando por rubros (categoría) o marcas/proveedores asociados.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-on-surface-variant uppercase text-[10px]">Filtrar por Rubro</label>
                  <select
                    value={bulkCategory}
                    onChange={(e) => setBulkCategory(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline px-2.5 py-2 rounded-xl text-xs"
                  >
                    <option value="all">Surtido Completo (Todos los Rubros)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-on-surface-variant uppercase text-[10px]">Proveedor / Marca / Palabra Clave</label>
                  <input
                    type="text"
                    value={bulkProvider}
                    onChange={(e) => setBulkProvider(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline px-2.5 py-2 rounded-xl text-xs"
                    placeholder="Ej. Shimano, Owner, Payo... (Vacío = Todo)"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-on-surface-variant uppercase text-[10px]">Porcentaje del Ajuste (%)</label>
                  <input
                    type="number"
                    value={bulkPercent}
                    onChange={(e) => setBulkPercent(Number(e.target.value))}
                    className="w-full bg-surface-container-lowest border border-outline px-2.5 py-2 rounded-xl text-xs font-mono"
                    placeholder="Ej: 10 = +10%, -15 = -15%"
                  />
                </div>
              </div>

              <div className="bg-surface-container/60 p-3 rounded-2xl border border-outline-variant border-dashed text-[11px] text-on-surface-variant flex items-center space-x-2">
                <span>🛶</span>
                <p>
                  <strong>Simulación de Impacto:</strong> Un producto de $10.000 ARS pasará a costar{' '}
                  <strong className="text-primary">${Math.round(10000 * (1 + bulkPercent / 100)).toLocaleString('es-AR')} ARS</strong> con un factor de{' '}
                  <span className="font-mono text-[#80561f] font-bold">1 + ({bulkPercent}%)</span>.
                </p>
              </div>

              <button
                type="button"
                disabled={bulkIsUpdating}
                onClick={async () => {
                  if (!confirm(`🚨 ¿Estás seguro de modificar masivamente el ${bulkPercent}% de los precios para los filtros seleccionados? Esta operación cambiará el catálogo base definitivo.`)) return;
                  setBulkIsUpdating(true);
                  try {
                    const res = await api.adminBulkPrice(bulkCategory, bulkProvider, bulkPercent, 'multiply');
                    await onRefreshData();
                    alert(`¡Éxito! ${res.message}`);
                    showNotice('¡Tarifas base modificadas!');
                  } catch (e: any) {
                    alert(e.message || 'Error al aplicar modificación de precios');
                  } finally {
                    setBulkIsUpdating(false);
                  }
                }}
                className="w-full sm:w-auto px-5 py-3 bg-[#fdc483] hover:bg-[#fdc483]/80 text-[#80561f] font-display font-black text-xs uppercase rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-xs"
              >
                <span>{bulkIsUpdating ? 'Procesando Ajuste...' : 'Aplicar Modificación de Precios Masiva'}</span>
              </button>
            </div>

            {/* Bento charts frame */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="stats-bento-grid">
              
              {/* Product Best Sellers horizontal bar chart */}
              <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-3xl space-y-4 shadow-xs">
                <div>
                  <h4 className="font-display font-black text-sm text-on-surface">🏆 Artículos Más Vendidos (Líderes de Pique)</h4>
                  <p className="text-[10px] text-on-surface-variant">Conteo total de unidades despachadas desde Itá Ibaté.</p>
                </div>

                <div className="space-y-3 pt-2">
                  {(() => {
                    // Compute top selling items
                    const salesMap: { [key: string]: { name: string; count: number } } = {};
                    orders.forEach((o) => {
                      o.items.forEach((it) => {
                        if (!salesMap[it.productId]) {
                          salesMap[it.productId] = { name: it.productName, count: 0 };
                        }
                        salesMap[it.productId].count += it.quantity;
                      });
                    });

                    const sortedList = Object.values(salesMap).sort((a, b) => b.count - a.count).slice(0, 5);

                    if (sortedList.length === 0) {
                      return <p className="text-xs text-on-surface-variant italic py-6 text-center">Registrando primeros despachos para consolidar métricas...</p>;
                    }

                    const maxCount = Math.max(...sortedList.map(item => item.count));

                    return sortedList.map((item, idx) => {
                      const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="line-clamp-1 max-w-[80%] text-on-surface">{idx+1}. {item.name}</span>
                            <span className="font-mono text-primary">{item.count} u.</span>
                          </div>
                          <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-primary h-full rounded-full transition-all duration-500" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Sales Projections & Seasonal projections */}
              <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-3xl space-y-4 shadow-xs">
                <div>
                  <h4 className="font-display font-black text-sm text-on-surface">☀️ Ventas Estimadas según Temporada</h4>
                  <p className="text-[10px] text-on-surface-variant">Proyecciones de ventas basadas en el volumen de salida de especies.</p>
                </div>

                <div className="space-y-4 pt-1 text-xs">
                  <div className="border border-outline-variant p-3 rounded-2xl bg-surface-container-low space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-amber-700 flex items-center">🔥 Temporada de Oro (Noviembre - Abril)</span>
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">Alta Cofradía</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      Período de mayor pique de Dorados gigantes y Surubíes atigrados. Las transferencias estimadas proyectan un incremento de hasta el <strong className="text-amber-700 font-extrabold">+180%</strong> en equipamiento pesado y señuelos artificiales de profundidad.
                    </p>
                    <div className="pt-1 select-none">
                      <span className="text-[10px] px-2.5 py-1 bg-[#fdc483]/30 text-[#855c27] font-bold rounded-lg border border-[#fdc483]">
                        Caja Estimada Alta: ${(totalSalesVolume * 2.8).toLocaleString('es-AR')} ARS
                      </span>
                    </div>
                  </div>

                  <div className="border border-outline-variant p-3 rounded-2xl bg-surface-container-low space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-sky-700 flex items-center">❄️ Temporada Fría (Mayo - Agosto)</span>
                      <span className="bg-sky-100 text-sky-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">Tranquilo</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      Sálida de especies de llanura como el Pacú y la Piapara. Demanda reducida pero constante de anzuelos Owner chicos y plomos corredizos. Ventas promedio estables de <strong className="text-sky-700 font-extrabold">-${Math.round(totalSalesVolume * 0.45).toLocaleString('es-AR')} ARS</strong> respecto a picos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sales distribution by Category */}
              <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-3xl space-y-4 shadow-xs md:col-span-2">
                <div>
                  <h4 className="font-display font-black text-sm text-on-surface">📊 Recaudación de Caja por Rubro Colectado</h4>
                  <p className="text-[10px] text-on-surface-variant font-medium">Volúmenes acumulados correspondientes a las categorías de catálogo.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {(() => {
                    const categoryRevenue: { [key: string]: number } = {};
                    orders.forEach((o) => {
                      o.items.forEach((it) => {
                        // Find category code
                        const productFullObj = products.find(prod => prod.id === it.productId);
                        const catKey = productFullObj?.category || 'Sin Clasificar';
                        categoryRevenue[catKey] = (categoryRevenue[catKey] || 0) + (it.price * it.quantity);
                      });
                    });

                    const keys = Object.keys(categoryRevenue);
                    if (keys.length === 0) {
                      return <p className="col-span-2 text-xs text-on-surface-variant italic py-6 text-center">Registrando transacciones entregadas para estructurar la segmentación...</p>;
                    }

                    const maxRev = Math.max(...Object.values(categoryRevenue));

                    return keys.map((catLabel, idx) => {
                      const amount = categoryRevenue[catLabel];
                      const percentage = maxRev > 0 ? (amount / maxRev) * 100 : 0;
                      return (
                        <div key={idx} className="p-3 bg-surface-container rounded-2xl border border-outline-variant flex flex-col justify-between space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-black text-[#80561f] uppercase tracking-wider text-[10px]">{catLabel}</span>
                            <span className="font-mono font-black text-primary">${amount.toLocaleString('es-AR')} ARS</span>
                          </div>
                          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-[#2a7b4c] h-full rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 💿 RESTORE AND DATA BACKUPS VIEWPORT */}
        {activeSubTab === 'backups' && (
          <div className="space-y-6 animate-fade-in" id="admin-backups-viewport">
            
            <div className="bg-surface-container-low border border-outline-variant p-6 sm:p-8 rounded-3xl space-y-5">
              <div className="space-y-1.5">
                <h3 className="font-display font-black text-lg text-on-surface">Copias de Seguridad y Resguardo de Datos</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Pirá Pará opera utilizando un sistema de bases de datos locales autogestionadas en archivos JSON. Esto te permite descargar backups completos del sistema en cualquier momento para guardarlos en tu computadora, o restaurar la tienda a un estado histórico anterior.
                </p>
              </div>

              {/* Bento export-import columns link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Export Column */}
                <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-2xl space-y-4 text-center flex flex-col justify-between">
                  <div className="space-y-2 text-left">
                    <span className="text-[18px] block">📥</span>
                    <h4 className="font-display font-black text-sm text-on-surface">Descargar Copia del Servidor</h4>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      Genera un archivo consolidado con formato <span className="font-mono text-primary font-bold">.json</span> conteniendo toda la información de productos, amigos, mensajes de la Cofradía e historial de envíos de forma empaquetada.
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      try {
                        const data = await api.downloadBackup();
                        const jsonStr = JSON.stringify(data, null, 2);
                        const blob = new Blob([jsonStr], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `pirapara_backup_completo_${Date.now()}.json`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        showNotice('¡Copia de seguridad descargada!');
                      } catch (err: any) {
                        alert('No se pudo descargar el backup: ' + err.message);
                      }
                    }}
                    className="w-full py-3 bg-primary hover:bg-primary-container text-white font-display font-black text-xs uppercase rounded-xl tracking-wider transition-colors shadow-sm"
                  >
                    Exportar Base de Datos (.JSON)
                  </button>
                </div>

                {/* Import Column */}
                <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-2xl space-y-4 text-center flex flex-col justify-between">
                  <div className="space-y-2 text-left">
                    <span className="text-[18px] block">📤</span>
                    <h4 className="font-display font-black text-sm text-on-surface">Restaurar Copia Guardada</h4>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      Importá un archivo de backup previamente descargado. <strong className="text-error font-extrabold">Atención:</strong> Esta acción sobrescribirá todos los productos y registros vigentes por los cargados en el archivo.
                    </p>
                  </div>

                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      disabled={isRestoring}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onload = async (event) => {
                          try {
                            const text = event.target?.result as string;
                            const parsed = JSON.parse(text);
                            
                            // Basic validation check
                            if (!parsed.products || !parsed.friends || !parsed.orders) {
                              throw new Error('Estructura de backup JSON inválida. Debe contener productos, amigos y pedidos.');
                            }

                            if (confirm('🚨 ¡ATENCIÓN DEFINITIVA! Estás a punto de reemplazar TODA la base de datos de Pirá Pará con esta copia histórica de seguridad. ¿Confirmás esta acción de restauración?')) {
                              setIsRestoring(true);
                              const res = await api.restoreBackup(parsed);
                              if (res.success) {
                                await onRefreshData();
                                alert(res.message);
                                showNotice('¡Sistema restaurado!');
                              }
                            }
                          } catch (err: any) {
                            alert('La restauración falló: ' + err.message);
                          } finally {
                            setIsRestoring(false);
                            e.target.value = ''; // Reset input element
                          }
                        };
                        reader.readAsText(file);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      id="backup-input-file"
                    />
                    <button
                      type="button"
                      disabled={isRestoring}
                      className="w-full py-3 border border-dashed border-outline-variant hover:border-primary text-on-surface hover:text-primary font-display font-black text-xs uppercase rounded-xl tracking-wider transition-colors"
                    >
                      {isRestoring ? 'Restaurando Base de Datos...' : 'Cargar archivo de Backup (.JSON)'}
                    </button>
                  </div>
                </div>

              </div>

              {/* Maintenance checklist warnings */}
              <div className="p-4 border border-[#80561f]/20 bg-[#fdc483]/10 rounded-2xl flex items-start space-x-3 text-xs leading-relaxed text-on-surface-variant">
                <span className="text-base text-[#80561f]">🛡️</span>
                <div>
                  <p className="font-extrabold text-[#80561f] uppercase tracking-wider text-[10px] mb-0.5">Recomendaciones de Seguridad</p>
                  <p>Hacé copias de seguridad de forma semanal o al finalizar campañas importantes de bulk pricing. Conservá los archivos JSON de forma local. No alteres la codificación interna de los archivos para evitar que fallen las comprobaciones de consistencia técnica del catálogo.</p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
};
