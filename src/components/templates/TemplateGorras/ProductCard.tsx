import { useState } from "react";
import type { MouseEvent } from "react";
import type { Producto } from "./Types";

// ── Variables CSS del tema ────────────────────────────────────────────────────
const ACENTO = "var(--gor-acento)";
const BTN_TXT = "var(--gor-btn-txt)";
const BORDER = "var(--gor-border)";
const SURFACE = "var(--gor-surface)";
const SURFACE2 = "var(--gor-surface2)";
const TXT = "var(--gor-txt)";
const MUTED = "var(--gor-muted)";

// ── Props ─────────────────────────────────────────────────────────────────────
interface ProductCardProps {
  producto: Producto;
  onSelect: (p: Producto) => void;
  onAddToCart?: (p: Producto) => void;
  showCategoria?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

//Devuelve true si el producto tiene un precio de oferta válido y menor al precio base */
function tieneOferta(p: Producto): boolean {
  return (
    Boolean(p.precioOferta) &&
    Number(p.precioOferta) > 0 &&
    Number(p.precioOferta) < Number(p.precio)
  );
}

//Subcomponentes internos ───────────────────────────────────────────────────

//Ícono "+" para el botón flotante del carrito */
function IconoMas() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

//Bloque de precio: muestra oferta con tachado o precio simple */
interface PrecioProps {
  producto: Producto;
  hasOffer: boolean;
}

function Precio({ producto: p, hasOffer }: PrecioProps) {
  if (hasOffer) {
    return (
      <div className="flex items-center gap-2 mt-1">
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
      </div>
    );
  }

  return (
    <div className="mt-1">
      <p
        className="text-[.95rem] font-bold"
        style={{ color: ACENTO, fontFamily: "'DM Sans',sans-serif" }}
      >
        ${Number(p.precio).toLocaleString()}
      </p>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function ProductCard({
  producto: p,
  onSelect,
  onAddToCart,
  showCategoria = false,
}: ProductCardProps) {
  const [hov, setHov] = useState(false);

  const hasOffer = tieneOferta(p);

  // Evita que el click del carrito propague al onClick de la card
  const handleAddToCart = (e: MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(p);
  };

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onSelect(p)}
      className="flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        background: SURFACE,
        border: `1.5px solid ${hov ? ACENTO + "50" : BORDER}`,
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov ? `0 12px 32px ${ACENTO}18` : "none",
      }}
    >
      {/* Imagen */}
      <div
        className="relative aspect-square overflow-hidden"
        style={{ background: SURFACE2 }}
      >
        <img
          src={p.imagenPrincipalUrl || "https://via.placeholder.com/600"}
          alt={p.nombre}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{
            transform: hov ? "scale(1.08)" : "scale(1)",
            // cubic-bezier no disponible en Tailwind sin config personalizada
            transitionTimingFunction: "cubic-bezier(0.165, 0.84, 0.44, 1)",
          }}
        />

        {/* Botón flotante agregar al carrito */}
        <button
          onClick={handleAddToCart}
          title="Agregar al carrito"
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 z-10"
          style={{
            background: ACENTO,
            color: BTN_TXT,
            boxShadow: `0 4px 12px ${ACENTO}40`,
          }}
        >
          <IconoMas />
        </button>

        {/* Badge "Destacado" */}
        {p.destacado && (
          <div
            className="absolute top-3 left-3 text-[.58rem] font-bold px-2 py-1 rounded tracking-[.06em] uppercase shadow-md pointer-events-none"
            style={{
              background: ACENTO,
              color: BTN_TXT,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Destacado
          </div>
        )}
      </div>

      {/* Info del producto */}
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
            {p.categoria?.nombre ?? "General"}
          </p>
        )}

        <Precio producto={p} hasOffer={hasOffer} />

        {/* Acciones */}
        <div className="mt-3 flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(p);
            }}
            className="w-full py-2 rounded border border-[var(--gor-border)] bg-transparent text-[.75rem] font-bold tracking-[.12em] uppercase"
            style={{ color: TXT, fontFamily: "'DM Sans',sans-serif" }}
          >
            Ver producto
          </button>

          {onAddToCart && (
            <button
              onClick={handleAddToCart}
              className="w-full py-2 rounded text-[.75rem] font-bold tracking-[.12em] uppercase"
              style={{
                background: ACENTO,
                color: BTN_TXT,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Agregar al carrito
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
