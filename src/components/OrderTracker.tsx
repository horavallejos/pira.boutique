import React, { useState, useEffect } from 'react';
import { User, ClipboardList, Search, Truck, CheckCircle2, Package, ArrowRight, ShieldAlert } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackerProps {
  onSearchOrders: () => Promise<Order[]>;
  initialEmail?: string;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  onSearchOrders,
  initialEmail = 'informatecorrientes@gmail.com',
}) => {
  const [emailQuery, setEmailQuery] = useState(initialEmail);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const fetchUserOrders = async () => {
    if (!emailQuery.trim()) {
      setError('Por favor ingresá un correo o número de WhatsApp válido.');
      return;
    }

    setError('');
    setIsLoading(true);
    setHasSearched(true);

    try {
      const allOrders = await onSearchOrders();
      // Match either email or phone (ignoring spaces)
      const cleanQuery = emailQuery.toLowerCase().replace(/\s+/g, '');
      const filtered = allOrders.filter(o => 
        o.customerEmail.toLowerCase().includes(cleanQuery) || 
        o.customerWhatsapp.replace(/\s+/g, '').includes(cleanQuery)
      );

      setOrders(filtered);
    } catch (err: any) {
      setError('Hubo un inconveniente al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto search if initialEmail exists on mount
  useEffect(() => {
    if (initialEmail) {
      fetchUserOrders();
    }
  }, []);

  return (
    <div className="space-y-6" id="tracker-body">
      
      {/* Top Welcome Title */}
      <div className="bg-surface-container border border-outline-variant p-6 rounded-3xl" id="tracker-jumbo">
        <h2 className="font-display font-black text-xl md:text-2xl text-on-surface">
          Seguimiento de Mi Pedido 🛶
        </h2>
        <p className="text-xs text-on-surface-variant max-w-xl mt-1.5 leading-relaxed">
          Ingresá el correo electrónico o número de WhatsApp que indicaste al momento de realizar tu compra para consultar las guías de despacho y los estados de transporte en tiempo real.
        </p>
      </div>

      {/* Lookup Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-2xl shadow-sm space-y-3" id="tracker-input-box">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-3.5 text-xs text-on-surface-variant">✉️</span>
            <input
              type="text"
              value={emailQuery}
              onChange={(e) => setEmailQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-3 rounded-xl border border-outline bg-surface-container-low text-xs font-semibold focus:outline-primary placeholder:text-outline-variant"
              placeholder="Ej. informatecorrientes@gmail.com o +54 9 379 1234567"
            />
          </div>
          <button
            onClick={fetchUserOrders}
            disabled={isLoading}
            className="px-6 py-3 bg-primary hover:bg-primary-container text-white text-xs font-display font-extrabold uppercase rounded-xl transition-all flex items-center justify-center space-x-2 shadow"
            id="tracker-lookup-btn"
          >
            <Search className="h-4 w-4" />
            <span>{isLoading ? 'Buscando...' : 'Buscar Pedidos'}</span>
          </button>
        </div>

        {error && (
          <p className="text-xs text-error font-semibold" id="tracker-error-alert">
            ⚠️ {error}
          </p>
        )}
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="py-12 flex flex-col items-center justify-center space-y-2" id="tracker-loading-state">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-on-surface-variant">Buscando envíos activos en base de datos...</p>
        </div>
      )}

      {/* Search results */}
      {hasSearched && !isLoading && (
        <div className="space-y-6" id="tracker-results-list">
          {orders.length === 0 ? (
            <div className="border border-outline-variant/60 bg-surface-container-low p-10 rounded-2xl text-center space-y-3">
              <div className="h-12 w-12 bg-surface-container-high rounded-full flex items-center justify-center text-on-surface-variant/40 mx-auto">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-sm text-on-surface">No se encontraron pedidos</h3>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                No pudimos localizar compras vinculadas a <strong>"{emailQuery}"</strong>. Probá usando otro número de WhatsApp o correo electrónico alternativo.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              // Status steps evaluation
              const stepIndex = 
                order.status === 'Pendiente' ? 1 : 
                order.status === 'En Tránsito' ? 2 : 
                order.status === 'Entregado' ? 3 : 0; // Cancelled represents 0

              return (
                <div 
                  key={order.id} 
                  className="bg-surface-container-lowest border border-outline-variant p-5 rounded-2xl shadow-sm space-y-5 transition-all hover:shadow-md"
                  id={`matched-order-card-${order.id}`}
                >
                  
                  {/* Card title bar */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-3 border-b border-outline-variant/60 gap-3">
                    <div>
                      <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold">
                        Guía {order.id}
                      </span>
                      <p className="text-[11px] text-on-surface-variant mt-1 font-semibold">
                        Registrado: {new Date(order.createdAt).toLocaleDateString('es-AR')} a las {new Date(order.createdAt).toLocaleTimeString('es-AR', {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-on-surface-variant">Monto Total:</span>
                      <span className="font-display font-black text-sm text-primary">
                        ${order.total.toLocaleString('es-AR')} ARS
                      </span>
                    </div>
                  </div>

                  {/* High fidelity delivery steps milestones maps */}
                  {order.status !== 'Cancelado' ? (
                    <div className="py-4 px-2" id="order-milestones-track">
                      <div className="relative flex items-center justify-between w-full">
                        {/* Connecting track line */}
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-surface-container-high -z-0" />
                        <div 
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-tertiary transition-all duration-500 -z-0" 
                          style={{ width: `${((stepIndex - 1) / 2) * 100}%` }}
                        />

                        {/* Step 1: Recibido */}
                        <div className="flex flex-col items-center text-center relative z-10">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                            stepIndex >= 1 ? 'bg-tertiary text-white ring-4 ring-tertiary/10' : 'bg-surface-container text-on-surface-variant/50 border'
                          }`}>
                            <Package className="h-4.5 w-4.5" />
                          </div>
                          <span className="text-[10px] font-bold mt-1 text-on-surface">Recibido</span>
                          <span className="text-[8px] text-on-surface-variant hidden sm:inline">Pedido Procesado</span>
                        </div>

                        {/* Step 2: En Tránsito */}
                        <div className="flex flex-col items-center text-center relative z-10">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                            stepIndex >= 2 ? 'bg-tertiary text-white ring-4 ring-tertiary/10' : 'bg-surface-container text-on-surface-variant/50 border'
                          }`}>
                            <Truck className="h-4.5 w-4.5" />
                          </div>
                          <span className="text-[10px] font-bold mt-1 text-on-surface">En Tránsito</span>
                          <span className="text-[8px] text-on-surface-variant hidden sm:inline">Despachado de Itá Ibaté</span>
                        </div>

                        {/* Step 3: Entregado */}
                        <div className="flex flex-col items-center text-center relative z-10">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                            stepIndex >= 3 ? 'bg-tertiary text-white ring-4 ring-tertiary/10' : 'bg-surface-container text-on-surface-variant/50 border'
                          }`}>
                            <CheckCircle2 className="h-4.5 w-4.5" />
                          </div>
                          <span className="text-[10px] font-bold mt-1 text-on-surface">Entregado</span>
                          <span className="text-[8px] text-on-surface-variant hidden sm:inline font-medium">Llegó a Destino</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-error-container/20 border border-error/20 p-3 rounded-xl flex items-center space-x-2 text-xs text-on-error-container">
                      <span className="text-base text-red-650">❌</span>
                      <p>Este pedido se encuentra clasificado como <strong>Cancelado</strong>. Contactate para reembolsos.</p>
                    </div>
                  )}

                  {/* Summary grid list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 text-xs bg-surface-container-low p-4 rounded-xl border border-outline-variant/40" id="order-tracker-particulars">
                    <div className="space-y-1.5">
                      <p className="font-bold text-on-surface uppercase tracking-wider text-[10px] text-secondary">
                        Información de Despacho:
                      </p>
                      <p className="text-on-surface-variant">
                        <strong>Destinatario:</strong> {order.customerName}
                      </p>
                      <p className="text-on-surface-variant">
                        <strong>Dirección:</strong> {order.shippingAddress}, {order.shippingCity} ({order.shippingProvincia.toUpperCase()}, CP: {order.shippingCp})
                      </p>
                      {order.shippingNotes && (
                        <p className="text-on-surface-variant italic">
                          <strong>Notas:</strong> "{order.shippingNotes}"
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <p className="font-bold text-on-surface uppercase tracking-wider text-[10px] text-secondary">
                        Artículos del Envío:
                      </p>
                      <div className="space-y-1">
                        {order.items.map((it, itIdx) => (
                          <div key={itIdx} className="flex justify-between items-center py-0.5 border-b border-outline-variant/30 text-[11px]">
                            <span className="font-medium text-on-surface-variant">
                              {it.quantity}x {it.productName} {it.selectedModel ? `[${it.selectedModel}]` : ''}
                            </span>
                            <span className="font-bold text-on-surface">
                              ${(it.price * it.quantity).toLocaleString('es-AR')} ARS
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between pt-2 border-t font-semibold text-on-surface">
                        <span>Envío:</span>
                        <span>{order.shippingPrice === 0 ? 'Gratuito (Provincial)' : `$${order.shippingPrice.toLocaleString('es-AR')} ARS`}</span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
};
