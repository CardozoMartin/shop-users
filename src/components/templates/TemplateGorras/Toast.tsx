import type { ToastProps } from "./Types";


const Toast = ({
  msg,
  visible,
  imagen,
  nombre,
  precio,
  acento = 'var(--gor-acento)',
  bg = 'var(--gor-bg)',
  txt = 'var(--gor-txt)',
}: ToastProps) => {
  return (
    <div
      className={`
        fixed top-5 right-5 z-[60] flex items-center gap-3
        px-4 py-3 rounded-2xl pointer-events-none
        transition-all duration-300 whitespace-nowrap
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
      `}
      style={{
        background: bg,
        border: `1.5px solid ${acento}`,
        color: txt,
      }}
    >
      {/* Imagen del producto */}
      {imagen && (
        <img src={imagen} alt={msg} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
      )}

      {/* Texto */}
      <div className="flex flex-col gap-0.5">
        <span
          className="text-[.6rem] font-bold uppercase tracking-widest"
          style={{ color: acento, fontFamily: "'DM Sans',sans-serif" }}
        >
          ✓ {nombre ? `${nombre} agregado` : 'Producto agregado'}
          {precio !== undefined && ` • $${Number(precio).toLocaleString()}`}
        </span>
        <span
          className="text-[.78rem] font-medium"
          style={{ fontFamily: "'DM Sans',sans-serif", color: txt }}
        >
          {msg}
        </span>
      </div>
    </div>
  );
};

export default Toast;
