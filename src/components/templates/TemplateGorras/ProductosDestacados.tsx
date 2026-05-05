import { useRef } from 'react';
import { useStorefrontDestacados } from '../../../hooks/useStorefrontProducts';
import ProductCard from './ProductCard';
import type { Producto } from './Types';

//Tema ────────────────────────────────────────────────────────────────────
const tema = {
  bg: 'var(--gor-bg)',
  border: 'var(--gor-border)',
  txt: 'var(--gor-txt)',
  acento: 'var(--gor-acento)',
} as const;

//Props ───────────────────────────────────────────────────────────────────
interface Props {
  tiendaId?: number;
  onSelect: (producto: Producto) => void;
  onCart?: (producto: Producto) => void;
}

//Subcomponentes internos ──────────────────────────────────────────────────

//Encabezado de la sección con título y decoración */
function Encabezado() {
  return (
    <header className="flex items-end justify-between mb-10">
      <h2
        className="font-bold leading-tight"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          color: tema.txt,
        }}
      >
        Nuestros{' '}
        <em className="italic font-normal" style={{ color: tema.acento }}>
          Destacados
        </em>
      </h2>

      {/* Decoración de barras — solo visible en desktop */}
      <div className="hidden md:flex gap-2 mb-2">
        <div className="w-12 h-1.5 rounded-full bg-current opacity-10" style={{ color: tema.txt }} />
        <div className="w-6 h-1.5 rounded-full bg-current" style={{ color: tema.acento }} />
      </div>
    </header>
  );
}

//─────────────────────────────────────────────────────────────────────────────

//Botones de navegación del carrusel
interface BotonesNavProps {
  onIzquierda: () => void;
  onDerecha: () => void;
}

function BotonesNav({ onIzquierda, onDerecha }: BotonesNavProps) {
  const estiloBoton =
    'w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-lg font-bold text-black transition hover:bg-white';

  return (
    <div className="mt-8 flex justify-center gap-3">
      <button type="button" onClick={onIzquierda} className={estiloBoton} aria-label="Anterior">
        ←
      </button>
      <button type="button" onClick={onDerecha} className={estiloBoton} aria-label="Siguiente">
        →
      </button>
    </div>
  );
}

//─────────────────────────────────────────────────────────────────────────────

//Hint de swipe visible solo en mobile */
function HintMobile() {
  return (
    <div className="mt-8 flex justify-center md:hidden">
      <p className="text-[.65rem] font-bold uppercase tracking-[.25em] opacity-30">
        Deslizá para ver más ◆
      </p>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function ProductosDestacados({ tiendaId, onSelect, onCart }: Props) {
  // Ref al nodo DOM del carrusel — necesario para scrollBy programático
  const carouselRef = useRef<HTMLDivElement>(null);

  const { data: productosData, isLoading } = useStorefrontDestacados(tiendaId ?? 0);
  const productos: Producto[] = productosData?.datos ?? [];

  // Mueve el carrusel un 75% de su ancho visible en la dirección dada
  const scrollCarousel = (direccion: 1 | -1) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: direccion * el.clientWidth * 0.75, behavior: 'smooth' });
  };

  if (isLoading) return null;

  if (productos.length === 0) {
    return (
      <section
        className="px-6 py-[4.5rem] overflow-hidden"
        style={{ background: tema.bg, borderBottom: `1px solid ${tema.border}` }}
      >
        <div className="max-w-[1240px] mx-auto text-center">
          <Encabezado />
          <div className="py-10" style={{ color: tema.muted, fontFamily: "'DM Sans',sans-serif" }}>
            Todavía no hay productos destacados cargados en esta tienda.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="px-6 py-[4.5rem] overflow-hidden"
      style={{ background: tema.bg, borderBottom: `1px solid ${tema.border}` }}
    >
      <div className="max-w-[1240px] mx-auto">
        <Encabezado />

        {/* Carrusel de productos */}
        <div className="relative">
          <div
            ref={carouselRef}
            className="overflow-x-auto scroll-smooth pb-2 -mx-6 px-6"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="flex gap-6 md:gap-8" style={{ width: 'max-content' }}>
              {productos.map((producto) => (
                <div key={producto.id} className="w-[260px] md:w-[300px] shrink-0">
                  <ProductCard producto={producto} onSelect={onSelect} onAddToCart={onCart} />
                </div>
              ))}
              {/* Espaciado final para que el último card no quede pegado al borde */}
              <div className="w-[40px] shrink-0" aria-hidden="true" />
            </div>
          </div>
        </div>

        <BotonesNav onIzquierda={() => scrollCarousel(-1)} onDerecha={() => scrollCarousel(1)} />
        <HintMobile />
      </div>
    </section>
  );
}