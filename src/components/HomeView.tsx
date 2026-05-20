import React from 'react';
import { 
  Compass, Gift, Sparkles, Flame, Zap, Award, 
  MessageCircle, Anchor, Calendar, ArrowRight, ShieldCheck, Star 
} from 'lucide-react';
import { Product } from '../types';

interface HomeViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onChangeTab: (tab: 'home' | 'nosotros' | 'catalog' | 'tracker' | 'contact' | 'login' | 'admin') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onSelectProduct,
  onChangeTab,
}) => {
  // Extract 4 features (prefer products with originalPrice, tags containing Oferta or first 4 available)
  const promoProducts = products
    .filter(p => p.originalPrice || p.tag?.toLowerCase().includes('oferta') || p.tag?.toLowerCase().includes('precio amigo'))
    .slice(0, 4);

  // Fallback if none has originalPrice, just take first 4 products
  const finalPromos = promoProducts.length >= 4 ? promoProducts : products.slice(0, 4);

  // Slideshow items containing high-resolution nature and outdoor gear photography
  const slides = [
    {
      id: 0,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200",
      badge: "🌅 AMANECER CORRENTINO",
      title: "Pirá Pará Boutique",
      subtitle: "Boutique especializada de Pesca y Camping en Itá Ibaté. Equipamientos premium seleccionados y testeados en directo por guías nativos del Alto Paraná.",
      actionText: "Ver Catálogo de Artículos 🎣",
      tab: 'catalog' as const
    },
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200",
      badge: "⛺ EQUIPOS DE AVENTURA Y CAMPING",
      title: "Fogones, Refugios y Conservación",
      subtitle: "Material térmico, bolsas de dormir profesionales e insumos robustos para aguantar las inolvidables noches del litoral correntino.",
      actionText: "Explorar Línea Camping 🏕️",
      tab: 'catalog' as const
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1517462964-21fdcec3f25b?q=80&w=1205",
      badge: "🛠️ TALLER TÉCNICO OFICIAL",
      title: "Mantenimiento Shimano DC",
      subtitle: "Único servicio técnico con calibrado fino, limpieza de rulemanes por ultrasonido y recambio de repuestos originales Shimano en la costa.",
      actionText: "Conocé Nuestro Taller ⚙️",
      tab: 'nosotros' as const
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1505533338688-f59cd91f2db4?q=80&w=1200",
      badge: "🎁 COMUNIDAD MÁXIMA COFRADÍA",
      title: "Unite en Menos de un Minuto",
      subtitle: "Registrate en la Cofradía con tu celular o email. Te regalamos 150 puntos de bienvenida para gozar de tarifas PRO de inmediato.",
      actionText: "Sumarme a la Cofradía 🛶",
      tab: 'login' as const
    }
  ];

  const [activeSlide, setActiveSlide] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // 4 Novedades
  const novedades = [
    {
      id: "n1",
      badge: "🌊 ESTADO DEL RÍO",
      title: "Pique de Gigantes en Itá Ibaté",
      desc: "El río Paraná registra una altura óptima de 2.85 metros. Se reportan capturas históricas de Dorados que superan los 18 kilos en la modalidad Baitcast y en deriva con morena mamacha. ¡Las correderas rocosas están que hierven!",
      date: "Hoy",
      icon: Anchor,
      color: "border-blue-500/25 bg-blue-500/5 text-blue-700"
    },
    {
      id: "n2",
      badge: "⚙️ TALLER OFICIAL",
      title: "Doble Calibrado del Freno Digital",
      desc: "Traé tu reel Shimano DC (Curado, SLX, Scorpion o Metanium) a nuestro muelle técnico. Limpiamos el inducido magnético y calibramos el sensor para evitar galletas en lanzamientos extremos contra el viento sur de Corrientes.",
      date: "Ayer",
      icon: Award,
      color: "border-amber-500/25 bg-amber-500/5 text-[#80561f]"
    },
    {
      id: "n3",
      badge: "🎣 ARRIBOS DE STOCK",
      title: "Señuelos Alfers Tallados a Mano",
      desc: "Recibimos apenas 20 unidades del mítico Alfers color 'Cardenal' con paleta de policarbonato Nro 3. Es el señuelo más letal para trolling lento sobre las restingas de piedra del Alto Paraná. ¡Volá porque se agotan!",
      date: "Esta semana",
      icon: Sparkles,
      color: "border-purple-500/25 bg-purple-500/5 text-purple-700"
    },
    {
      id: "n4",
      badge: "✏️ REQUISITO OBLIGATORIO",
      title: "Licencias de Pesca Corrientes 2026",
      desc: "Emitimos e imprimimos tu Licencia de Pesca Deportiva oficial de Recursos Naturales de Corrientes en el acto. Traé tu DNI, te gestionamos la habilitación por 1, 3 o 365 días en 5 minutos para subir legal al bote.",
      date: "Vigente",
      icon: ShieldCheck,
      color: "border-emerald-500/25 bg-emerald-500/5 text-emerald-700"
    }
  ];

  return (
    <div className="space-y-12" id="home-view-container">
      
      {/* Interactive Automatic/Manual Landscape Slideshow Hero Banner */}
      <div 
        className="relative rounded-3xl overflow-hidden bg-zinc-950 border border-outline-variant shadow-2xl h-[400px] sm:h-[450px] flex items-center"
        id="home-slideshow-hero"
      >
        {/* Render background images with crossfade opacity transitions */}
        {slides.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              idx === activeSlide ? 'opacity-40 scale-100 z-0' : 'opacity-0 scale-105 z-[-1]'
            }`}
          >
            <img
              referrerPolicy="no-referrer"
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          </div>
        ))}

        {/* Dynamic Warm Left-to-Right Shading overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-900/60 to-transparent pointer-events-none z-10" />

        {/* Content Box Overlays */}
        <div className="relative z-20 w-full px-6 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-xl text-white">
            <div className="inline-flex items-center space-x-1.5 bg-[#80561f]/40 border border-[#80561f]/60 text-yellow-300 font-bold px-3 py-1 rounded-full text-[9px] uppercase tracking-wider">
              <Flame className="h-3 w-3 text-orange-400 animate-pulse" />
              <span>{slides[activeSlide].badge}</span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-4xl md:text-5xl leading-tight text-white tracking-tight min-h-[40px] sm:min-h-[90px] flex items-center">
              {slides[activeSlide].title}
            </h2>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-lg min-h-[40px]">
              {slides[activeSlide].subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onChangeTab(slides[activeSlide].tab)}
                className="px-5 py-3 bg-primary hover:bg-primary-container text-white text-xs font-display font-black uppercase rounded-xl transition-all shadow flex items-center space-x-2 cursor-pointer border-none outline-none"
              >
                <span>{slides[activeSlide].actionText}</span>
                <Compass className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Floater Right Indicators widget */}
          <div className="hidden md:block w-72 bg-stone-950/70 border border-stone-800/80 p-5 rounded-2xl text-white space-y-3.5 shadow-2xl">
            <p className="text-[10px] text-[#fdc483] font-bold tracking-widest uppercase">
              Pirá Pará • Boutique Outdoor
            </p>
            <div className="space-y-1.5 text-xs text-stone-200">
              <p>✔ Envíos Asegurados a todo el país</p>
              <p>✔ Asesoramiento lancheros expertos</p>
              <p>✔ Beneficio Amigo en cada compra</p>
            </div>

            {/* Pagination Bullet Indicators */}
            <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
              <span className="text-[8px] text-stone-400 font-mono tracking-wider font-extrabold uppercase">MUELLE DE NAVEGACIÓN</span>
              <div className="flex space-x-1.5">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 rounded-full transition-all outline-none cursor-pointer ${
                      idx === activeSlide ? 'w-5 bg-primary' : 'w-2 bg-stone-600 hover:bg-stone-500'
                    }`}
                    aria-label={`Slick banner ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Arrow Navigation buttons */}
        <button
          onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white hover:text-yellow-400 p-2.5 rounded-full z-30 transition-colors hidden sm:block cursor-pointer border border-stone-800 outline-none font-bold"
          aria-label="Anterior"
        >
          ❮
        </button>
        <button
          onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white hover:text-yellow-400 p-2.5 rounded-full z-30 transition-colors hidden sm:block cursor-pointer border border-stone-800 outline-none font-bold"
          aria-label="Siguiente"
        >
          ❯
        </button>

      </div>

      {/* NOVEDADES SECTION (4) */}
      <div className="space-y-6" id="home-novedades-wrapper">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-outline-variant pb-3">
          <div>
            <h3 className="font-display font-black text-[#7f2225] text-sm uppercase tracking-widest">
              Novedades del Litoral (4)
            </h3>
            <p className="text-xs text-on-surface-variant">El reporte más fresco sobre aguas, pique, regulaciones y talleres.</p>
          </div>
          <span className="text-[10px] bg-primary/10 text-primary border border-primary/25 font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            Actualizado en Directo 🛶
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="home-novedades-grid">
          {novedades.map((nov) => {
            const IconComponent = nov.icon;
            return (
              <div 
                key={nov.id}
                className={`border rounded-2xl p-5 hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${nov.color}`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black font-display tracking-widest uppercase">
                      {nov.badge}
                    </span>
                    <span className="text-[9px] font-mono opacity-80 flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{nov.date}</span>
                    </span>
                  </div>
                  
                  <h4 className="font-display font-black text-sm text-on-surface leading-snug">
                    {nov.title}
                  </h4>
                  
                  <p className="text-[11.5px] leading-relaxed text-on-surface-variant">
                    {nov.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#80561f] flex items-center space-x-1">
                    <IconComponent className="h-3.5 w-3.5" />
                    <span>Muelle Pirá Pará Itá Ibaté</span>
                  </span>
                  <button 
                    onClick={() => onChangeTab('contact')}
                    className="text-primary hover:underline flex items-center space-x-0.5"
                  >
                    <span>Consultar</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FEATURING COMMERCE CARDS (4 cards de ofertas/artículos más vendidos) */}
      <div className="space-y-6" id="home-deals-wrapper">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
          <div>
            <h3 className="font-display font-black text-[#7f2225] text-sm uppercase tracking-widest flex items-center space-x-1">
              <Gift className="h-4.5 w-4.5 text-primary" />
              <span>Ofertas y Recomendados de Muelle (4)</span>
            </h3>
            <p className="text-xs text-on-surface-variant">Ahorrá con el precio amigo de la Cofradía en las mejores marcas.</p>
          </div>
          <button
            onClick={() => onChangeTab('catalog')}
            className="text-xs font-bold text-primary hover:underline hover:text-primary-container flex items-center space-x-1"
          >
            <span>Ver Todo el Stock</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="home-featured-grid">
          {finalPromos.map((p) => {
            const hasOrigPrice = p.originalPrice && p.originalPrice > p.price;
            const discountPercentage = hasOrigPrice 
              ? Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100) 
              : 15; // default simulated cofradía discount

            return (
              <div 
                key={p.id}
                className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative hover:-translate-y-0.5"
                id={`home-product-card-${p.id}`}
              >
                
                {/* Discount Badge */}
                <div className="absolute top-2.5 left-2.5 z-10 bg-[#7f2225] text-white text-[9px] font-display font-black px-2 py-0.5 rounded-lg uppercase shadow-xs">
                  -{discountPercentage}% AMIGO
                </div>

                {/* Card Image */}
                <div 
                  onClick={() => onSelectProduct(p)}
                  className="bg-surface-container-low h-[160px] flex items-center justify-center p-3 cursor-pointer relative"
                >
                  <img
                    referrerPolicy="no-referrer"
                    src={p.image || undefined}
                    alt={p.name}
                    className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-all duration-300 drop-shadow-sm"
                  />
                  {p.tag && (
                    <span className="absolute bottom-2 right-2 bg-yellow-500 text-stone-950 text-[8px] font-black font-display tracking-wider px-2 py-0.5 rounded uppercase">
                      {p.tag}
                    </span>
                  )}
                </div>

                {/* Card Info */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3" id={`home-product-body-${p.id}`}>
                  <div className="space-y-1">
                    <span className="text-[8px] font-extrabold uppercase text-[#80561f] tracking-widest block">
                      {p.category}
                    </span>
                    <h4 
                      onClick={() => onSelectProduct(p)}
                      className="font-display font-black text-xs text-on-surface leading-tight line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                    >
                      {p.name}
                    </h4>
                    
                    {/* Stars */}
                    <div className="flex items-center space-x-0.5 text-amber-500 pt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < (p.rating || 5) ? 'fill-amber-500' : 'text-stone-300'}`} />
                      ))}
                      <span className="text-[9px] text-on-surface-variant font-mono ml-1">({p.reviewCount || 10})</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-outline-variant/60 flex items-center justify-between" id={`home-product-footer-${p.id}`}>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-on-surface-variant/70 line-through">
                        ${(p.originalPrice || Math.round(p.price * 1.25)).toLocaleString('es-AR')}
                      </span>
                      <span className="text-xs font-display font-black text-[#7f2225]">
                        ${p.price.toLocaleString('es-AR')} ARS
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectProduct(p)}
                      className="px-2.5 py-1.5 bg-primary hover:bg-primary-container text-white text-[9px] font-display font-black uppercase rounded-lg transition-all"
                    >
                      Ver Detalle
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Floating CTA Banner */}
      <div className="border border-[#fdc483]/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5 text-left">
          <div className="h-10 w-10 bg-[#fdc483]/20 rounded-2xl flex items-center justify-center text-primary">
            <Zap className="h-5.5 w-5.5 text-[#80561f]" />
          </div>
          <div>
            <h4 className="font-display font-black text-sm text-[orange-700] uppercase tracking-wide">
              ¿Pasión por el Paraná? 🛶
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Iniciá sesión con tu número de WhatsApp para ver tus ofertas exclusivas, puntos acreditados e historial de pedidos en tiempo real.
            </p>
          </div>
        </div>
        <button
          onClick={() => onChangeTab('login')}
          className="px-6 py-2.5 bg-zinc-900 text-amber-400 font-display font-black uppercase tracking-wider text-xs rounded-xl hover:bg-zinc-800 transition-all shadow-sm flex-shrink-0"
        >
          Ir a Mi Cuenta Cofradía
        </button>
      </div>

    </div>
  );
};
