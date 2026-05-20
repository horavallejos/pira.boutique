import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingCart, CheckCircle, Flame, ShieldAlert } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedModel?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [activeImage, setActiveImage] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Monitor product changes to reset image and defaults
  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setQuantity(1);
      setAddedFeedback(false);

      if (product.modelOptions && product.modelOptions.length > 0) {
        // Find first option that is not marked as out of stock if possible
        const defaultOpt = product.modelOptions.find(opt => !opt.toLowerCase().includes('sin stock')) || product.modelOptions[0];
        setSelectedModel(defaultOpt);
      } else {
        setSelectedModel('');
      }
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAddToCartClick = () => {
    if (product.stockStatus === 'OutOfStock') return;
    
    // Check if selected option is disabled
    if (selectedModel && selectedModel.toLowerCase().includes('sin stock')) {
      alert('Esta variante seleccionada se encuentra sin stock actualmente.');
      return;
    }

    onAddToCart(product, quantity, selectedModel || undefined);
    setAddedFeedback(true);
    
    // Auto-reset feedback
    setTimeout(() => {
      setAddedFeedback(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="pdp-modal-portal">
      <div className="bg-surface text-on-surface border border-outline-variant/80 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]" id="pdp-container">
        
        {/* Left column: Images Gallery carousel */}
        <div className="w-full md:w-1/2 bg-surface-container p-6 flex flex-col justify-between items-center relative border-r border-outline-variant/60">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-10 md:hidden bg-background text-on-surface p-1.5 rounded-full shadow border"
          >
            <X className="h-5 w-5" />
          </button>

          {product.tag && (
            <span className="absolute top-4 right-4 z-10 bg-primary text-white text-[10px] font-display font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
              {product.tag}
            </span>
          )}

          <div className="flex-1 flex items-center justify-center h-[260px] md:h-[400px] w-full">
            <img
              referrerPolicy="no-referrer"
              src={activeImage || product.image || undefined}
              alt={product.name}
              className="max-h-full max-w-full object-contain rounded-xl drop-shadow-lg transition-all duration-300"
              id="pdp-main-img"
            />
          </div>

          {/* Thumbnails row */}
          {product.thumbnails && product.thumbnails.length > 0 && (
            <div className="flex space-x-2 mt-4 overflow-x-auto py-1 no-scrollbar w-full justify-center" id="pdp-thumbnails-list">
              {product.thumbnails.map((thumbUrl, index) => (
                <button
                  key={`${product.id}-thumb-${index}`}
                  onClick={() => setActiveImage(thumbUrl)}
                  className={`relative h-14 w-14 rounded-lg overflow-hidden bg-background border-2 transition-all flex-shrink-0 ${
                    activeImage === thumbUrl ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-outline-variant hover:border-outline'
                  }`}
                >
                  <img
                    referrerPolicy="no-referrer"
                    src={thumbUrl || undefined}
                    alt={`${product.name} vista ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Details and Options selection */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between max-h-[90vh]" id="pdp-details-panel">
          
          <div className="space-y-4" id="pdp-top-details">
            {/* Header close btn */}
            <div className="hidden md:flex justify-end">
              <button
                onClick={onClose}
                className="p-1 px-1.5 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-colors border"
                id="pdp-desktop-close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Category Breadcrumb */}
            <span className="text-[10px] font-sans font-extrabold uppercase tracking-widest text-[#80561f]">
              {product.category.toUpperCase()}
            </span>

            {/* Product Title heading */}
            <h1 className="font-display font-black text-xl md:text-2xl text-on-surface leading-tight">
              {product.name}
            </h1>

            {/* Star ratings review indicator */}
            <div className="flex items-center space-x-2">
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 fill-current ${
                      i < Math.floor(product.rating || 4.5) ? 'text-amber-500' : 'text-outline-variant'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-on-surface-variant">
                {product.rating || '4.5'} ({product.reviewCount || 10} valoraciones de guías)
              </span>
            </div>

            {/* Prices */}
            <div className="flex items-baseline space-x-3">
              <span className="text-2xl font-display font-black text-primary">
                ${product.price.toLocaleString('es-AR')} ARS
              </span>
              {product.originalPrice && (
                <span className="text-sm text-on-surface-variant line-through">
                  ${product.originalPrice.toLocaleString('es-AR')} ARS
                </span>
              )}
            </div>

            {/* Core Description Prose block */}
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {product.description}
            </p>

            {/* Dropdown Choice for model variants */}
            {product.modelOptions && product.modelOptions.length > 0 && (
              <div className="space-y-1.5" id="pdp-options-selector-box">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center justify-between">
                  <span>Seleccionar Opción / Modelo:</span>
                  <span className="text-[10px] text-secondary font-medium">Recomendado por Pro-Staff</span>
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-outline bg-surface-container-low focus:ring-1 focus:ring-primary focus:outline-none font-medium"
                >
                  {product.modelOptions.map((opt) => (
                    <option key={opt} value={opt} className={opt.toLowerCase().includes('sin stock') ? 'text-on-surface-variant/40' : ''}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Specs technical details bullet summary */}
            {product.specs && product.specs.length > 0 && (
              <div className="pt-3 border-t border-outline-variant space-y-2">
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-on-surface">
                  Detalles Técnicos y Ficha:
                </h3>
                <div className="grid grid-cols-2 gap-2 text-[11px]" id="pdp-specs-grid">
                  {product.specs.map((spec, specIdx) => (
                    <div key={`${spec.name}-${specIdx}`} className="bg-surface-container-high/60 p-2 rounded-lg border border-outline-variant/30">
                      <p className="text-on-surface-variant font-medium">{spec.name}</p>
                      <p className="font-bold text-on-surface">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action buy bars */}
          <div className="pt-6 border-t border-outline-variant space-y-3" id="pdp-action-footer">
            <div className="flex items-center space-x-3">
              {product.stockStatus !== 'OutOfStock' ? (
                <>
                  {/* Selector count */}
                  <div className="flex items-center border border-outline bg-surface-container-low rounded-xl px-2 py-2">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-2 py-1 text-on-surface-variant hover:text-on-surface font-extrabold"
                    >
                      -
                    </button>
                    <span className="px-3 font-display font-black text-sm text-on-surface w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="px-2 py-1 text-on-surface-variant hover:text-on-surface font-extrabold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCartClick}
                    className="flex-1 py-3 bg-primary hover:bg-primary-container text-white font-display font-extrabold uppercase rounded-xl transition-all flex items-center justify-center space-x-2 shadow"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Agregar al Carrito</span>
                  </button>
                </>
              ) : (
                <div className="w-full py-3 bg-surface-container-highest border border-outline-variant text-on-surface-variant font-display font-extrabold uppercase rounded-xl flex items-center justify-center space-x-2 text-xs">
                  <ShieldAlert className="h-4.5 w-4.5" />
                  <span>Sin Stock Temporalmente</span>
                </div>
              )}
            </div>

            {addedFeedback && (
              <div className="bg-tertiary/10 border border-tertiary/20 p-2.5 rounded-xl text-xs text-on-tertiary-container flex items-center justify-center space-x-2 font-semibold">
                <CheckCircle className="h-4.5 w-4.5 text-tertiary" />
                <span>¡Producto agregado al carrito con éxito!</span>
              </div>
            )}

            <div className="flex justify-between text-[10px] text-on-surface-variant/85 italic px-1 pt-1">
              <span>✈ Despacho en 24hs desde Itá Ibaté</span>
              <span>🛡 Garantía oficial de importación</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
