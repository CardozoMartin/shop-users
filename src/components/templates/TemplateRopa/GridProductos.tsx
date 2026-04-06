import { useState } from 'react';
import { useStorefrontCategorias, useStorefrontNormales } from '../../../hooks/useStorefrontProducts';

export default function GridProductos({ onSelect, tiendaId }: { onSelect: (p: any) => void; tiendaId: number }) {
  const [cat, setCat] = useState<number | 'Todo'>('Todo');
  const [busqueda, setBusqueda] = useState('');
  const [busquedaFiltro, setBusquedaFiltro] = useState('');
  const [hov, setHov] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const { data: categoriasData } = useStorefrontCategorias(tiendaId);
  const categorias = categoriasData || [];

  const { data: productosData, isLoading } = useStorefrontNormales(tiendaId, {
    categoriaId: cat !== 'Todo' ? cat : undefined,
    busqueda: busquedaFiltro.trim() !== '' ? busquedaFiltro : undefined,
  });

  const productos = productosData?.datos || [];
  const visibleProducts = productos.slice(0, visibleCount);

  return (
    <section id="productos" className="py-20 px-8" style={{ background: 'var(--rop-bg)' }}>
      <div className="max-w-[1060px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <h2
            className="text-[clamp(2.5rem,4vw,3.5rem)] tracking-[.04em] leading-[0.9]"
            style={{ fontFamily: "'Bebas Neue',sans-serif", color: 'var(--rop-dark)' }}
          >
            TODO EL<br /><span style={{ color: 'var(--rop-acento)' }}>CATÁLOGO</span>
          </h2>

          <div className="flex flex-col gap-4 items-end">
            {/* Search */}
            <form
              onSubmit={(e) => { e.preventDefault(); setBusquedaFiltro(busqueda); setVisibleCount(12); }}
              className="flex gap-2 w-full max-w-[300px]"
            >
              <input
                type="text"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="flex-1 px-3 py-2 rounded outline-none text-[.8rem]"
                style={{
                  border: '1px solid var(--rop-border)',
                  background: 'var(--rop-surface)',
                  color: 'var(--rop-dark)',
                  fontFamily: "'Outfit',sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--rop-acento)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--rop-border)')}
              />
              <button
                type="submit"
                className="px-4 border-none rounded cursor-pointer text-[.8rem] font-semibold transition-colors duration-200"
                style={{
                  background: 'var(--rop-dark)',
                  color: 'var(--rop-btn-txt)',
                  fontFamily: "'Outfit',sans-serif",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--rop-acento)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--rop-dark)')}
              >
                Buscar
              </button>
            </form>

            {/* Category chips */}
            <div className="flex gap-1.5 flex-wrap justify-end">
              <button
                onClick={() => { setCat('Todo'); setVisibleCount(12); }}
                className="py-1.5 px-4 rounded cursor-pointer text-[.7rem] tracking-[.06em] transition-all duration-150"
                style={{
                  border: `1px solid ${'Todo' === cat ? 'var(--rop-acento)' : 'var(--rop-border)'}`,
                  background: 'Todo' === cat ? 'var(--rop-acento)' : 'transparent',
                  color: 'Todo' === cat ? 'var(--rop-btn-txt)' : 'var(--rop-muted)',
                  fontFamily: "'Outfit',sans-serif",
                  fontWeight: 'Todo' === cat ? 600 : 400,
                }}
              >
                Todo
              </button>
              {categorias.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => { setCat(c.id); setVisibleCount(12); }}
                  className="py-1.5 px-4 rounded cursor-pointer text-[.7rem] tracking-[.06em] transition-all duration-150"
                  style={{
                    border: `1px solid ${c.id === cat ? 'var(--rop-acento)' : 'var(--rop-border)'}`,
                    background: c.id === cat ? 'var(--rop-acento)' : 'transparent',
                    color: c.id === cat ? 'var(--rop-btn-txt)' : 'var(--rop-muted)',
                    fontFamily: "'Outfit',sans-serif",
                    fontWeight: c.id === cat ? 600 : 400,
                  }}
                >
                  {c.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading && !productos.length ? (
          <div
            className="py-16 text-center"
            style={{ color: 'var(--rop-muted)', fontFamily: "'Outfit',sans-serif" }}
          >
            Cargando prendas...
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))' }}>
            {visibleProducts.map((p: any) => (
              <div
                key={p.id}
                onMouseEnter={() => setHov(p.id)}
                onMouseLeave={() => setHov(null)}
                className="flex flex-col"
              >
                <div
                  className="relative rounded-lg overflow-hidden aspect-[3/4] transition-transform duration-[250ms]"
                  style={{
                    background: 'var(--rop-surface)',
                    transform: hov === p.id ? 'translateY(-3px)' : 'translateY(0)',
                  }}
                >
                  <img
                    src={p.imagenPrincipalUrl || 'https://via.placeholder.com/300x400'}
                    alt={p.nombre}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out"
                    style={{ transform: hov === p.id ? 'scale(1.05)' : 'scale(1)' }}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
                    style={{
                      background: 'rgba(20,20,20,.4)',
                      opacity: hov === p.id ? 1 : 0,
                    }}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelect(p); }}
                      className="py-2.5 px-6 border-none rounded cursor-pointer text-[.7rem] font-bold tracking-[.1em] uppercase"
                      style={{
                        background: 'var(--rop-acento)',
                        color: 'var(--rop-btn-txt)',
                        fontFamily: "'Outfit',sans-serif",
                      }}
                    >
                      Ver Producto
                    </button>
                  </div>
                  {p.destacado && (
                    <span
                      className="absolute top-2.5 left-2.5 text-[.56rem] font-bold py-[3px] px-2 rounded-[3px] tracking-[.08em] uppercase"
                      style={{ background: 'var(--rop-dark)', color: 'var(--rop-bg)' }}
                    >
                      Destacado
                    </span>
                  )}
                </div>
                <div className="mt-2 px-0.5">
                  <p
                    className="text-[.8rem] font-medium truncate"
                    style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-dark)' }}
                  >
                    {p.nombre}
                  </p>
                  <p
                    className="text-[.65rem] mb-0.5"
                    style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-muted)' }}
                  >
                    {p.categoria?.nombre || ''}
                  </p>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    {p.precioOferta && Number(p.precioOferta) > 0 && Number(p.precioOferta) < Number(p.precio) ? (
                      <>
                        <span className="text-[.65rem] line-through" style={{ color: 'var(--rop-subtle)' }}>
                          ${Number(p.precio).toLocaleString()}
                        </span>
                        <span
                          className="text-[1.2rem] tracking-[.04em]"
                          style={{ fontFamily: "'Bebas Neue',sans-serif", color: 'var(--rop-acento)' }}
                        >
                          ${Number(p.precioOferta).toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span
                        className="text-[1.2rem] tracking-[.04em]"
                        style={{ fontFamily: "'Bebas Neue',sans-serif", color: 'var(--rop-dark)' }}
                      >
                        ${Number(p.precio).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load more */}
        {!isLoading && visibleCount < productos.length && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setVisibleCount((v) => v + 12)}
              className="py-3.5 px-9 bg-transparent rounded cursor-pointer text-[.85rem] font-semibold tracking-[.06em] uppercase transition-all duration-[250ms]"
              style={{
                border: '1px solid var(--rop-dark)',
                color: 'var(--rop-dark)',
                fontFamily: "'Outfit',sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--rop-dark)';
                e.currentTarget.style.color = 'var(--rop-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--rop-dark)';
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
