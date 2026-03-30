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
  /** Si true muestra la categoría debajo del nombre (usado en Productos) */
  showCategoria?: boolean;
}

export default function ProductCard({
  producto: p,
  onSelect,
  showCategoria = false,
}: ProductCardProps) {
  const [hov, setHov] = useState(false);

  const hasOffer =
    p.precioOferta && Number(p.precioOferta) > 0 && Number(p.precioOferta) < Number(p.precio);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
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

        {/* Hover CTA */}
        <div
          className="absolute inset-0 flex items-end p-2.5 transition-opacity duration-300"
          style={{
            opacity: hov ? 1 : 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)',
          }}
        >
          <button
            onClick={() => onSelect(p)}
            className="w-full py-2.5 rounded-lg text-[.62rem] font-bold tracking-widest uppercase border-none cursor-pointer"
            style={{ background: ACENTO, color: BTN_TXT, fontFamily: "'DM Sans',sans-serif" }}
          >
            Ver Producto
          </button>
        </div>

        {/* Badge destacado */}
        {p.destacado && (
          <div
            className="absolute top-3 left-3 text-[.58rem] font-bold px-2 py-1 rounded tracking-[.06em] uppercase shadow-md"
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
