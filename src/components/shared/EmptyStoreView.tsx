import { motion } from 'framer-motion';
import { ShoppingBag, Wrench, Sparkles, Settings, ArrowRight, ExternalLink } from 'lucide-react';

interface EmptyStoreViewProps {
  tienda: any;
  accent?: string;
}

export default function EmptyStoreView({ tienda, accent = '#6366f1' }: EmptyStoreViewProps) {
  const storeName = tienda?.nombre || tienda?.titulo || 'Mi Tienda';
  
  // Dynamic links depending on whether we are developing locally or in production
  const isLocal = window.location.hostname === 'localhost';
  const adminUrl = isLocal ? 'http://localhost:5173/login' : 'https://tiendafree.com/login';
  const homeUrl = isLocal ? 'http://localhost:5173/' : 'https://tiendafree.com/';

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
      {/* Dynamic colorful blur spheres for premium visual effect */}
      <div 
        className="absolute w-[300px] h-[300px] rounded-full blur-[120px] opacity-20 -top-10 -left-10 animate-pulse"
        style={{ backgroundColor: accent }}
      />
      <div 
        className="absolute w-[350px] h-[350px] rounded-full blur-[140px] opacity-15 -bottom-20 -right-10 animate-pulse duration-7000"
        style={{ backgroundColor: '#4f46e5' }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10 text-center"
      >
        {/* Animated Magic Icon Header */}
        <div className="flex justify-center mb-6 relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-xl"
          />
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 bg-slate-800/80 border border-slate-700 rounded-2xl flex items-center justify-center shadow-lg relative"
          >
            <ShoppingBag className="w-10 h-10 text-slate-300" style={{ color: accent }} />
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 rounded-full p-1 shadow-md"
            >
              <Sparkles className="w-4 h-4 fill-current" />
            </motion.div>
          </motion.div>
        </div>

        {/* Store Title & Badge */}
        <div className="mb-6">
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300 mb-3"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Espacio Reservado
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            {storeName}
          </h1>
          <p className="mt-3 text-slate-400 text-base max-w-md mx-auto leading-relaxed">
            Esta tienda ya se encuentra en línea y reservada con éxito, pero aún se está preparando para recibir visitas.
          </p>
        </div>

        {/* Custom Section for Owner (Admin Callout) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 sm:p-6 text-left mb-8 max-w-lg mx-auto"
        >
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-5 h-5" style={{ color: accent }} />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              ¿Sos el administrador de la tienda?
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Tu sitio web de e-commerce ya está activo. Sigue estos pasos para comenzar a vender en minutos:
          </p>
          <ul className="space-y-3.5 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-700 text-white font-bold text-[10px] shrink-0 mt-0.5">1</span>
              <span>Iniciá sesión en tu panel de administración de <strong>TiendaFree</strong>.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-700 text-white font-bold text-[10px] shrink-0 mt-0.5">2</span>
              <span>Cargá tu catálogo de productos reales (e.g. ropa, gorras, accesorios, etc.).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-700 text-white font-bold text-[10px] shrink-0 mt-0.5">3</span>
              <span>Configurá tu logo, banner de portada e información de contacto legítima.</span>
            </li>
          </ul>
        </motion.div>

        {/* Buttons Action Area */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={adminUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/20 transition-all border border-transparent duration-300 cursor-pointer"
            style={{ 
              backgroundColor: accent,
              boxShadow: `0 10px 15px -3px ${accent}25`
            }}
          >
            <Settings className="w-4 h-4 animate-spin-slow" />
            Acceder al Panel Admin
            <ArrowRight className="w-4 h-4" />
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.98 }}
            href={homeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-slate-300 border border-slate-700 flex items-center justify-center gap-2 hover:text-white transition-all cursor-pointer"
          >
            Volver a TiendaFree
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
}
