import React, { useState } from 'react';
import { 
  User, Phone, Mail, MapPin, Award, ShieldAlert, Sparkles, 
  Download, Edit, CheckCircle2, ShoppingBag, ArrowRight, Save, 
  LogOut, ClipboardList, Package, ExternalLink, RefreshCw, Gift 
} from 'lucide-react';
import { Friend, Order, Product } from '../types';
import { api } from '../services/api';

interface MiCuentaProps {
  friend: Friend | null;
  orders: Order[];
  products: Product[];
  onLogin: (friend: Friend) => void;
  onLogout: () => void;
  onUpdateFriend: (updated: Friend) => void;
  onInstantBuy?: (product: Product) => void;
}

export const MiCuenta: React.FC<MiCuentaProps> = ({
  friend,
  orders,
  products,
  onLogin,
  onLogout,
  onUpdateFriend,
  onInstantBuy,
}) => {
  // Login input state (accepts whatsapp phone or email)
  const [phoneInput, setPhoneInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Quick Register inline states
  const [isQuickRegistering, setIsQuickRegistering] = useState(false);
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickEmail, setQuickEmail] = useState('');
  const [quickRegisterError, setQuickRegisterError] = useState('');
  const [isQuickRegisterLoading, setIsQuickRegisterLoading] = useState(false);

  // Profile Edit fields
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(friend?.name || '');
  const [editEmail, setEditEmail] = useState(friend?.email || '');
  const [editAddress, setEditAddress] = useState(friend?.address || '');
  const [editCity, setEditCity] = useState(friend?.city || '');
  const [editProvincia, setEditProvincia] = useState(friend?.provincia || '');
  const [editCp, setEditCp] = useState(friend?.cp || '');
  const [updateSuccess, setUpdateSuccess] = useState('');

  // Auto-fill edit state when login succeeds
  React.useEffect(() => {
    if (friend) {
      setEditName(friend.name || '');
      setEditEmail(friend.email || '');
      setEditAddress(friend.address || '');
      setEditCity(friend.city || '');
      setEditProvincia(friend.provincia || '');
      setEditCp(friend.cp || '');
    }
  }, [friend]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;
    setLoginError('');
    setIsLoginLoading(true);

    try {
      const response = await api.loginFriend(phoneInput);
      if (response.success && response.friend) {
        onLogin(response.friend);
        setPhoneInput('');
        setIsQuickRegistering(false);
      } else if (response.notFound) {
        setIsQuickRegistering(true);
        setQuickName('');
        const trimmed = phoneInput.trim();
        if (trimmed.includes('@')) {
          setQuickEmail(trimmed);
          setQuickPhone('');
        } else {
          // Keep only numeric representations for cellular (strictly without '+' characters or spacing)
          setQuickPhone(trimmed.replace(/[^0-9]/g, ''));
          setQuickEmail('');
        }
      } else {
        setLoginError(response.error || "La Cofradía no reconoce este contacto. ¡Registrate en 1 minuto!");
      }
    } catch (err: any) {
      setLoginError(err.message || 'No se pudo verificar tu número.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleQuickRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim() || !quickPhone.trim()) {
      setQuickRegisterError("Nombre Completo y Celular son obligatorios");
      return;
    }

    // Double clean phone number strictly removing spacing and '+'
    const cleanWhatsApp = quickPhone.replace(/[^0-9]/g, '');
    if (!cleanWhatsApp) {
      setQuickRegisterError("Por favor ingresá un número de celular de WhatsApp válido.");
      return;
    }

    setQuickRegisterError('');
    setIsQuickRegisterLoading(true);

    try {
      const response = await api.joinCofradia(
        quickName.trim(), 
        cleanWhatsApp, 
        quickEmail.trim(),
        '', 'Itá Ibaté', 'corrientes', '3480'
      );
      if (response.success && response.friend) {
        onLogin(response.friend);
        setIsQuickRegistering(false);
        setPhoneInput('');
      } else {
        setQuickRegisterError(response.message || 'Error al completar inscripción rápida');
      }
    } catch (e: any) {
      setQuickRegisterError(e.message || 'Error de conexión con el muelle de datos.');
    } finally {
      setIsQuickRegisterLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friend) return;
    setUpdateSuccess('');

    // Double clean update numbers too!
    const cleanEditsWhatsApp = editPhoneClean(editName === friend.name ? friend.whatsapp : editName); 
    // Wait, let's keep it clean
    const upData: Friend = {
      ...friend,
      name: editName,
      email: editEmail,
      whatsapp: friend.whatsapp.replace(/[^0-9]/g, ''), // Ensure always clean!
      address: editAddress,
      city: editCity,
      provincia: editProvincia,
      cp: editCp
    };

    try {
      const response = await api.updateFriendProfile(upData);
      if (response.success && response.friend) {
        onUpdateFriend(response.friend);
        setUpdateSuccess("¡Perfil de Cofradía actualizado correctamente!");
        setIsEditing(false);
        setTimeout(() => setUpdateSuccess(''), 5000);
      }
    } catch (err: any) {
      alert(err.message || "Error al actualizar perfil");
    }
  };

  // Helper clean phone number
  const editPhoneClean = (p: string) => p.replace(/[^0-9]/g, '');

  // Generate Wholesale CSV file for PRO / Mayorista friends
  const downloadWholesaleList = () => {
    if (!friend) return;
    
    // Header
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID;PRODUCTO;RUBRO;P.REVENTA ARS;P.MAYORISTA PRO ARS;DESCUENTO APLICADO\n";
    
    products.forEach((p) => {
      // PRO has extra 35% discount for wholesale orders
      const discountPrice = Math.round(p.price * 0.65); 
      csvContent += `${p.id};"${p.name}";${p.category};$${p.price};$${discountPrice};35% OFF (PRO)\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PiraPara_Lista_Precios_Mayoristas.csv`);
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  };

  // Filter orders matching logged friend's details
  const myOrders = friend ? orders.filter((o) => {
    const friendNum = friend.whatsapp.replace(/[^0-9]/g, '');
    const orderNum = o.customerWhatsapp.replace(/[^0-9]/g, '');
    const emailMatch = friend.email && o.customerEmail && friend.email.trim().toLowerCase() === o.customerEmail.trim().toLowerCase();
    
    const phoneMatch = friendNum && orderNum && (friendNum === orderNum || friendNum.endsWith(orderNum) || orderNum.endsWith(friendNum));
    return phoneMatch || emailMatch;
  }) : [];

  // Gamified progression definitions
  const playerPoints = friend?.points || 0;
  const isWholesale = friend?.isMayorista || playerPoints >= 500;

  let currentRank = "Iniciado de la Costa 🎣";
  let nextRank = "Amigo de Río 🌊";
  let pointsNeeded = 200 - playerPoints;
  let progressPct = (playerPoints / 200) * 100;
  let rankDescription = `Estado actual: Iniciado de la Costa. Te faltan exactamente ${pointsNeeded} puntos de muelle para alcanzar el nivel "Amigo de Río" para desbloquear tarifas preferenciales de amigo en toda la costa.`;

  if (playerPoints >= 200 && playerPoints < 500) {
    currentRank = "Amigo de Río 🌊";
    nextRank = "Mayorista de Elite 🏆";
    pointsNeeded = 500 - playerPoints;
    progressPct = ((playerPoints - 200) / 300) * 100;
    rankDescription = `Estado actual: Amigo de Río. ¡Ya disfrutas de tarifas preferenciales activas! Te faltan ${pointsNeeded} puntos para ascender al rango supremo "Mayorista de Elite" con descarga de catálogos .CSV y hasta 35% de descuento directo en bulto cerrado.`;
  } else if (isWholesale) {
    currentRank = "Mayorista de Elite 🏆";
    nextRank = "Guardia de Pesca Dorado 🌟";
    pointsNeeded = 0;
    progressPct = 100;
    rankDescription = "Estado actual: Mayorista de Elite. ¡Rango de fidelidad Cofrade máximo alcanzado! Gozas de 35% de descuento automático de reventa directa, descarga de planillas mayoristas de Itá Ibaté y prioridad de despacho preferencial.";
  }

  // Pick customized deals for them (say, random 2 items with simulated extra 20% friend discount showing)
  const myOffers = products.slice(1, 3);

  // UNAUTHENTICATED STATE
  if (!friend) {
    return (
      <div className="max-w-md mx-auto my-12 space-y-8" id="cuenta-unauthenticated">
        
        {isQuickRegistering ? (
          <div className="bg-surface border-2 border-dashed border-[#80561f]/50 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-center animate-fade-in" id="quick-register-pane">
            <div className="h-14 w-14 bg-amber-50 rounded-2xl flex items-center justify-center text-[#80561f] mx-auto">
              <Sparkles className="h-7 w-7 text-[#80561f] animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <h2 className="font-display font-black text-lg sm:text-xl text-[#80561f] uppercase tracking-wide">¡Te damos la bienvenida!</h2>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                ¡Vaya! No estás registrado/a todavía, pero no te preocupes que <strong>en menos de un minuto lo resolvemos</strong>. Completá tus datos y ya te acreditamos <strong className="text-emerald-700">150 puntos de regalo 🎁</strong> de bienvenida.
              </p>
            </div>

            <form onSubmit={handleQuickRegisterSubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#80561f] uppercase block">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-outline bg-surface focus:outline-primary"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#80561f] uppercase block">
                  Tu Celular WhatsApp
                </label>
                <input
                  type="text"
                  required
                  value={quickPhone}
                  onChange={(e) => setQuickPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-outline bg-surface font-mono"
                  placeholder="Ej: 5493791234567"
                />
                <span className="text-[9px] text-[#80561f] font-semibold block italic">
                  ⚠️ Ingresar sin el +, ni guiones. Ej: 5493794567890 (con código de país 54)
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#80561f] uppercase block">
                  Correo Electrónico (Opcional)
                </label>
                <input
                  type="email"
                  value={quickEmail}
                  onChange={(e) => setQuickEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-outline bg-surface"
                  placeholder="Ej: juan@gmail.com"
                />
              </div>

              {quickRegisterError && (
                <p className="text-[11px] text-error bg-error/10 border border-error/20 p-3 rounded-xl font-bold">
                  ⛔ {quickRegisterError}
                </p>
              )}

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isQuickRegisterLoading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-display font-black uppercase rounded-xl tracking-wider shadow duration-150 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  {isQuickRegisterLoading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Registrando nuevo cofrade...</span>
                    </>
                  ) : (
                    <>
                      <span>Registrarme y Activar 150 Puntos</span>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsQuickRegistering(false)}
                  className="w-full py-2 text-stone-500 hover:text-stone-850 text-xs font-bold transition-all underline"
                >
                  Volver a intentar buscar mi teléfono/email
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-surface border border-outline-variant rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-center">
            
            <div className="h-14 w-14 bg-[#7f2225]/10 rounded-2xl flex items-center justify-center text-[#7f2225] mx-auto animate-pulse">
              <User className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <h2 className="font-display font-black text-xl sm:text-2xl text-on-surface">Mi Cuenta Cofradía</h2>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                Iniciá sesión ingresando tu <strong>celular o dirección de email</strong>. Si no estás registrado/a todavía, ingresá tus datos y te sumamos al instante.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#80561f] uppercase tracking-wider block">
                  Celular o Email Registrado
                </label>

                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-on-surface-variant" />
                  <input
                    type="text"
                    required
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-outline bg-surface focus:outline-primary font-mono"
                    placeholder="Ej: 5493791234567 o cofrade@gmail.com"
                    disabled={isLoginLoading}
                  />
                </div>
                <span className="text-[9px] text-[#80561f] block mt-1 font-semibold">
                  💡 Buscamos tu ficha por mail o por celular sin el +
                </span>
              </div>

              {loginError && (
                <p className="text-[11px] text-error bg-error/10 border border-error/20 p-3 rounded-xl font-bold">
                  ⛔ {loginError}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoginLoading}
                className="w-full py-3 bg-primary hover:bg-primary-container text-white text-xs font-display font-black uppercase rounded-xl tracking-wider shadow duration-150 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                {isLoginLoading ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Conectando muelle técnico...</span>
                  </>
                ) : (
                  <>
                    <span>Ingresar a mi Cuenta</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>

          </div>
        )}

        {/* Small reminder alert block */}
        <div className="bg-surface-container-low border border-outline-variant p-4.5 rounded-2xl text-center space-y-2">
          <p className="text-[11px] font-sans text-on-surface-variant leading-relaxed">
            🛶 <strong>Boutique de Pesca y Camping Pirá Pará</strong> • Al registrarte gratis en la Cofradía, te acreditamos de inmediato <strong>150 puntos de bienvenida</strong> para gozar de tarifas exclusivas y envíos promocionales a todo el país.
          </p>
        </div>
      </div>
    );
  }

  // AUTHENTICATED STATE
  return (
    <div className={`space-y-10 ${isWholesale ? 'border-2 border-amber-500/25 p-1' : ''}`} id="cuenta-dashboard-verified">
      
      {/* 1. MEMBER LEVEL PROFILE SUMMARY CARD */}
      <div 
        className={`relative overflow-hidden rounded-3xl border shadow-lg p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${
          isWholesale 
            ? 'border-yellow-500 bg-gradient-to-r from-stone-950 via-[#331f0c]/90 to-zinc-950 text-white shadow-yellow-500/15' 
            : 'border-outline-variant bg-surface-container-flat text-on-surface'
        }`}
        id="profile-metric-hero"
      >
        {/* Abstract design elements to make it feel super premium */}
        <div className="absolute right-0 bottom-0 opacity-10 font-sans font-black text-7xl select-none uppercase tracking-tighter">
          PRO STAFF
        </div>

        <div className="space-y-4 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[9px] font-display font-black px-3 py-1 rounded-full uppercase ${
              isWholesale ? 'bg-yellow-500 text-stone-950 animate-pulse' : 'bg-primary/20 text-primary'
            }`}>
              {currentRank}
            </span>
            <span className="text-[10px] font-mono text-on-surface-variant/85 bg-surface-container/50 px-2.5 py-0.5 rounded-lg border border-outline-variant/30">
              ID Amigo: {friend.id}
            </span>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight leading-none">
            ¡Hola, {friend.name}!
          </h2>
          
          <p className={`text-xs ${isWholesale ? 'text-stone-300' : 'text-on-surface-variant'} leading-relaxed font-sans`}>
            {rankDescription}
          </p>

          {/* Points Progress Gauge */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-[11px] font-bold">
              <span>Carrete de Fidelidad Cofrade</span>
              <span className="font-mono text-primary font-black uppercase text-xs">{playerPoints} PUNTOS ACUMULADOS</span>
            </div>
            
            <div className="h-3 w-full bg-stone-300/30 rounded-full overflow-hidden border border-outline-variant/40">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${isWholesale ? 'bg-yellow-500 shadow-lg' : 'bg-primary'}`} 
                style={{ width: `${Math.min(100, progressPct)}%` }}
              />
            </div>

            {pointsNeeded > 0 && (
              <span className="text-[10px] opacity-75 italic font-medium block">
                Faltan {pointsNeeded} puntos para ascender al rango {nextRank}. Te acreditamos 1 punto por cada $1000 que gastás en pedidos.
              </span>
            )}
          </div>
        </div>

        {/* Wholesale lists downloads section for qualified accounts */}
        {isWholesale && (
          <div className="w-full md:max-w-xs bg-black/40 border border-yellow-500/20 p-5 rounded-2xl space-y-3.5 text-center sm:text-left shadow flex-shrink-0">
            <div className="flex items-center space-x-1 justify-center sm:justify-start text-yellow-500 font-bold uppercase text-[10px] tracking-widest leading-none">
              <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
              <span>Socio Mayorista Calificado</span>
            </div>
            <p className="text-[11px] text-stone-200">
              Tu cuenta tiene activo el módulo <strong>PRECIOS PRO</strong>. Podés descargar e imprimir el listado completo con bonificaciones mayoristas (35% de descuento oficial directo).
            </p>
            <button
              onClick={downloadWholesaleList}
              className="w-full py-2 bg-yellow-500 hover:bg-yellow-450 hover:scale-[1.02] text-stone-950 text-[10px] font-display font-black uppercase rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Bajar Planilla Mayorista (.CSV)</span>
            </button>
          </div>
        )}

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="mi-cuenta-twin-layout">
        
        {/* Left Hand: Data management and Logout */}
        <div className="lg:col-span-1 space-y-6" id="dashboard-aside">
          
          {/* Profile settings card panel Form */}
          <div className="bg-surface-container border border-outline-variant p-5 rounded-2xl space-y-4" id="address-coordinates-form">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center space-x-1 bg-surface-container-highest px-3 py-1 rounded-lg text-[#80561f] font-black uppercase tracking-wider text-[10px]">
                <Edit className="h-3 w-3" />
                <span>Mis Datos Personales</span>
              </div>
              
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-primary hover:underline font-bold text-xs"
                >
                  Modificar
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditing(false)}
                  className="text-stone-500 hover:underline text-xs"
                >
                  Cancelar
                </button>
              )}
            </div>

            {updateSuccess && (
              <p className="text-[10px] font-medium text-emerald-800 bg-emerald-500/10 p-2 border border-emerald-500/20 rounded-lg">
                ✔ {updateSuccess}
              </p>
            )}

            {!isEditing ? (
              <div className="space-y-3 text-xs" id="profile-read-only">
                <div>
                  <span className="text-[9px] font-bold text-stone-500 block uppercase">Nombre Completo</span>
                  <p className="font-semibold text-on-surface">{friend.name}</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-stone-500 block uppercase">Contacto WhatsApp</span>
                  <p className="font-mono text-on-surface">{friend.whatsapp}</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-stone-500 block uppercase">Correo Electrónico (Para Factura y Encomiendas)</span>
                  <p className="text-on-surface font-semibold">{friend.email || 'Sin proveer'}</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-stone-500 block uppercase">Dirección de Envío</span>
                  <p className="text-on-surface font-semibold">
                    {friend.address ? `${friend.address}, ${friend.city} (${friend.provincia}) - CP ${friend.cp}` : 'Sin cargar'}
                  </p>
                </div>
                <div className="pt-2 border-t text-[10px] text-stone-500 italic block">
                  Cargando tu domicilio agilizás el despacho de encomiendas por Correo Argentino, Oca o Vía Cargo.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-3 text-xs" id="profile-edit-inputs">
                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-[#80561f] uppercase tracking-wide">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-surface"
                  />
                </div>

                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-[#80561f] uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-surface"
                    placeholder="Ej mi-correo@gmail.com"
                  />
                </div>

                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-[#80561f] uppercase tracking-wide">Dirección Física</label>
                  <input
                    type="text"
                    required
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-surface"
                    placeholder="Ej. San Martín 123"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <label className="text-[9px] font-bold text-[#80561f] uppercase tracking-wide">Ciudad</label>
                    <input
                      type="text"
                      required
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-surface"
                      placeholder="Ej. Itá Ibaté"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[9px] font-bold text-[#80561f] uppercase tracking-wide">Provincia</label>
                    <input
                      type="text"
                      required
                      value={editProvincia}
                      onChange={(e) => setEditProvincia(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-surface"
                      placeholder="Ej Corrientes"
                    />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-[#80561f] uppercase tracking-wide">Código Postal CP</label>
                  <input
                    type="text"
                    required
                    value={editCp}
                    onChange={(e) => setEditCp(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-surface font-mono"
                    placeholder="Ej. 3480"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-3 py-2 bg-primary hover:bg-primary-container text-white rounded-lg flex items-center justify-center space-x-1 font-display font-bold uppercase tracking-wide"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Guardar Modificaciones</span>
                </button>
              </form>
            )}
          </div>

          {/* Action Log out */}
          <button
            onClick={onLogout}
            className="w-full py-2.5 bg-surface hover:bg-red-50 text-red-700 hover:text-red-950 border border-red-200 hover:border-red-300 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 duration-100"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Cerrar Sesión de la Cofradía</span>
          </button>
        </div>

        {/* Right Hand: Order tracking list & active deals */}
        <div className="lg:col-span-2 space-y-8" id="dashboard-primary">
          
          {/* Active / Past Orders tracking */}
          <div className="space-y-4" id="orders-tutor">
            <h3 className="font-display font-black text-[#7f2225] text-sm uppercase tracking-widest border-b pb-2 flex items-center space-x-1.5">
              <Package className="h-4 w-4" />
              <span>Mi Historial de Pedidos ({myOrders.length})</span>
            </h3>

            {myOrders.length === 0 ? (
              <div className="border border-outline-variant/60 bg-surface-container-lowest p-8 rounded-2xl text-center space-y-2">
                <p className="font-display font-black text-xs text-on-surface">No registrás ningún pedido de muelle formal</p>
                <p className="text-[10px] text-on-surface-variant max-w-xs mx-auto">
                  Tus pedidos realizados con este WhatsApp o correo electrónico aparecerán aquí de inmediato para su seguimiento en directo al litoral.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-3.5 py-1.5 bg-primary text-white text-[10px] font-bold rounded-lg"
                >
                  Refrescar planilla
                </button>
              </div>
            ) : (
              <div className="space-y-4" id="logged-orders-list">
                {myOrders.map((o) => (
                  <div 
                    key={o.id}
                    className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl space-y-4 shadow-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 text-[11px]">
                      <div>
                        <span className="font-mono text-primary font-black uppercase mr-2">{o.id}</span>
                        <span className="text-on-surface-variant/90">{new Date(o.createdAt).toLocaleDateString('es-AR')}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        o.status === 'Entregado' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : o.status === 'En Tránsito' 
                          ? 'bg-blue-100 text-blue-850 animate-pulse'
                          : 'bg-amber-100 text-amber-850'
                      }`}>
                        {o.status}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {o.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="text-on-surface">
                            <strong className="text-primary">{it.quantity}x</strong> {it.productName} 
                            {it.selectedModel && <span className="text-[10px] text-stone-500 italic ml-1">({it.selectedModel})</span>}
                          </span>
                          <span className="font-mono text-on-surface-variant font-medium">${it.price.toLocaleString('es-AR')}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-outline-variant flex justify-between items-center text-xs font-bold text-on-surface">
                      <span>Mesa de facturación:</span>
                      <span className="text-sm font-display text-primary">${o.total.toLocaleString('es-AR')} ARS</span>
                    </div>

                    {/* Shipments info details */}
                    {o.status === "En Tránsito" && (
                      <div className="bg-blue-50/60 border border-blue-200/50 p-2.5 rounded-lg text-[10px] text-blue-900 leading-normal">
                        🚚 <strong>Despacho en Tránsito:</strong> Correo Argentino / Express. Salida de Itá Ibaté y destino cargado en {o.shippingAddress}. El muelle te enviará el remito por WhatsApp.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Special Custom Offers for Them */}
          <div className="space-y-4" id="special-offers">
            <h3 className="font-display font-black text-[#7f2225] text-sm uppercase tracking-widest border-b pb-2 flex items-center space-x-1.5">
              <Gift className="h-4 w-4 text-emerald-600" />
              <span>Ofertas Exclusivas Recomendadas Para Vos ({currentRank})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="custom-logged-deals">
              {myOffers.map((o) => {
                // Apply rank extra discount
                const specialDiscountRate = isWholesale ? 0.65 : 0.90;
                const finalSpecialPrice = Math.round(o.price * specialDiscountRate);
                
                return (
                  <div 
                    key={o.id}
                    className="bg-surface-container border border-outline-variant p-4 rounded-xl flex flex-col justify-between hover:shadow-xs space-y-3"
                  >
                    <div className="flex items-center space-x-4">
                      <img 
                        referrerPolicy="no-referrer"
                        src={o.image || undefined} 
                        alt={o.name} 
                        className="h-16 w-16 object-contain mix-blend-multiply bg-white p-1 rounded border flex-shrink-0"
                      />
                      <div className="flex-1 space-y-0.5">
                        <h4 className="font-display font-black text-xs text-on-surface line-clamp-1">{o.name}</h4>
                        <p className="text-[10px] text-on-surface-variant line-clamp-1">{o.category}</p>
                        
                        <div className="flex items-center space-x-1 text-[10px] pt-1">
                          <span className="text-on-surface-variant/70 line-through">${o.price.toLocaleString('es-AR')}</span>
                          <span className="text-[#7f2225] font-display font-black">${finalSpecialPrice.toLocaleString('es-AR')}</span>
                          <span className="text-[8px] bg-[#7f2225]/10 text-[#7f2225] font-extrabold px-1 rounded">VIP</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onInstantBuy && onInstantBuy(o)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-display font-black uppercase rounded-lg transition-colors flex items-center justify-center space-x-1 outline-none cursor-pointer"
                    >
                      <span>Comprar Ya ⚡</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
