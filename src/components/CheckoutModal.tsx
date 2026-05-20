import React, { useState } from 'react';
import { X, MapPin, Phone, Mail, ShoppingBag, CreditCard, CheckCircle2, Send, ChevronRight } from 'lucide-react';
import { CartItem, Order, Friend } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderCompleted: (order: Order) => void;
  onClearCart: () => void;
  loggedFriend?: Friend | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderCompleted,
  onClearCart,
  loggedFriend,
}) => {
  const [formData, setFormData] = useState({
    name: loggedFriend?.name || 'Alejandro Corrientes',
    whatsapp: loggedFriend?.whatsapp || '+54 9 379 1234567',
    email: loggedFriend?.email || 'informatecorrientes@gmail.com',
    address: loggedFriend?.address || 'Ruta Nacional 12, Km 1180',
    city: loggedFriend?.city || 'Itá Ibaté',
    provincia: loggedFriend?.provincia || 'corrientes',
    cp: loggedFriend?.cp || '3480',
    notes: '',
  });

  // Synced profile data on load
  React.useEffect(() => {
    if (isOpen && loggedFriend) {
      setFormData({
        name: loggedFriend.name || '',
        whatsapp: loggedFriend.whatsapp || '',
        email: loggedFriend.email || '',
        address: loggedFriend.address || '',
        city: loggedFriend.city || 'Itá Ibaté',
        provincia: loggedFriend.provincia || 'corrientes',
        cp: loggedFriend.cp || '3480',
        notes: '',
      });
    }
  }, [isOpen, loggedFriend]);

  const [step, setStep] = useState<1 | 2>(1); // 1: Form, 2: Final Ticket Confirmation
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const isWholesale = loggedFriend?.isMayorista || (loggedFriend?.points || 0) >= 500;

  const getProductPrice = (price: number) => {
    return isWholesale ? Math.round(price * 0.65) : price;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + getProductPrice(item.product.price) * item.quantity, 0);
  
  // Free shipping inside Corrientes province! Standard $8,500 ARS elsewhere.
  const shippingPrice = formData.provincia.toLowerCase() === 'corrientes' ? 0 : 8500;
  const total = subtotal + shippingPrice;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp || !formData.email || !formData.address || !formData.city || !formData.cp) {
      setError('Por favor completa todos los campos requeridos (*).');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const dbFormatItems = cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: getProductPrice(item.product.price),
        selectedModel: item.selectedModel,
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerWhatsapp: formData.whatsapp,
          customerEmail: formData.email,
          shippingAddress: formData.address,
          shippingCity: formData.city,
          shippingProvincia: formData.provincia,
          shippingCp: formData.cp,
          shippingNotes: formData.notes,
          items: dbFormatItems,
          subtotal,
          shippingPrice,
          total,
        }),
      });

      if (!res.ok) {
        throw new Error('No se pudo procesar el pedido en el servidor');
      }

      const responseData = await res.json();
      if (responseData.success && responseData.order) {
        // Automatically save to "Miembros / Cofradía" also!
        await fetch('/api/friends', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, whatsapp: formData.whatsapp }),
        }).catch(() => {}); // silent fail is ok here

        setCreatedOrder(responseData.order);
        setStep(2);
        onClearCart();
      } else {
        throw new Error('La respuesta del servidor fue inválida');
      }
    } catch (err: any) {
      setError(err.message || 'Error en el servidor al enviar el pedido.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate WhatsApp message with link
  const getWhatsAppShareLink = () => {
    if (!createdOrder) return '#';
    
    let messageText = `*PIRÁ PARÁ - NUEVO PEDIDO ${createdOrder.id}* 🛶\n\n`;
    messageText += `*Cliente:* ${createdOrder.customerName}\n`;
    messageText += `*WhatsApp:* ${createdOrder.customerWhatsapp}\n`;
    messageText += `*Email:* ${createdOrder.customerEmail}\n\n`;
    messageText += `*Dirección de Envío:*\n`;
    messageText += `${createdOrder.shippingAddress}, ${createdOrder.shippingCity}, ${createdOrder.shippingProvincia.toUpperCase()} (CP: ${createdOrder.shippingCp})\n`;
    if (createdOrder.shippingNotes) {
      messageText += `*Notas:* _${createdOrder.shippingNotes}_\n`;
    }
    
    messageText += `\n*DETALLES DE PRODUCTOS:*\n`;
    createdOrder.items.forEach((item) => {
      messageText += `• ${item.quantity}x ${item.productName}${item.selectedModel ? ` [Modelo: ${item.selectedModel}]` : ''} - $${(item.price * item.quantity).toLocaleString('es-AR')} ARS\n`;
    });

    messageText += `\n*Subtotal:* $${createdOrder.subtotal.toLocaleString('es-AR')} ARS\n`;
    messageText += `*Envío:* ${createdOrder.shippingPrice === 0 ? 'BONIFICADO (Corrientes)' : `$${createdOrder.shippingPrice.toLocaleString('es-AR')} ARS`}\n`;
    messageText += `*TOTAL A PAGAR:* $${createdOrder.total.toLocaleString('es-AR')} ARS\n\n`;
    messageText += `_Por favor, confírmenme el alias de pago para realizar la transferencia. Muchas gracias!_`;

    const encoded = encodeURIComponent(messageText);
    return `https://wa.me/5493791234567?text=${encoded}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="checkout-modal-portal">
      <div className="bg-surface text-on-surface border border-outline-variant/80 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]" id="checkout-container">
        
        {/* Header control */}
        <div className="px-6 py-4.5 bg-surface-container border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <span className="font-display font-black text-base text-on-surface">
              {step === 1 ? 'Iniciar Pedido & Envío' : '¡Pedido Confirmado con Éxito!'}
            </span>
          </div>
          <button
            onClick={() => {
              if (step === 2 && createdOrder) {
                onOrderCompleted(createdOrder);
              }
              onClose();
            }}
            className="p-1 px-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all"
            id="checkout-close-btn"
          >
            <X className="h-5.5 w-5.5" />
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-5" id="checkout-form-body">
            {error && (
              <div className="bg-error-container text-on-error-container p-3.5 rounded-xl border border-error/20 text-xs font-semibold" id="checkout-error-msg">
                {error}
              </div>
            )}

            {/* Form Fields layout grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase flex items-center">
                  Nombre Completo <span className="text-primary ml-0.5">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-3 pr-3 py-2.5 rounded-xl border border-outline bg-surface-container-lowest text-sm focus:outline-primary placeholder:text-outline-variant"
                    placeholder="Ej. Alejandro Corrientes"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase flex items-center">
                  Número de WhatsApp <span className="text-primary ml-0.5">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-on-surface-variant font-medium">📬</span>
                  <input
                    type="tel"
                    name="whatsapp"
                    required
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-outline bg-surface-container-lowest text-sm focus:outline-primary placeholder:text-outline-variant"
                    placeholder="Ej. +54 9 379 1234567"
                  />
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase flex items-center">
                  Correo Electrónico <span className="text-primary ml-0.5">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline bg-surface-container-lowest text-sm focus:outline-primary placeholder:text-outline-variant"
                  placeholder="Ej. mi-correo@gmail.com"
                />
              </div>

              <div className="col-span-1 md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase flex items-center">
                  Calle y Altura (Dirección de Entrega) <span className="text-primary ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline bg-surface-container-lowest text-sm focus:outline-primary placeholder:text-outline-variant"
                  placeholder="Ej. Av. San Martín 1540"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase flex items-center">
                  Ciudad / Localidad <span className="text-primary ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline bg-surface-container-lowest text-sm focus:outline-primary placeholder:text-outline-variant"
                  placeholder="Ej. Itá Ibaté"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase">
                    Provincia <span className="text-primary">*</span>
                  </label>
                  <select
                    name="provincia"
                    value={formData.provincia}
                    onChange={handleInputChange}
                    className="w-full px-2 py-2.5 rounded-xl border border-outline bg-surface-container-lowest text-sm focus:outline-primary"
                  >
                    <option value="corrientes">Corrientes</option>
                    <option value="chaco">Chaco</option>
                    <option value="misiones">Misiones</option>
                    <option value="santa_fe">Santa Fe</option>
                    <option value="entre_rios">Entre Ríos</option>
                    <option value="buenos_aires">Buenos Aires</option>
                    <option value="otra">Otra Provincia</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase">
                    Cod. Postal <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="cp"
                    required
                    value={formData.cp}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-surface-container-lowest text-sm focus:outline-primary"
                    placeholder="3480"
                  />
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase">
                  Instrucciones de Despacho (Opcional)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-outline bg-surface-container-lowest text-sm focus:outline-primary"
                  placeholder="Ej: Dejar en portería, avisar antes de llegar..."
                />
              </div>
            </div>

            {/* Free Shipping Highlight bar */}
            {formData.provincia.toLowerCase() === 'corrientes' ? (
              <div className="bg-tertiary/10 border border-tertiary/30 p-2.5 rounded-xl text-xs text-on-surface-variant flex items-center space-x-2">
                <span className="text-base text-tertiary font-bold">🛶</span>
                <span>
                  <strong>¡Envío Bonificado!</strong> Como vivís en la provincia de Corrientes, tu envío es totalmente gratis.
                </span>
              </div>
            ) : (
              <div className="bg-secondary/10 border border-secondary/30 p-2.5 rounded-xl text-xs text-on-surface-variant flex items-center space-x-2">
                <span className="text-base text-secondary font-bold">🚛</span>
                <span>
                  Envío interprovincial estándar: <strong>$8.500 ARS</strong>.
                </span>
              </div>
            )}

            {/* Side-box containing invoice review of elements */}
            <div className="border border-outline-variant p-4 rounded-2xl bg-surface-container-low space-y-3">
              <h3 className="font-display text-xs font-extrabold text-on-surface uppercase tracking-wider">
                Resumen de Productos
              </h3>
              <div className="max-h-[140px] overflow-y-auto space-y-2 pr-1 no-scrollbar">
                {cartItems.map((item, idx) => (
                  <div key={`${item.product.id}-${idx}`} className="flex justify-between items-center text-xs text-on-surface-variant py-0.5 border-b border-outline-variant/30">
                    <span className="line-clamp-1 max-w-[70%]">
                      {item.quantity}x {item.product.name} {item.selectedModel ? `(${item.selectedModel})` : ''}
                    </span>
                    <span className="font-bold text-on-surface">
                      ${(getProductPrice(item.product.price) * item.quantity).toLocaleString('es-AR')} ARS
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-xs flex justify-between">
                <span className="text-on-surface-variant">Subtotal de Compra:</span>
                <span className="font-bold text-on-surface">${subtotal.toLocaleString('es-AR')} ARS</span>
              </div>
              <div className="text-xs flex justify-between">
                <span className="text-on-surface-variant">Costo de Envío:</span>
                <span className="font-bold text-on-surface">
                  {shippingPrice === 0 ? 'Gratis' : `$${shippingPrice.toLocaleString('es-AR')} ARS`}
                </span>
              </div>
              <div className="pt-2.5 border-t border-outline-variant flex justify-between items-end">
                <span className="font-display font-black text-sm text-on-surface uppercase">Monto Total:</span>
                <span className="font-display font-black text-lg text-primary">
                  ${total.toLocaleString('es-AR')} ARS
                </span>
              </div>
            </div>

            {/* Submit button bar */}
            <div className="flex space-x-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-outline text-on-surface font-semibold text-xs rounded-xl hover:bg-surface-container transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-primary text-white font-display font-extrabold uppercase text-xs rounded-xl shadow-md hover:bg-primary-container transition-all flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation details */
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-6" id="checkout-success-body">
            <div className="h-20 w-20 bg-tertiary/20 rounded-full flex items-center justify-center text-tertiary ring-8 ring-tertiary/10 animate-pulse">
              <CheckCircle2 className="h-12 w-12" />
            </div>

            <div>
              <p className="font-sans text-xs bg-tertiary/10 text-tertiary font-bold tracking-widest uppercase px-3.5 py-1 rounded-full inline-block">
                Compra exitosa
              </p>
              <h2 className="font-display font-extrabold text-2xl text-on-surface mt-3">
                Pedido Registrado con Éxito
              </h2>
              <p className="text-sm font-black text-secondary mt-1">
                Serie de Control: {createdOrder?.id}
              </p>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto mt-2">
                Cargamos el pedido a nombre de <strong>{createdOrder?.customerName}</strong>. Podés hacerle un seguimiento instantáneo desde la sección <strong>Mis Pedidos</strong> con tu correo electrónico.
              </p>
            </div>

            {/* Custom summary invoice receipt table */}
            <div className="w-full max-w-md border border-outline-variant rounded-2xl bg-surface-container p-4.5 text-left text-xs space-y-2">
              <p className="font-bold text-on-surface border-b pb-2 mb-2 text-center uppercase tracking-wider">
                Resumen de Facturación
              </p>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Cliente:</span>
                <span className="font-semibold">{createdOrder?.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Teléfono / WhatsApp:</span>
                <span className="font-semibold">{createdOrder?.customerWhatsapp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Destino:</span>
                <span className="font-semibold text-right max-w-[70%] line-clamp-1">{createdOrder?.shippingAddress}, {createdOrder?.shippingCity}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-outline-variant/60">
                <span className="font-extrabold">Monto Abonado:</span>
                <span className="font-extrabold text-primary">${createdOrder?.total.toLocaleString('es-AR')} ARS</span>
              </div>
            </div>

            {/* Cofradía Amigo registration banner and message triggers */}
            <div className="bg-secondary-container/20 border border-secondary-container/80 p-4 rounded-2xl max-w-md">
              <p className="text-xs text-on-surface-variant font-medium">
                🤝 <strong>Amigo de la Cofradía:</strong> Guardamos tu número de contacto. Ahora tendrás prioridad de pique, precios exclusivos e invitaciones especiales en Itá Ibaté.
              </p>
            </div>

            <div className="w-full max-w-md flex flex-col space-y-3.5">
              <a
                href={getWhatsAppShareLink()}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 bg-emerald-650 hover:bg-emerald-700 bg-[#25D366] text-white rounded-xl font-display font-extrabold tracking-wide uppercase transition-all flex items-center justify-center space-x-2 shadow-md hover:shadow-lg text-sm"
              >
                <Send className="h-4.5 w-4.5" />
                <span>Enviar Pedido por WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  if (createdOrder) {
                    onOrderCompleted(createdOrder);
                  }
                  onClose();
                }}
                className="w-full py-3 border border-outline hover:bg-surface-container text-on-surface font-semibold text-xs rounded-xl transition-colors"
                id="checkout-all-done-btn"
              >
                Volver al Catálogo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
