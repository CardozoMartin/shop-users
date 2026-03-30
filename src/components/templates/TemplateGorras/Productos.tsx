// Productos.tsx
import { useState } from 'react';
import {
  useStorefrontCategorias,
  useStorefrontNormales,
} from '../../../hooks/useStorefrontProducts';
import ProductCard from './ProductCard';
import type { CategoriaProducto, Producto } from './Types';

const BG = 'var(--gor-bg)';
const ACENTO = 'var(--gor-acento)';
const BORDER = 'var(--gor-border)';
const SURFACE = 'var(--gor-surface)';
const TXT = 'var(--gor-txt)';
const MUTED = 'var(--gor-muted)';
const SUBTLE = 'var(--gor-subtle)';

interface Props {
  onSelect: (p: Producto) => void;
  tiendaId?: number;
}

export default function Productos({ onSelect, tiendaId }: Props) {
  const [cat, setCat] = useState<number | 'Todo'>('Todo');
  const [busqueda, setBusqueda] = useState('');
  const [busquedaFiltro, setBusquedaFiltro] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);

  const { data: categoriasData } = useStorefrontCategorias(tiendaId ?? 0);
  const categorias = categoriasData || [];

  const { data: productosData, isLoading } = useStorefrontNormales(tiendaId ?? 0, {
    categoriaId: cat !== 'Todo' ? cat : undefined,
    busqueda: busquedaFiltro.trim() !== '' ? busquedaFiltro : undefined,
  });

  const allProductos = productosData?.datos || [];
  const productos = allProductos.slice(0, visibleCount);

  const handleCat = (id: number | 'Todo') => {
    setCat(id);
    setVisibleCount(12);
  };

  return (
    <section className="px-6 py-[4.5rem]" style={{ background: BG }}>
      <div className="max-w-[1060px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <h2
            className="font-bold"
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 'clamp(1.8rem,3.5vw,2.8rem)',
              color: TXT,
            }}
          >
            Toda la{' '}
            <em className="italic font-normal" style={{ color: ACENTO }}>
              Colección
            </em>
          </h2>
          <span
            className="text-[.72rem]"
            style={{ color: SUBTLE, fontFamily: "'DM Sans',sans-serif" }}
          >
            {productos.length} productos
          </span>
        </div>

        {/* Filtros */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Búsqueda */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setBusquedaFiltro(busqueda);
              setVisibleCount(12);
            }}
            className="flex gap-2 w-full max-w-[400px]"
          >
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-full text-[.85rem] outline-none transition-colors duration-300"
              style={{
                border: `1.5px solid ${BORDER}`,
                background: SURFACE,
                color: TXT,
                fontFamily: "'DM Sans',sans-serif",
              }}
              onFocus={(e) => (e.target.style.borderColor = ACENTO)}
              onBlur={(e) => (e.target.style.borderColor = BORDER)}
            />
            <button
              type="submit"
              className="px-5 rounded-full text-[.85rem] font-semibold border-none cursor-pointer text-white transition-opacity duration-200 hover:opacity-85"
              style={{ background: ACENTO, fontFamily: "'DM Sans',sans-serif" }}
            >
              Buscar
            </button>
          </form>

          {/* Chips de categoría */}
          <div className="flex gap-1.5 flex-wrap">
            {(['Todo', ...categorias] as Array<'Todo' | CategoriaProducto>).map((c) => {
              const id = c === 'Todo' ? 'Todo' : c.id;
              const label = c === 'Todo' ? 'Todo' : c.nombre;
              const active = id === cat;
              return (
                <button
                  key={id}
                  onClick={() => handleCat(id)}
                  className="px-4 py-1.5 rounded-full text-[.72rem] cursor-pointer transition-all duration-200 border-none"
                  style={{
                    border: `1.5px solid ${active ? ACENTO : BORDER}`,
                    background: active ? `${ACENTO}14` : 'transparent',
                    color: active ? ACENTO : MUTED,
                    fontWeight: active ? 600 : 400,
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        {isLoading && !productos.length ? (
          <div
            className="py-16 text-center"
            style={{ color: MUTED, fontFamily: "'DM Sans',sans-serif" }}
          >
            Cargando catálogo...
          </div>
        ) : (
          <div
            className="grid gap-x-7 gap-y-10"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))' }}
          >
            {productos.map((p: Producto) => (
              <ProductCard key={p.id} producto={p} onSelect={onSelect} showCategoria />
            ))}
          </div>
        )}

        {/* Ver más */}
        {allProductos.length > visibleCount && (
          <div className="mt-14 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="px-8 py-3 rounded-full text-[.75rem] font-bold tracking-widest uppercase cursor-pointer transition-all duration-200"
              style={{
                background: SURFACE,
                color: TXT,
                border: `1.5px solid ${BORDER}`,
                fontFamily: "'DM Sans',sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = ACENTO;
                e.currentTarget.style.color = ACENTO;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = BORDER;
                e.currentTarget.style.color = TXT;
              }}
            >
              Ver más productos
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
