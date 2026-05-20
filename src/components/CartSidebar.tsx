import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem, Friend } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, change: number, selectedModel?: string) => void;
  onRemoveItem: (productId: string, selectedModel?: string) => void;
  onCheckout: () => void;
  loggedFriend?: Friend | null;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  loggedFriend,
}) => {
  if (!isOpen) return null;

  const isWholesale = loggedFriend?.isMayorista || (loggedFriend?.points || 0) >= 500;

  const getProductPrice = (price: number) => {
    return isWholesale ? Math.round(price * 0.65) : price;
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + getProductPrice(item.product.price) * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-sidebar-wrapper">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        id="cart-backdrop"
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10" id="cart-container-parent">
        <div id="cart-container-inner" className="w-screen max-w-md transform bg-surface text-on-surface shadow-2xl transition-all flex flex-col h-full border-l border-outline-variant">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant bg-surface-container" id="cart-header">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-bold text-on-surface">Mi Carrito</h2>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
              id="cart-close-btn"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Contents list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4" id="cart-items-scroller">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4" id="empty-cart-state">
                <div className="h-16 w-16 bg-surface-container-high rounded-full flex items-center justify-center text-on-surface-variant/40">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-on-surface">Tu Carrito está vacío</h3>
                  <p className="text-xs text-on-surface-variant max-w-[240px] mt-1">
                    Explorá nuestro catálogo con equipamiento de pesca y outdoor premium.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-container transition-colors shadow-sm"
                  id="cart-continue-shopping-btn"
                >
                  Ver Catálogo
                </button>
              </div>
            ) : (
              cartItems.map((item, idx) => (
                <div 
                  key={`${item.product.id}-${item.selectedModel || 'default'}-${idx}`}
                  className="flex items-start space-x-4 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm hover:border-outline/40 transition-all"
                  id={`cart-item-${item.product.id}`}
                >
                  <img
                    referrerPolicy="no-referrer"
                    src={item.product.image || undefined}
                    alt={item.product.name}
                    className="h-16 w-16 rounded-lg object-cover bg-surface-container border border-outline-variant/50"
                  />
                  
                  <div className="flex-1 min-w-0" id={`cart-item-detail-${item.product.id}`}>
                    <h4 className="font-display text-sm font-bold text-on-surface leading-snug line-clamp-1">
                      {item.product.name}
                    </h4>
                    
                    {item.selectedModel && (
                      <span className="inline-block text-[10px] font-medium bg-surface-container text-secondary px-2 py-0.5 rounded-full mt-0.5">
                        Modelo: {item.selectedModel}
                      </span>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      {/* Price tag */}
                      <span className="text-xs font-black text-primary font-display flex flex-col">
                        {isWholesale && (
                          <span className="text-[9px] text-[#80561f] font-bold line-through leading-none block mb-0.5">
                            Original: ${(item.product.price * item.quantity).toLocaleString('es-AR')}
                          </span>
                        )}
                        <span className={isWholesale ? 'text-amber-600 font-extrabold animate-pulse' : 'text-primary'}>
                          ${(getProductPrice(item.product.price) * item.quantity).toLocaleString('es-AR')} ARS
                        </span>
                      </span>

                      {/* Quantity Controller with design styling */}
                      <div className="flex items-center space-x-1 border border-outline-variant bg-surface rounded-lg px-1.5 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1, item.selectedModel)}
                          className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-xs font-bold text-on-surface px-1.5 min-w-[16px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1, item.selectedModel)}
                          className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                          disabled={item.product.stockStatus === 'OutOfStock'}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.product.id, item.selectedModel)}
                    className="p-1 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded transition-colors self-start"
                    title="Eliminar del Carrito"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer - Purchase Summary info */}
          {cartItems.length > 0 && (
            <div className="border-t border-outline-variant bg-surface-container p-6 space-y-4" id="cart-footer">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Subtotal</span>
                  <span className="font-semibold text-on-surface">${subtotal.toLocaleString('es-AR')} ARS</span>
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant pb-3 border-b border-outline-variant/60">
                  <span>Envío</span>
                  <span className="text-secondary font-semibold">Calculado al confirmar</span>
                </div>
                <div className="flex justify-between text-base font-black text-on-surface pt-2">
                  <span className="font-display">Total Estimado</span>
                  <span className="font-display text-primary text-xl">${subtotal.toLocaleString('es-AR')} ARS</span>
                </div>
              </div>

              <div className="text-[10px] text-on-surface-variant bg-surface-container-high/60 p-2.5 rounded-lg border border-outline-variant flex items-start space-x-2">
                <span className="text-xs text-secondary">🛶</span>
                <p>
                  <strong>Envío Seguro Corrientes & Todo el País:</strong> Despachamos tus compras aseguradas desde Itá Ibaté por encomienda o correo privado.
                </p>
              </div>

              <button
                id="cart-submit-checkout-btn"
                onClick={onCheckout}
                className="w-full py-4.5 bg-primary hover:bg-primary-container text-white rounded-xl font-display font-extrabold tracking-wide uppercase transition-all flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
              >
                <span>Siguiente Paso</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
