import React from 'react';
import { 
  ShoppingBag, Lock, Unlock, Compass, Mail, ClipboardList, 
  User, Home, Users, LogOut, Award, ShieldAlert, Sparkles 
} from 'lucide-react';
import { Friend } from '../types';

interface NavbarProps {
  currentTab: 'home' | 'nosotros' | 'catalog' | 'tracker' | 'contact' | 'login' | 'admin';
  onChangeTab: (tab: 'home' | 'nosotros' | 'catalog' | 'tracker' | 'contact' | 'login' | 'admin') => void;
  cartCount: number;
  onOpenCart: () => void;
  isAdmin: boolean;
  onToggleAdminModal: () => void;
  loggedFriend?: Friend | null;
  onLogoutFriend?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onChangeTab,
  cartCount,
  onOpenCart,
  isAdmin,
  onToggleAdminModal,
  loggedFriend,
  onLogoutFriend,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-outline-variant bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onChangeTab('home')} 
          className="flex cursor-pointer items-center space-x-2"
          id="brand-logo-container"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md hover:scale-105 transition-all">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-6 w-6 transform rotate-45"
            >
              <path d="M12 2v10a4 4 0 0 0 8 0V8" />
              <path d="m18 11 2-2 2 2" />
            </svg>
          </div>
          <div>
            <h1 className="font-display text-lg font-extrabold tracking-tight text-primary sm:text-xl leading-none" id="brand-title">
              Pirá Pará
            </h1>
            <p className="font-sans text-[8px] font-bold tracking-widest text-[#80561f] uppercase mt-0.5">
              Boutique de Pesca y Camping
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1" id="desktop-nav">
          <button
            onClick={() => onChangeTab('home')}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'home'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            <span>Inicio</span>
          </button>

          <button
            onClick={() => onChangeTab('nosotros')}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'nosotros'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Nosotros</span>
          </button>

          <button
            onClick={() => onChangeTab('catalog')}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'catalog'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Catálogo</span>
          </button>

          <button
            onClick={() => onChangeTab('tracker')}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'tracker'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`}
          >
            <ClipboardList className="h-3.5 w-3.5" />
            <span>Mis Pedidos</span>
          </button>

          <button
            onClick={() => onChangeTab('contact')}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'contact'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Contacto</span>
          </button>

          <button
            onClick={() => onChangeTab('login')}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'login'
                ? 'bg-[#7f2225] text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-[#7f2225]'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>{loggedFriend ? 'Mi Perfil' : 'Mi Cuenta'}</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => onChangeTab('admin')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                currentTab === 'admin'
                  ? 'bg-zinc-800 text-white shadow-md'
                  : 'text-[#7f2225] hover:bg-[#7f2225]/10'
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Admin Panel</span>
            </button>
          )}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-2" id="nav-actions">
          
          {/* Friend Display Card for logged user */}
          {loggedFriend && (
            <div className="hidden sm:flex items-center bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl text-[10px] space-x-2">
              <div className="flex flex-col text-left">
                <span className="font-bold text-on-surface leading-none block line-clamp-1">{loggedFriend.name}</span>
                <span className="text-[8px] text-amber-700 font-extrabold flex items-center space-x-0.5 mt-0.5">
                  {loggedFriend.isMayorista ? (
                    <span className="inline-flex items-center bg-yellow-500 text-stone-950 font-black px-1.5 py-0.5 rounded text-[7px] tracking-wider uppercase animate-pulse">
                      🏆 Amigo PRO
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-primary font-black uppercase tracking-wide">
                      🛶 Amigo Cofradía ({loggedFriend.points || 0} pts)
                    </span>
                  )}
                </span>
              </div>
              <button 
                onClick={onLogoutFriend}
                title="Cerrar sesión de la cuenta"
                className="hover:text-red-600 hover:bg-red-500/10 p-1 rounded-lg transition-all"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Cart Bag */}
          <button
            id="cart-trigger-btn"
            onClick={onOpenCart}
            className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary hover:text-primary transition-all shadow-sm"
            aria-label="Abrir Carrito"
          >
            <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
            {cartCount > 0 && (
              <span 
                id="cart-badge-count"
                className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow ring-2 ring-background"
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Secret / Admin Mode Toggle Control - Only visible to authenticated admins or automatically detected admin email */}
          {(isAdmin || (loggedFriend?.isAdmin || (loggedFriend?.email && loggedFriend.email.trim().toLowerCase() === "informatecorrientes@gmail.com"))) && (
            <button
              id="admin-mode-toggle-btn"
              onClick={onToggleAdminModal}
              className={`flex h-10 items-center space-x-1 px-2.5 rounded-xl border transition-all text-[11px] font-bold shadow-sm ${
                isAdmin
                  ? 'bg-zinc-800 text-white border-zinc-750 hover:bg-zinc-700'
                  : 'border-outline/40 bg-surface-container-lowest text-on-surface-variant hover:text-orange-900 hover:border-secondary'
              }`}
              title={isAdmin ? "Cerrar sesión de Admin" : "Iniciar sesión de Administrador"}
            >
              {isAdmin ? (
                <>
                  <Unlock className="h-3.5 w-3.5 text-amber-500" />
                  <span className="hidden sm:inline text-amber-400">Admin</span>
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Admin</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation bar (Includes our two brand new pages too!) */}
      <div className="flex lg:hidden border-t border-outline-variant bg-surface-container-low px-2 py-1.5 justify-around items-center text-[10px] font-semibold" id="mobile-nav-bar">
        <button
          onClick={() => onChangeTab('home')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-all ${
            currentTab === 'home' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <Home className="h-4.5 w-4.5 mb-0.5" />
          <span>Inicio</span>
        </button>

        <button
          onClick={() => onChangeTab('nosotros')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-all ${
            currentTab === 'nosotros' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <Users className="h-4.5 w-4.5 mb-0.5" />
          <span>Nosotros</span>
        </button>

        <button
          onClick={() => onChangeTab('catalog')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-all ${
            currentTab === 'catalog' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <Compass className="h-4.5 w-4.5 mb-0.5" />
          <span>Catálogo</span>
        </button>

        <button
          onClick={() => onChangeTab('tracker')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-all ${
            currentTab === 'tracker' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <ClipboardList className="h-4.5 w-4.5 mb-0.5" />
          <span>Pedidos</span>
        </button>

        <button
          onClick={() => onChangeTab('login')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-all ${
            currentTab === 'login' ? 'text-[#7f2225]' : 'text-on-surface-variant'
          }`}
        >
          <User className="h-4.5 w-4.5 mb-0.5" />
          <span>Mi Cuenta</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => onChangeTab('admin')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg transition-all ${
              currentTab === 'admin' ? 'text-stone-900 font-extrabold' : 'text-on-surface-variant/70'
            }`}
          >
            <ShieldAlert className="h-4.5 w-4.5 mb-0.5" />
            <span>Admin</span>
          </button>
        )}
      </div>
    </header>
  );
};
