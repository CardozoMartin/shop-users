import { useRef } from 'react';
import { useStorefrontDestacados } from '../../../hooks/useStorefrontProducts';
import ProductCard from './ProductCard';
import type { Producto } from './Types';

const BG = 'var(--gor-bg)';
const BORDER = 'var(--gor-border)';
const TXT = 'var(--gor-txt)';
const ACENTO = 'var(--gor-acento)';

interface Props {
  onSelect: (p: Producto) => void;
  onCart?: (p: Producto) => void;
  tiendaId?: number;
}

export default function ProductosDestacados({ onSelect, onCart, tiendaId }: Props) {
  const { data: productosData, isLoading } = useStorefrontDestacados(tiendaId ?? 0);
  const productos = productosData?.datos || [];
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (dir: number) => {
    if (!carouselRef.current) return;
    const width = carouselRef.current.clientWidth;
    carouselRef.current.scrollBy({ left: dir * width * 0.75, behavior: 'smooth' });
  };

  if (isLoading || productos.length === 0) return null;

  return (
    <section
      className="px-6 py-[4.5rem] overflow-hidden"
      style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}
    >
      <div className="max-w-[1240px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <h2
            className="font-bold leading-tight"
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 'clamp(2rem,4vw,3.5rem)',
              color: TXT,
            }}
          >
            Nuestros{' '}
            <em className="italic font-normal" style={{ color: ACENTO }}>
              Destacados
            </em>
          </h2>
          <div className="flex gap-2 mb-2 hidden md:flex">
             <div className="w-12 h-1.5 rounded-full bg-current opacity-10" style={{ color: TXT }} />
             <div className="w-6 h-1.5 rounded-full bg-current" style={{ color: ACENTO }} />
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div
            ref={carouselRef}
            className="overflow-x-auto scroll-smooth pb-2 -mx-6 px-6"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="flex gap-6 md:gap-8 mx-auto" style={{ width: 'max-content' }}>
              {productos.map((p: Producto) => (
                <div key={p.id} className="w-[260px] md:w-[300px] shrink-0">
                  <ProductCard producto={p} onSelect={onSelect} onAddToCart={onCart} />
                </div>
              ))}
              <div className="w-[40px] shrink-0" />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => scrollCarousel(-1)}
            className="w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-lg font-bold text-black transition hover:bg-white"
            aria-label="Mover carrusel a la izquierda"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollCarousel(1)}
            className="w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-lg font-bold text-black transition hover:bg-white"
            aria-label="Mover carrusel a la derecha"
          >
            →
          </button>
        </div>

        <div className="mt-8 flex justify-center md:hidden">
           <p className="text-[.65rem] font-bold uppercase tracking-[.25em] opacity-30">Deslizá para ver más ◆</p>
        </div>
      </div>
    </section>
  );
}
