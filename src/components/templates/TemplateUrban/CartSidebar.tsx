import { motion, AnimatePresence } from 'framer-motion';
import type { CarritoItem } from './Types';

export default function CartSidebar({
  open,
  onClose,
  cart,
  removeFromCart,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  cart: CarritoItem[];
  removeFromCart: (id: number) => void;
  onConfirm: () => void;
}) {
  const total = cart.reduce((s, i) => s + (Number(i.precioUnit ?? 0)) * (i.cantidad ?? i.qty ?? 1), 0);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/80 z-[90] cursor-pointer backdrop-blur-lg"
          onClick={onClose}
        />
      )}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950/80 backdrop-blur-2xl z-[100] flex flex-col border-l-4 border-red-600 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
        style={{ transform: open ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-900">
          <span className="text-2xl text-white font-black tracking-[0.2em] font-bebas">
            TU CARRITO ({cart.reduce((s, i) => s + (i.cantidad ?? i.qty ?? 1), 0)})
          </span>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-3xl transition bg-transparent border-none cursor-pointer p-1"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {cart.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center justify-center h-full text-zinc-700 gap-6"
            >
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-20 h-20 border-4 border-zinc-900 rounded-full flex items-center justify-center opacity-30"
              >
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </motion.div>
              <p className="uppercase tracking-[0.4em] text-[10px] font-black opacity-40">Tu carrito está vacío</p>
            </motion.div>
          )}
          {cart.map((item) => (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={item.id} 
              className="flex gap-5 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900 group"
            >
              <div className="w-20 h-20 overflow-hidden bg-black flex-shrink-0">
                <img
                  src={item.producto?.imagenPrincipalUrl || item.producto?.imagenUrl || 'https://via.placeholder.com/80'}
                  alt={item.producto?.nombre || 'Producto'}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <p className="text-white font-black text-xs uppercase tracking-tight truncate mb-1">
                  {item.producto?.nombre}
                </p>
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
                  Talle: {item.selectedSize || 'Único'}
                </p>
                <p className="text-red-600 font-extrabold mt-2 text-sm tabular-nums font-bebas">
                  ${item.precioUnit} × {item.cantidad}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-zinc-700 hover:text-red-500 transition text-2xl self-start bg-transparent border-none cursor-pointer"
              >
                ×
              </button>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-zinc-900 px-8 py-8 space-y-6 bg-black/20 backdrop-blur-xl">
          <div className="flex justify-between items-end text-white">
            <span className="uppercase tracking-[0.3em] text-[10px] font-black text-zinc-500 pb-1">TOTAL_CALC</span>
            <span className="text-4xl font-black tabular-nums font-bebas">
              ${total.toFixed(2)}
            </span>
          </div>
          <button
            onClick={onConfirm}
            disabled={cart.length === 0}
            className={`w-full font-black py-5 uppercase tracking-[0.3em] transition-all duration-300 text-[11px] border-none cursor-pointer ${
              cart.length === 0
                ? 'bg-zinc-900 text-zinc-700'
                : 'bg-red-600 hover:bg-white hover:text-black text-white'
            }`}
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </>
  );
}
