import type { ToastProps } from './Types';

export default function Toast({
  msg,
  visible,
  imagen,
  nombre,
  precio,
  acento = '#ff0000',
}: ToastProps) {
  if (!visible) return null;

  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      <div
        className="pointer-events-auto flex items-center gap-4 bg-zinc-950 border-1 border-zinc-800 text-white px-5 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        style={{
          animation: 'slideInRight 0.4s cubic-bezier(.22,1,.36,1) forwards',
          minWidth: 320,
          borderLeft: `4px solid ${acento}`
        }}
      >
        <div className="w-16 h-16 overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0">
          <img src={imagen} alt={nombre} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
        </div>
        
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-red-600 font-black mb-1">
            DROP_ADDED
          </p>
          <p className="font-black text-sm uppercase leading-tight tracking-tight">{nombre || msg}</p>
          <p className="text-zinc-500 font-black text-xs mt-1 tabular-nums" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            ${precio}.00
          </p>
        </div>

        <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 text-xs font-black">
          ✓
        </div>
      </div>
    </div>
  );
}
