import React from 'react';
import { Anchor, ShieldCheck, Heart, Award, Sparkles, MapPin } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div className="space-y-12" id="about-us-container">
      {/* Immersive Hero Header */}
      <div 
        className="relative h-[280px] rounded-3xl overflow-hidden shadow-lg border border-outline-variant flex items-center bg-stone-900"
        id="about-hero"
      >
        <img
          referrerPolicy="no-referrer"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfXFT6wR0jzemdmWw4pAk1Nz6MhNjWIhbWj1twzWkbag-8LWKsuF4Rqah89F2_Y9kpfx9vboMVH_qDr4W6-3d9atC6YyRZM2_Q-mmc36Vb3JvpDL3fbuej45lCHM56_v-K0_zkXR5X2nnu6iMizUb369eMuvwD2Mkr2YLXXhZl_Vbe8Un6g70rNVgllWnhi_OQu1-EZQT6jZYcFNwizqkDm7KUm3vcD0bXIg0EWGVi5Y22b6Hi4QSCKQ6oztFCYpJKuTlWetHJZDI"
          alt="Amanecer correntino en el Paraná"
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-stone-900/80 to-transparent" />
        
        <div className="relative z-10 p-6 sm:p-10 max-w-xl text-white space-y-3">
          <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block">
            📍 Itá Ibaté, Corrientes Cofradía
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl tracking-tight text-white">
            Nuestra Historia en el Río
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Nacidos en las míticas barrancas de Itá Ibaté, somos una cooperativa de guías, artesanos y técnicos dedicados a equipar la gran aventura del litoral.
          </p>
        </div>
      </div>

      {/* Core values bento cards layout info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="about-bento-grid">
        
        {/* Card 1 */}
        <div className="bg-surface-container border border-outline-variant rounded-2xl p-6 space-y-4 hover:shadow-md transition-all">
          <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Anchor className="h-5 w-5" />
          </div>
          <h3 className="font-display font-black text-sm text-[#7f2225] uppercase tracking-wide">
            Pasión por el Paraná
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            El río Paraná no es solo agua; es un ecosistema vivo de leyendas, dorados gigantescos y surubíes de ensueño. Testeamos cada componente en las bajadas rocosas del Alto Paraná para garantizar durabilidad extrema.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container border border-outline-variant rounded-2xl p-6 space-y-4 hover:shadow-md transition-all">
          <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Award className="h-5 w-5" />
          </div>
          <h3 className="font-display font-black text-sm text-[#7f2225] uppercase tracking-wide">
            Calibrado Shimano DC
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Único taller calificado de Itá Ibaté especializado en reeles de freno digital Shimano (Digital Control). Optimizamos tus chips I-DC4 e I-DC5 para evitar galletas, logrando distancias récord contra el viento del sur.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container border border-outline-variant rounded-2xl p-6 space-y-4 hover:shadow-md transition-all">
          <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-display font-black text-sm text-[#7f2225] uppercase tracking-wide">
            Pesca con Consciencia
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Fomentamos fervientemente la pesca con devolución, utilizando anzuelos simples sin rebaba de marcas seleccionadas como Owner o Mustad para preservar los tesoros genéticos de nuestras aguas del litoral sutilmente.
          </p>
        </div>

      </div>

      {/* Meet our Team section */}
      <div className="bg-surface-container-flat border border-outline-variant p-6 sm:p-8 rounded-3xl space-y-6" id="about-team-section">
        <div className="space-y-1.5 text-center max-w-md mx-auto">
          <h3 className="font-display font-black text-base text-[#7f2225] uppercase tracking-widest">
            NUESTRO STAFF DE COFRADES
          </h3>
          <p className="text-xs text-on-surface-variant">
            Guías homologados de pesca, armadores de moscas y técnicos de muelle a tu entera disposición.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="about-team-grid">
          
          {/* Member 1 */}
          <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-2xl text-center space-y-2">
            <div className="h-20 w-20 rounded-full bg-stone-200 mx-auto flex items-center justify-center font-display font-black text-primary text-xl shadow-inner uppercase">
              EC
            </div>
            <div>
              <p className="font-display font-black text-xs text-on-surface">Esteban "Chispa" Corrales</p>
              <p className="text-[10px] text-[#80561f] font-bold">Guía de Mosca Senior - Itá Ibaté</p>
            </div>
            <p className="text-[10px] text-on-surface-variant italic">"30 años guiando en los restingas del Paraná profundo. El dorado huele el nailon."</p>
          </div>

          {/* Member 2 */}
          <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-2xl text-center space-y-2">
            <div className="h-20 w-20 rounded-full bg-stone-200 mx-auto flex items-center justify-center font-display font-black text-primary text-xl shadow-inner uppercase">
              ML
            </div>
            <div>
              <p className="font-display font-black text-xs text-on-surface">Miguel "Litoral" López</p>
              <p className="text-[10px] text-[#80561f] font-bold">Maestro Mecánico de Reeles</p>
            </div>
            <p className="text-[10px] text-on-surface-variant italic">"Desarmo un Curado DC con los ojos cerrados. Tu reel quedará un reloj suizo."</p>
          </div>

          {/* Member 3 */}
          <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-2xl text-center space-y-2">
            <div className="h-20 w-20 rounded-full bg-stone-200 mx-auto flex items-center justify-center font-display font-black text-primary text-xl shadow-inner uppercase">
              SB
            </div>
            <div>
              <p className="font-display font-black text-xs text-on-surface">Sandro "Boga" Benítez</p>
              <p className="text-[10px] text-[#80561f] font-bold">Asesor de Equipos & Camping</p>
            </div>
            <p className="text-[10px] text-on-surface-variant italic">"Especialista en supervivencia, lonas estancas y carpas para las islas del Paraná."</p>
          </div>

          {/* Member 4 */}
          <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-2xl text-center space-y-2">
            <div className="h-20 w-20 rounded-full bg-stone-200 mx-auto flex items-center justify-center font-display font-black text-primary text-xl shadow-inner uppercase">
              PC
            </div>
            <div>
              <p className="font-display font-black text-xs text-on-surface">Patricia Cáceres</p>
              <p className="text-[10px] text-[#80561f] font-bold">Atención Comercial & Logística</p>
            </div>
            <p className="text-[10px] text-on-surface-variant italic">"Garantizo que tus cañas salgan ultra protegidas en tubos rígidos hacia todo el país."</p>
          </div>

        </div>
      </div>

      {/* Location Details frame info */}
      <div className="bg-surface-container border border-outline-variant rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row justify-between items-center gap-6" id="about-location">
        <div className="space-y-4 max-w-xl">
          <div className="flex items-center space-x-2 text-[#7f2225] font-black font-display text-sm uppercase">
            <MapPin className="h-5 w-5" />
            <span>Muelle Base de Operaciones</span>
          </div>
          <h4 className="font-display font-black text-lg text-on-surface">¿Cómo visitarnos en Itá Ibaté?</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Estamos ubicados físicamente a metros de la bajada principal de lanchas en el pintoresco pueblo de <strong>Itá Ibaté, Corrientes, Argentina</strong> (Km 1180 de la Ruta Nacional 12). Un punto estratégico mundialmente reconocido por el tamaño descomunal de sus presas y la diafanidad de sus aguas de restingas.
          </p>
          <div className="text-[11px] bg-white/20 p-3 rounded-xl border border-dashed border-[#fdc483]">
            📞 <strong>¿Venís a pescar hoy?</strong> Mandanos un WhatsApp Directo y te preparamos la licencia de Corrientes, carnada de primera clase (morenas medianas y mamachas) y anzuelos listos para la lancha.
          </div>
        </div>
        <div className="w-full lg:max-w-xs bg-zinc-900 border border-zinc-850 p-6 rounded-2xl text-white space-y-3 shadow flex-shrink-0">
          <p className="font-display font-bold text-xs text-amber-400 uppercase tracking-widest">Atención Telefónica</p>
          <p className="font-mono text-xl font-bold tracking-tight text-white">+54 9 379 1234567</p>
          <p className="text-[10px] text-stone-300 leading-relaxed">
            Lunes a Sábados continuado de 07:00 a 19:30 hs. Domingos de salida de lanchas de 07:00 a 12:00 hs.
          </p>
          <a
            href="https://wa.me/5493791234567?text=Hola%20Pir%C3%A1%20Par%C3%A1!%20Quer%C3%ADa%20hacerles%2520una%20consulta%20t%C3%A9cnica%20de%20pesca..."
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-2.5 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-750 hover:to-green-650 text-white font-bold text-xs font-display uppercase tracking-wider rounded-xl transition-all"
          >
            💬 WhatsApp Directo de Lancha
          </a>
        </div>
      </div>

    </div>
  );
};
