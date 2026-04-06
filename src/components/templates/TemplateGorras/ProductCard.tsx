// ProductCard.tsx
import { useState } from 'react';

const ACENTO = 'var(--gor-acento)';
const BTN_TXT = 'var(--gor-btn-txt)';
const BORDER = 'var(--gor-border)';
const SURFACE = 'var(--gor-surface)';
const SURFACE2 = 'var(--gor-surface2)';
const TXT = 'var(--gor-txt)';
const MUTED = 'var(--gor-muted)';

import type { Producto } from './Types';

interface ProductCardProps {
  producto: Producto;
  onSelect: (p: Producto) => void;
  onAddToCart?: (p: Producto) => void;
  /** Si true muestra la categoría debajo del nombre (usado en Productos) */
  showCategoria?: boolean;
}

export default function ProductCard({
  producto: p,
  onSelect,
  onAddToCart,
  showCategoria = false,
}: ProductCardProps) {
  const [hov, setHov] = useState(false);

  const hasOffer =
    p.precioOferta && Number(p.precioOferta) > 0 && Number(p.precioOferta) < Number(p.precio);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart(p);
  };

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onSelect(p)}
      className="flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group"
      style={{
        background: SURFACE,
        border: `1.5px solid ${hov ? ACENTO + '50' : BORDER}`,
        transform: hov ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hov ? `0 12px 32px ${ACENTO}18` : 'none',
      }}
    >
      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden" style={{ background: SURFACE2 }}>
        <img
          src={p.imagenPrincipalUrl || 'https://via.placeholder.com/600'}
          alt={p.nombre}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{
            transform: hov ? 'scale(1.08)' : 'scale(1)',
            // cubic-bezier no está disponible en Tailwind sin config
            transitionTimingFunction: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
          }}
        />

        {/* Floating Add to Cart Button (ALWAYS VISIBLE) */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 z-10"
          style={{ 
            background: ACENTO, 
            color: BTN_TXT,
            boxShadow: `0 4px 12px ${ACENTO}40`
          }}
          title="Agregar al carrito"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>

        {/* Hover CTA Overlay (Solo para detalle) */}
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        >
           <span className="bg-white/90 px-4 py-2 rounded-full text-[.6rem] font-bold uppercase tracking-widest text-black shadow-sm">
             Ver Detalles
           </span>
        </div>

        {/* Badge destacado */}
        {p.destacado && (
          <div
            className="absolute top-3 left-3 text-[.58rem] font-bold px-2 py-1 rounded tracking-[.06em] uppercase shadow-md pointer-events-none"
            style={{ background: ACENTO, color: BTN_TXT, fontFamily: "'DM Sans',sans-serif" }}
          >
            Destacado
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-3.5 pt-3 pb-4">
        <p
          className="text-[.8rem] font-medium truncate mb-0.5"
          style={{ color: TXT, fontFamily: "'DM Sans',sans-serif" }}
        >
          {p.nombre}
        </p>

        {showCategoria && (
          <p
            className="text-[.65rem] mb-2"
            style={{ color: MUTED, fontFamily: "'DM Sans',sans-serif" }}
          >
            {p.categoria?.nombre || 'General'}
          </p>
        )}

        {/* Precio */}
        <div className="flex items-center gap-2 mt-1">
          {hasOffer ? (
            <>
              <p
                className="text-[.75rem] line-through"
                style={{ color: MUTED, fontFamily: "'DM Sans',sans-serif" }}
              >
                ${Number(p.precio).toLocaleString()}
              </p>
              <p
                className="text-[.95rem] font-bold"
                style={{ color: ACENTO, fontFamily: "'DM Sans',sans-serif" }}
              >
                ${Number(p.precioOferta).toLocaleString()}
              </p>
              <span
                className="text-[.58rem] font-bold px-1.5 py-0.5 rounded-full ml-auto"
                style={{
                  background: `${ACENTO}14`,
                  color: ACENTO,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Oferta
              </span>
            </>
          ) : (
            <p
              className="text-[.95rem] font-bold"
              style={{ color: ACENTO, fontFamily: "'DM Sans',sans-serif" }}
            >
              ${Number(p.precio).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
