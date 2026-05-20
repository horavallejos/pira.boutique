import React, { useState, useEffect } from 'react';
import { 
  Search, ShieldAlert, Award, Sparkles, MapPin, Phone, Mail, 
  Calendar, Anchor, Send, CheckCircle2, ShoppingCart, UserCheck, 
  ChevronRight, Lock, KeyRound, Eye, X
} from 'lucide-react';

import { Product, Category, CartItem, Order, Friend, ContactMessage } from './types';
import { api } from './services/api';

import { Navbar } from './components/Navbar';
import { CartSidebar } from './components/CartSidebar';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTracker } from './components/OrderTracker';
import { AdminPanel } from './components/AdminPanel';
import { HomeView } from './components/HomeView';
import { AboutUs } from './components/AboutUs';
import { MiCuenta } from './components/MiCuenta';

export default function App() {
  // DB States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Navigation and overlay states
  const [currentTab, setCurrentTab] = useState<'home' | 'nosotros' | 'catalog' | 'tracker' | 'contact' | 'login' | 'admin'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Member states: Logged in Friend Cofradía Club member
  const [loggedFriend, setLoggedFriend] = useState<Friend | null>(() => {
    const stored = localStorage.getItem('pirapara_logged_friend');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const handleLoginFriend = (friendData: Friend) => {
    setLoggedFriend(friendData);
    localStorage.setItem('pirapara_logged_friend', JSON.stringify(friendData));
    if (friendData.isAdmin || (friendData.email && friendData.email.trim().toLowerCase() === "informatecorrientes@gmail.com")) {
      setIsAdminAuthorized(true);
      localStorage.setItem('pirapara_admin_auth', 'true');
    }
    refreshAllData();
  };

  const handleLogoutFriend = () => {
    setLoggedFriend(null);
    localStorage.removeItem('pirapara_logged_friend');
    setIsAdminAuthorized(false);
    localStorage.removeItem('pirapara_admin_auth');
    if (currentTab === 'admin') {
      setCurrentTab('home');
    }
    refreshAllData();
  };

  const handleUpdateFriend = (updatedFriend: Friend) => {
    setLoggedFriend(updatedFriend);
    localStorage.setItem('pirapara_logged_friend', JSON.stringify(updatedFriend));
    if (updatedFriend.isAdmin || (updatedFriend.email && updatedFriend.email.trim().toLowerCase() === "informatecorrientes@gmail.com")) {
      setIsAdminAuthorized(true);
      localStorage.setItem('pirapara_admin_auth', 'true');
    }
    refreshAllData();
  };

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Admin authorization
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(() => {
    // Read from localStorage to persist admin session
    if (localStorage.getItem('pirapara_admin_auth') === 'true') {
      return true;
    }
    const stored = localStorage.getItem('pirapara_logged_friend');
    if (stored) {
      try {
        const friendData = JSON.parse(stored);
        if (friendData.isAdmin || (friendData.email && friendData.email.trim().toLowerCase() === "informatecorrientes@gmail.com")) {
          return true;
        }
      } catch (e) {}
    }
    return false;
  });

  // Client states: Shopping Cart
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Cofradía Registration Form
  const [cofradiaName, setCofradiaName] = useState('');
  const [cofradiaWhatsapp, setCofradiaWhatsapp] = useState('');
  const [cofradiaNotice, setCofradiaNotice] = useState('');

  // Contact Form
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactNotice, setContactNotice] = useState('');

  const [trackerInitialEmail, setTrackerInitialEmail] = useState('');

  // Fetch all data from Express APIs
  const refreshAllData = async () => {
    try {
      const p = await api.getProducts();
      const c = await api.getCategories();
      const o = await api.getOrders();
      const f = await api.getFriends();
      const m = await api.getMessages();

      setProducts(p);
      setCategories(c);
      setOrders(o);
      setFriends(f);
      setMessages(m);
    } catch (err) {
      console.error("No se pudo obtener datos del backend Express", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Shopping Cart Actions
  const handleAddToCart = (product: Product, quantity: number, selectedModel?: string) => {
    setCartItems((prevItems) => {
      // Find item with same product ID AND same selected option
      const existingIdx = prevItems.findIndex(
        (item) => item.product.id === product.id && item.selectedModel === selectedModel
      );

      if (existingIdx !== -1) {
        const updated = [...prevItems];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prevItems, { product, quantity, selectedModel }];
      }
    });
  };

  const handleInstantBuy = (product: Product) => {
    // If product has multiple models, pick the first one as default
    const model = product.modelOptions && product.modelOptions.length > 0 ? product.modelOptions[0] : undefined;
    handleAddToCart(product, 1, model);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, change: number, selectedModel?: string) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.product.id === productId && item.selectedModel === selectedModel) {
            const newQty = item.quantity + change;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveCartItem = (productId: string, selectedModel?: string) => {
    setCartItems((prevItems) => {
      return prevItems.filter(
        (item) => !(item.product.id === productId && item.selectedModel === selectedModel)
      );
    });
  };

  // Cofradía Club Submission handler
  const handleJoinCofradia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cofradiaName.trim() || !cofradiaWhatsapp.trim()) {
      alert("Por favor completá tu Nombre y WhatsApp.");
      return;
    }

    try {
      const response = await api.joinCofradia(cofradiaName, cofradiaWhatsapp);
      await refreshAllData();
      setCofradiaNotice(`¡Bienvenido ${response.friend?.name || cofradiaName}! Ya sos parte oficial de la Cofradía Pirá Pará. Nos contactaremos pronto.`);
      setCofradiaName('');
      setCofradiaWhatsapp('');
      setTimeout(() => setCofradiaNotice(''), 6000);
    } catch (err: any) {
      alert(err.message || "Error al unirse.");
    }
  };

  // Contact Message Submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      alert("Completá tu Nombre, Email y Consulta.");
      return;
    }

    try {
      await api.submitMessage(contactName, contactEmail, contactSubject, contactMessage);
      await refreshAllData();
      setContactNotice(`¡Muchas gracias ${contactName}! Recibimos tu consulta con éxito. Te responderemos al correo provisto.`);
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
      setTimeout(() => setContactNotice(''), 6000);
    } catch (err) {
      alert("No se pudo enviar tu consulta.");
    }
  };

  // Admin PIN Mode Authentication Check
  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified, user-friendly pass checks ("pesca" or empty space for prompt, or "admin")
    if (adminPasswordInput.toLowerCase() === 'pesca' || adminPasswordInput.toLowerCase() === 'admin' || adminPasswordInput.trim() === '') {
      setIsAdminAuthorized(true);
      localStorage.setItem('pirapara_admin_auth', 'true');
      setShowAdminAuthModal(false);
      setAdminPasswordInput('');
      setCurrentTab('admin');
    } else {
      alert('Clave inválida. Intentá con "pesca" o "admin".');
    }
  };

  const handleToggleAdminMode = () => {
    if (isAdminAuthorized) {
      // Sign-out
      setIsAdminAuthorized(false);
      localStorage.removeItem('pirapara_admin_auth');
      if (currentTab === 'admin') {
        setCurrentTab('catalog');
      }
    } else {
      setShowAdminAuthModal(true);
    }
  };

  // Tracking Trigger redirect from checkout success
  const handleOrderCompleted = (order: Order) => {
    setTrackerInitialEmail(order.customerEmail);
    setCurrentTab('tracker');
    refreshAllData();
  };

  // Filtering products logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans" id="app-viewport">
      
      {/* Navbar Container */}
      <Navbar
        currentTab={currentTab}
        onChangeTab={(tab) => {
          if (tab === 'admin' && !isAdminAuthorized) {
            setShowAdminAuthModal(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        isAdmin={isAdminAuthorized}
        onToggleAdminModal={handleToggleAdminMode}
        loggedFriend={loggedFriend}
        onLogoutFriend={handleLogoutFriend}
      />

      {/* Main Screen Router layout body */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8" id="main-view-router">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4" id="app-loading-fallback">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="font-display font-medium text-xs tracking-wider uppercase text-on-surface-variant/70 animate-pulse">
              Conectando con Pirá Pará...
            </p>
          </div>
        ) : (
          <>
            {/* 0_1. HOME VIEW */}
            {currentTab === 'home' && (
              <HomeView
                products={products}
                onSelectProduct={setSelectedProduct}
                onChangeTab={setCurrentTab}
              />
            )}

            {/* 0_2. ABOUT US VIEW */}
            {currentTab === 'nosotros' && (
              <AboutUs />
            )}

            {/* 1_c. MI CUENTA COFRADÍA VIEW */}
            {currentTab === 'login' && (
              <MiCuenta
                friend={loggedFriend}
                orders={orders}
                products={products}
                onLogin={handleLoginFriend}
                onLogout={handleLogoutFriend}
                onUpdateFriend={handleUpdateFriend}
                onInstantBuy={handleInstantBuy}
              />
            )}

            {/* 1. STORE CATALOG VIEW TAB */}
            {currentTab === 'catalog' && (
              <div className="space-y-10" id="screen-catalog">
                
                {/* Immersive Wide River Hero Banner Panel */}
                <div 
                  className="relative h-[340px] rounded-3xl overflow-hidden shadow-xl border border-outline-variant flex items-center bg-zinc-900"
                  id="catalog-hero"
                >
                  <img
                    referrerPolicy="no-referrer"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfXFT6wR0jzemdmWw4pAk1Nz6MhNjWIhbWj1twzWkbag-8LWKsuF4Rqah89F2_Y9kpfx9vboMVH_qDr4W6-3d9atC6YyRZM2_Q-mmc36Vb3JvpDL3fbuej45lCHM56_v-K0_zkXR5X2nnu6iMizUb369eMuvwD2Mkr2YLXXhZl_Vbe8Un6g70rNVgllWnhi_OQu1-EZQT6jZYcFNwizqkDm7KUm3vcD0bXIg0EWGVi5Y22b6Hi4QSCKQ6oztFCYpJKuTlWetHJZDI"
                    alt="Amanecer en el Río Paraná, Itá Ibaté Corrientes"
                    className="absolute inset-0 w-full h-full object-cover opacity-65 mix-blend-overlay"
                  />
                  {/* Subtle thematic warm gradient mask overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#2c1314]/90 via-[#422213]/70 to-[#201011]/35 pointer-events-none" />

                  <div className="relative z-10 p-6 sm:p-10 max-w-2xl text-white space-y-4" id="catalog-hero-text">
                    <span className="text-[10px] bg-white/10 border border-white/20 text-[#fdc483] font-display font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-block">
                      📍 Itá Ibaté, Corrientes, Argentina
                    </span>
                    <h2 className="font-display font-black text-3xl sm:text-5xl tracking-normal text-white">
                      Equipamiento Dorado
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-250 leading-relaxed font-sans font-medium">
                      Nuestra pasión por el Paraná se traduce en cada anzuelo, caña y reel. Curamos el mejor equipamiento táctico para tus jornadas en el litoral. Envío rápido y asesoramiento personalizado de guías expertos.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#fdc483] pt-2">
                      <span className="flex items-center space-x-1">
                        <Award className="h-4 w-4 text-primary-container" />
                        <span>Reeles Shimano Oficial</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Sparkles className="h-4 w-4 text-primary-container" />
                        <span>Frenos DC Digital Control</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Catalog body structure */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" id="catalog-main-mesh">
                  
                  {/* Left Column Filters sidebar */}
                  <div className="lg:col-span-1 space-y-6" id="catalog-sidebar-filters">
                    
                    {/* Search container */}
                    <div className="bg-surface-container-low border border-outline-variant p-4 rounded-2xl" id="search-container">
                      <label className="text-[10px] font-bold text-[#80561f] uppercase tracking-wider block mb-2">
                        Buscador Técnico
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-on-surface-variant/60" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-outline bg-surface-container-lowest text-xs font-semibold focus:outline-primary placeholder:text-outline-variant"
                          placeholder="Ej: Curado DC, Laguna..."
                        />
                      </div>
                    </div>

                    {/* Category Buttons List */}
                    <div className="bg-surface-container-low border border-outline-variant p-4 rounded-2xl space-y-2" id="category-selector-container">
                      <label className="text-[10px] font-bold text-[#80561f] uppercase tracking-wider block mb-2">
                        Categorías / Rubros
                      </label>
                      <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1 pb-2 lg:pb-0 scrollbar-none no-scrollbar">
                        <button
                          onClick={() => setActiveCategory('all')}
                          className={`w-full flex justify-between items-center text-left text-xs px-3.5 py-2.5 rounded-xl font-bold transition-all flex-shrink-0 lg:flex-shrink-1 ${
                            activeCategory === 'all'
                              ? 'bg-primary text-white shadow-sm'
                              : 'text-on-surface hover:bg-surface-container-high'
                          }`}
                        >
                          <span>Todos los Rubros</span>
                          <span className={`${activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface-variant'} text-[10px] px-2 py-0.5 rounded-full`}>
                            {products.length}
                          </span>
                        </button>

                        {categories.map((cat) => {
                          const count = products.filter((p) => p.category === cat.id).length;
                          return (
                            <button
                              key={cat.id}
                              onClick={() => setActiveCategory(cat.id)}
                              className={`w-full flex justify-between items-center text-left text-xs px-3.5 py-2.5 rounded-xl font-bold transition-all flex-shrink-0 lg:flex-shrink-1 ${
                                activeCategory === cat.id
                                  ? 'bg-primary text-white shadow-sm'
                                  : 'text-on-surface hover:bg-surface-container-high'
                              }`}
                            >
                              <span>{cat.name}</span>
                              <span className={`${activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface-variant'} text-[10px] px-2 py-0.5 rounded-full`}>
                                {count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Small visual advisory badge info */}
                    <div className="bg-surface-container p-4.5 rounded-2xl border border-outline-variant text-[11px] leading-relaxed text-on-surface-variant space-y-2">
                      <div className="flex items-center space-x-2 text-[#7f2225] font-bold">
                        <Anchor className="h-4.5 w-4.5" />
                        <span className="font-display">La Cofradía Pirá Pará</span>
                      </div>
                      <p>
                        ¿Pasión por el Paraná? Registrate un poco más abajo como Amigo de la Cofradía y accedé a compras exclusivas con bonificación directa.
                      </p>
                    </div>

                  </div>

                  {/* Right Column: Catalog Grid */}
                  <div className="lg:col-span-3 space-y-6" id="catalog-grid-frame">
                    
                    <div className="flex justify-between items-center" id="catalog-grid-header">
                      <h3 className="font-display font-black text-sm text-[#7f2225] uppercase tracking-wider">
                        Productos en Vitrina ({filteredProducts.length})
                      </h3>
                      <span className="text-[10px] text-on-surface-variant italic font-semibold">
                        Despachando Encomiendas desde el Litoral
                      </span>
                    </div>

                    {filteredProducts.length === 0 ? (
                      <div className="border border-outline-variant/60 bg-surface-container-low p-12 rounded-3xl text-center space-y-3" id="catalog-empty-state">
                        <p className="font-display font-black text-sm text-on-surface">No hay stock disponible para esta selección</p>
                        <p className="text-xs text-on-surface-variant max-w-[280px] mx-auto">
                          Intentá cambiando las palabras claves del Buscador Técnico o elegí otra categoría de filtros.
                        </p>
                        <button
                          onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                          className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-container transition-colors"
                        >
                          Limpiar Búsqueda
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" id="products-catalog-grid">
                        {filteredProducts.map((p) => (
                          <div 
                            key={p.id}
                            className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group h-full hover:-translate-y-0.5"
                            id={`catalog-product-card-${p.id}`}
                          >
                            {/* Card Image header frame */}
                            <div 
                              onClick={() => setSelectedProduct(p)}
                              className="relative bg-surface-container-low h-[180px] flex items-center justify-center p-3 cursor-pointer overflow-hidden"
                            >
                              <img
                                referrerPolicy="no-referrer"
                                src={p.image || undefined}
                                alt={p.name}
                                className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-all duration-300 drop-shadow-sm"
                              />

                              {/* Corner tag Badges */}
                              {p.tag && (
                                <span className="absolute top-2.5 right-2.5 bg-primary text-white text-[9px] font-display font-black px-2.5 py-1 rounded-full uppercase shadow-xs">
                                  {p.tag}
                                </span>
                              )}

                              {p.stockStatus === 'OutOfStock' && (
                                <div className="absolute inset-0 bg-white/60 flex items-center justify-center font-display font-black text-xs text-error select-none">
                                  SIN STOCK
                                </div>
                              )}
                            </div>

                            {/* Card Contents */}
                            <div className="p-4 flex-1 flex flex-col justify-between" id={`product-body-${p.id}`}>
                              
                              <div className="space-y-1.5 cursor-pointer" onClick={() => setSelectedProduct(p)}>
                                {/* Rubro link info */}
                                <span className="text-[9px] font-sans font-extrabold uppercase tracking-widest text-[#80561f]">
                                  {p.category}
                                </span>
                                
                                <h4 className="font-display font-black text-sm text-on-surface leading-tight line-clamp-2">
                                  {p.name}
                                </h4>

                                <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                                  {p.description}
                                </p>
                              </div>

                              <div className="pt-4 mt-3 border-t border-outline-variant/60 flex items-center justify-between" id={`product-footer-${p.id}`}>
                                <div className="flex flex-col">
                                  {(() => {
                                    const isWholesaleUser = loggedFriend?.isMayorista || (loggedFriend?.points || 0) >= 500;
                                    if (isWholesaleUser) {
                                      return (
                                        <>
                                          <span className="text-[9px] text-[#80561f] font-mono line-through leading-none mb-0.5">
                                            Lista: ${p.price.toLocaleString('es-AR')}
                                          </span>
                                          <span className="text-sm font-display font-black text-amber-600 flex items-center gap-0.5">
                                            ⭐ ${Math.round(p.price * 0.65).toLocaleString('es-AR')}
                                          </span>
                                        </>
                                      );
                                    }
                                    return (
                                      <>
                                        {p.originalPrice && (
                                          <span className="text-[10px] text-on-surface-variant/70 line-through">
                                            ${p.originalPrice.toLocaleString('es-AR')}
                                          </span>
                                        )}
                                        <span className="text-sm font-display font-black text-primary">
                                          ${p.price.toLocaleString('es-AR')} ARS
                                        </span>
                                      </>
                                    );
                                  })()}
                                </div>

                                <button
                                  onClick={() => {
                                    if (p.stockStatus === 'OutOfStock') return;
                                    setSelectedProduct(p);
                                  }}
                                  className={`px-3 py-2 rounded-xl text-[10px] font-display font-black uppercase transition-all flex items-center space-x-1 border ${
                                    p.stockStatus === 'OutOfStock'
                                      ? 'border-outline-variant bg-surface-container text-on-surface-variant/40 cursor-not-allowed'
                                      : 'bg-primary text-white border-primary hover:bg-primary-container shadow-xs'
                                  }`}
                                  disabled={p.stockStatus === 'OutOfStock'}
                                >
                                  <span>{p.stockStatus === 'OutOfStock' ? 'Sin Stock' : 'Ver Detalles'}</span>
                                </button>
                              </div>

                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Call To Action Panel - JOIN COFRADÍA */}
                <div 
                  className="bg-surface-container border border-outline-variant p-6 sm:p-10 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6"
                  id="club-cofradia-register"
                >
                  <div className="max-w-md space-y-2">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="h-5.5 w-5.5 text-primary" />
                      <h3 className="font-display font-black text-lg sm:text-xl text-on-surface">
                        ¡Unite a la Cofradía Pirá Pará! 🛶
                      </h3>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Súmate gratis a nuestro club exclusivo de pescadores en el Paraná. Conseguí de inmediato el beneficio <strong>"PRECIO AMIGO"</strong> en productos seleccionados, alertas tempranas del estado del pique en Itá Ibaté, y consultas técnicas con nuestros guías.
                    </p>
                  </div>

                  <form onSubmit={handleJoinCofradia} className="w-full md:max-w-xs space-y-3" id="cofradia-form">
                    <input
                      type="text"
                      required
                      value={cofradiaName}
                      onChange={(e) => setCofradiaName(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-outline bg-surface-container-lowest focus:outline-primary placeholder:text-outline-variant"
                      placeholder="Tu Nombre Completo..."
                    />
                    <input
                      type="tel"
                      required
                      value={cofradiaWhatsapp}
                      onChange={(e) => setCofradiaWhatsapp(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-outline bg-surface-container-lowest focus:outline-primary placeholder:text-outline-variant"
                      placeholder="Tu Número con WhatsApp (Ej: +54...)"
                    />
                    
                    {cofradiaNotice && (
                      <p className="text-[10px] text-tertiary font-bold bg-tertiary/10 p-2 rounded-lg border border-tertiary/20" id="cofradia-success-not">
                        {cofradiaNotice}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-display font-extrabold uppercase flex items-center justify-center space-x-1 shadow"
                    >
                      <span>Unirme Gratis</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </form>
                </div>

              </div>
            )}

            {/* 2. LIVE DELIVERIES ORDER TRACKER TAB */}
            {currentTab === 'tracker' && (
              <OrderTracker
                onSearchOrders={api.getOrders}
                initialEmail={trackerInitialEmail}
              />
            )}

            {/* 3. CONTACT FORM TAB */}
            {currentTab === 'contact' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="screen-contact">
                {/* Contact information details */}
                <div className="bg-surface-container border border-outline-variant p-6 sm:p-8 rounded-3xl space-y-5" id="contact-info">
                  <div className="space-y-1">
                    <span className="text-[10px] font-sans font-extrabold text-[#80561f] uppercase tracking-widest block">Contacto</span>
                    <h2 className="font-display font-black text-xl md:text-2xl text-on-surface">Base de Operaciones</h2>
                    <p className="text-xs text-on-surface-variant">¿Tenés dudas sobre los equipos recomendados para tu próximo viaje al Paraná? Estamos para servirte.</p>
                  </div>

                  <div className="space-y-4 text-xs text-on-surface-variant">
                    <div className="flex items-start space-x-3.5">
                      <div className="h-8 w-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">Ubicación Física:</p>
                        <p>Frente al Río Paraná, Km 1180, Itá Ibaté, Corrientes, CP 3480.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3.5">
                      <div className="h-8 w-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">WhatsApp Directo:</p>
                        <p className="font-mono text-primary font-bold">+54 9 379 1234567</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3.5">
                      <div className="h-8 w-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">Consultas Buzón:</p>
                        <p>pirapara.outdoor@gmail.com</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3.5">
                      <div className="h-8 w-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">Atención en Itá Ibaté:</p>
                        <p>Lunes a Sábados: 07:00 a 19:30 hs. Domingos de Pesca: 07:00 a 12:00 hs.</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-[#fdc483]/60 bg-[#fdc483]/10 p-4 rounded-2xl">
                    <p className="text-[11px] leading-relaxed text-on-surface-variant">
                      🛶 <strong>Asesoramiento Personalizado con Guías:</strong> Si necesitás calibrado del freno digital DC Shimano o consultarnos por la medida del anzuelo Owner para carnada viva, decinos al enviar tu pedido.
                    </p>
                  </div>
                </div>

                {/* Submitting form form section */}
                <div className="bg-surface-container-lowest border border-outline-variant p-6 sm:p-8 rounded-3xl shadow-sm" id="contact-form-frame">
                  <h3 className="font-display font-black text-sm text-[#7f2225] uppercase tracking-wider mb-4 border-b pb-2">
                    Dejanos tu Consulta
                  </h3>

                  <form onSubmit={handleContactSubmit} className="space-y-4" id="contact-inputs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#80561f] uppercase tracking-wider">Nombre Completo</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-outline bg-surface focus:outline-primary"
                        placeholder="Ej. Juan Pérez"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#80561f] uppercase tracking-wider">Correo Electrónico</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-outline bg-surface focus:outline-primary"
                        placeholder="Ej: mi-correo@gmail.com"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#80561f] uppercase tracking-wider">Asunto</label>
                      <input
                        type="text"
                        required
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-outline bg-surface focus:outline-primary"
                        placeholder="Ej: Consulta de Cañas..."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#80561f] uppercase tracking-wider">Mensaje / Consulta</label>
                      <textarea
                        rows={4}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-outline bg-surface focus:outline-primary"
                        placeholder="Escribí aquí tu consulta técnica o comercial..."
                      />
                    </div>

                    {contactNotice && (
                      <p className="text-xs text-tertiary font-bold bg-tertiary/10 p-3 rounded-lg border border-tertiary/20" id="contact-success-not">
                        {contactNotice}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 bg-primary hover:bg-primary-container text-white font-display font-extrabold uppercase text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow"
                    >
                      <Send className="h-4 w-4" />
                      <span>Enviar Mensaje</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* 4. PRIVATE SECURE AUDITING BACKEND TAB */}
            {currentTab === 'admin' && isAdminAuthorized && (
              <AdminPanel
                products={products}
                categories={categories}
                orders={orders}
                friends={friends}
                messages={messages}
                onRefreshData={refreshAllData}
              />
            )}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-outline-variant bg-surface-container py-8 mt-12 text-xs text-on-surface-variant" id="app-footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="font-display font-black text-sm text-primary">Pirá Pará Outdoor</p>
            <p className="text-[10px] mt-0.5">Tienda de Equipamiento Especializado para Ríos de Llanura • Itá Ibaté, Corrientes.</p>
          </div>
          <div className="text-center md:text-right text-[10px] font-medium">
            <p className="text-on-surface-variant font-black uppercase tracking-widest text-[#80561f] mb-1">Punto de Pique de Elite</p>
            <p>© 2026 Pirá Pará Itá Ibaté. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar drawer Overlay */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
        loggedFriend={loggedFriend}
      />

      {/* PDP Details overlay Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(product, qty, opt) => {
          handleAddToCart(product, qty, opt);
          setIsCartOpen(true);
        }}
      />

      {/* Checkout Guide overlay Wizard Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderCompleted={handleOrderCompleted}
        onClearCart={() => setCartItems([])}
        loggedFriend={loggedFriend}
      />

      {/* Floating WhatsApp chat widget visible in all sections */}
      <a
        href="https://wa.me/5493791234567?text=Hola%20Pir%C3%A1%20Par%C3%A1!%20Quer%C3%ADa%20hacerles%20una%20consulta%20técnica%20de%20equipos..."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white px-4.5 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20 active:scale-95 cursor-pointer"
        title="Consultar con un Guía de Río"
        id="whatsapp-floating-bubble"
      >
        <svg 
          viewBox="0 0 24 24" 
          className="h-5 w-5 fill-current" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.004 2C6.51 2 2.014 6.5 2.014 12c0 2.16.7 4.15 1.89 5.79-.07.41-.34 2.1-.48 2.87-.15.82.49 1.45 1.28 1.25.74-.19 2.19-.57 2.8-.7a9.97 9.97 0 004.5.88c5.49 0 9.99-4.5 9.99-10s-4.5-10-9.99-10zm4.84 14.15c-.21.57-1.12 1.04-1.63 1.11-.47.06-.93.07-1.57-.17-2.28-.85-3.87-3.08-4.71-4.21-.36-.48-.63-.98-.63-1.48 0-1.04.51-1.55.77-1.81.18-.18.42-.25.64-.17.15.05.3.1.43.23.28.28.87.97.94 1.07.07.1.06.25 0 .37-.06.12-.17.27-.27.37-.12.12-.22.25-.1.44a6.4 6.4 0 001.5 1.5c.34.25.62.15.84-.07.16-.16.32-.38.48-.56.16-.18.34-.14.54-.08l1.45.69c.22.1.34.18.25.39z" />
        </svg>
        <span className="text-xs font-display font-black uppercase tracking-wider hidden sm:inline-block">Guías Online</span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      </a>

      {/* Hidden Admin Access Sign-in dialog modal */}
      {showAdminAuthModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="admin-auth-panel">
          <div className="bg-surface text-on-surface border border-outline-variant w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5" id="admin-auth-card">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-primary" />
                <h3 className="font-display font-black text-sm text-on-surface uppercase tracking-wider">Muelle de Acceso Admin</h3>
              </div>
              <button onClick={() => setShowAdminAuthModal(false)} className="rounded hover:bg-surface-container p-1">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Ingresá el PIN del muelle de administrador para modificar productos, verificar planillas de amigos o cambiar despachos. <br /><strong>(Clave recomendada: <span className="font-mono text-primary font-bold">\"pesca\" o \"admin\" o dejar vacío</span>)</strong>.
            </p>

            <form onSubmit={handleAdminAuthSubmit} className="space-y-4" id="admin-auth-form">
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-on-surface-variant" />
                <input
                  type="password"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-outline focus:outline-primary bg-surface-container-low text-xs font-mono tracking-widest text-center"
                  placeholder="• • • • •"
                  autoFocus
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAdminAuthModal(false)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold border hover:bg-surface-container"
                >
                  Regresar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary hover:bg-primary-container text-white rounded-lg text-xs font-bold"
                >
                  Conectar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
