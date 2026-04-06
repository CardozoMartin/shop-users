import { useRef } from 'react';
import { useStorefrontDestacados } from '../../../hooks/useStorefrontProducts';
import ProductCard from './ProductCard';
import type { Producto } from './Types';

interface Props {
  onSelect: (p: Producto) => void;
  onCart: (p: Producto, qty: number) => void;
  tiendaId?: number;
  acento?: string;
}

export default function ProductosDestacados({
  onSelect,
  onCart,
  tiendaId,
  acento = '#dc2626',
}: Props) {
  const { data: productosData, isLoading } = useStorefrontDestacados(tiendaId ?? 0);
  const productos = Array.isArray(productosData) ? productosData : productosData?.datos || [];
  const featuredProducts = productos.filter(
    (p: Producto) =>
      p &&
      (typeof p.id === 'number' ||
        typeof p.nombre === 'string' ||
        typeof p.imagenPrincipalUrl === 'string' ||
        typeof p.imagenUrl === 'string' ||
        typeof p.img === 'string')
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  if (isLoading || featuredProducts.length === 0) return null;

  return (
    <section className="bg-black py-24 border-y border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <h2 className="text-white text-7xl font-black leading-none uppercase font-bebas">
              DROP <span style={{ color: acento }}>DESTACADO</span>
            </h2>
            <div className="w-32 h-1.5 bg-red-600 mt-4" style={{ backgroundColor: acento }} />
          </div>
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em] font-syncopate max-w-xs text-right">
            PIEZAS EXCLUSIVAS SELECCIONADAS PARA DOMINAR LA TEMPORADA.
          </p>
        </div>

        <div className="relative group">
          {/* Scroll indicators or custom buttons could go here */}
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto pb-12 scrollbar-none snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {featuredProducts.map((p: Producto) => (
              <div key={p.id} className="w-[320px] shrink-0 snap-start">
                <ProductCard
                  product={p}
                  onAddToCart={(prod: Producto) => onCart(prod, 1)}
                  onDetail={onSelect}
                />
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center">
            <div className="flex gap-2">
              {featuredProducts.map((_: any, idx: number) => (
                <div key={idx} className="h-1 w-8 bg-zinc-900" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
