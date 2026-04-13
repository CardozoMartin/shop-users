import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import type { Producto } from './Types';
import { SkeletonProductCard } from '../../shared/SkeletonProductCard';

export default function Productos({
  onSelect,
  onCart,
  onViewAll,
  allProducts = [],
  isLoading = false,
  isError = false,
}: {
  onSelect: (p: Producto) => void;
  onCart: (p: Producto, qty: number) => void;
  onViewAll?: () => void;
  allProducts?: Producto[];
  isLoading?: boolean;
  isError?: boolean;
}) {
  const [filter, setFilter] = useState('Todos');

  const productsArr = Array.isArray(allProducts) ? allProducts : [];

  const categories = useMemo(
    () => ['Todos', ...new Set(productsArr.map((p) => p.category || (p.categoria as any)?.nombre || 'Otros'))],
    [productsArr]
  );

  const filtered = useMemo(() => {
    if (!productsArr.length) return [];
    if (filter === 'Todos') return productsArr.slice(0, 8);
    return productsArr.filter((p) => (p.category || (p.categoria as any)?.nombre) === filter).slice(0, 8);
  }, [productsArr, filter]);

  if (isLoading) {
    return (
      <main id="productos" className="max-w-7xl mx-auto py-20 px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <div className="h-10 w-64 bg-zinc-800 animate-pulse mb-2" />
            <div className="w-16 h-1 bg-red-600 mt-2" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-20 bg-zinc-900 border border-zinc-800 animate-pulse" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <SkeletonProductCard key={i} className="mb-2" imageClassName="aspect-[3/4] bg-zinc-900" />
          ))}
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center">
        <div className="text-red-600 text-4xl uppercase tracking-widest font-bebas">
          Error al cargar productos
        </div>
        <p className="text-zinc-500 mt-2 uppercase text-[10px] font-black tracking-widest">
          Por favor intenta de nuevo más tarde
        </p>
      </div>
    );
  }

  return (
    <main id="productos" className="max-w-7xl mx-auto py-20 px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
        <div>
          <h2 className="text-white font-bebas text-5xl leading-none">
            PRODUCTOS DESTACADOS
          </h2>
          <div className="w-16 h-1 bg-red-600 mt-2" />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${
                filter === c
                  ? 'bg-red-600 border-red-600 text-white'
                  : 'border-zinc-700 bg-zinc-950 text-zinc-500 hover:border-zinc-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-zinc-600 py-20 uppercase tracking-widest text-sm">
          No hay productos disponibles aún.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={(prod) => onCart(prod, 1)}
              onDetail={onSelect}
            />
          ))}
        </div>
      )}

      {onViewAll && productsArr.length > 8 && (
        <div className="mt-16 flex justify-center">
          <button
            onClick={onViewAll}
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-black py-4 px-12 transition duration-500 uppercase tracking-tight text-xs cursor-pointer"
          >
            Ver Catálogo Completo
          </button>
        </div>
      )}
    </main>
  );
}
