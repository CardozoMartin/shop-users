import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import type { Producto } from './Types';

export default function FullProductCatalog({
  onSelect,
  onCart,
  allProducts = [],
  isLoading = false,
  isError = false,
}: {
  onSelect: (p: Producto) => void;
  onCart: (p: Producto, qty: number) => void;
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
    if (filter === 'Todos') return productsArr;
    return productsArr.filter((p) => (p.category || (p.categoria as any)?.nombre) === filter);
  }, [productsArr, filter]);

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen pt-40 pb-20 text-center">
        <div className="text-white text-6xl animate-pulse uppercase tracking-[0.2em] font-bebas">
          Explorando Catálogo...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-black min-h-screen pt-40 pb-20 text-center">
        <div className="text-red-500 text-6xl uppercase tracking-[0.2em] font-bebas">
          Error al Cargar
        </div>
        <p className="text-zinc-600 mt-4 uppercase tracking-[0.4em] font-black text-xs">
          No pudimos conectar con el servidor
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <h1 className="text-white text-6xl leading-none uppercase font-bebas">
              CATÁLOGO COMPLETO
            </h1>
            <p className="text-zinc-600 font-black uppercase text-xs tracking-widest mt-2">
              Mostrando {filtered.length} productos / {categories.length - 1} categorías
            </p>
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
          <div className="text-center text-zinc-600 py-32 uppercase tracking-widest text-sm">
            No hay productos en esta categoría aún.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
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
      </div>
    </div>
  );
}
