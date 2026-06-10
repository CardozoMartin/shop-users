import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListarTiendas } from '../hooks/useShop';

// ─── Tipos ───────────────────────────────────────────────────────
interface TiendaCard {
  id: number;
  nombre: string;
  descripcion?: string;
  slug: string;
  ciudad?: string;
  provincia?: string;
  pais?: string;
  logoUrl?: string;
  temaConfig?: { colorAcento?: string; colorPrimario?: string };
  _count?: { productos: number; resenas: number };
  vistas?: number;
  plantilla?: { nombre: string };
}

// ─── Debounce Hook ────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// ─── Logo Tiendizi ────────────────────────────────────────────────
const TiendiziLogo = ({ className = '' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 220 55"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="0"
      y="44"
      fontFamily="'Outfit', 'Inter', sans-serif"
      fontWeight="800"
      fontSize="46"
      fill="url(#logoGrad)"
      letterSpacing="-1"
    >
      tiendizi
    </text>
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="220" y2="0">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
    </defs>
  </svg>
);

// ─── Store Card ───────────────────────────────────────────────────
const StoreCard = ({ tienda }: { tienda: TiendaCard }) => {
  const navigate = useNavigate();
  const accentColor = tienda.temaConfig?.colorAcento || tienda.temaConfig?.colorPrimario || '#6366f1';
  const initials = tienda.nombre
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase())
    .join('');

  return (
    <article
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
      onClick={() => navigate(`/${tienda.slug}`)}
    >
      {/* Barra de color acento */}
      <div
        className="h-1.5 w-full"
        style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)` }}
      />

      <div className="p-5">
        {/* Avatar + badge productos */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm flex-shrink-0 overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}
          >
            {tienda.logoUrl ? (
              <img src={tienda.logoUrl} alt={tienda.nombre} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>

          {tienda._count?.productos !== undefined && (
            <span className="bg-gray-50 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-full border border-gray-100 flex-shrink-0">
              {tienda._count.productos} productos
            </span>
          )}
        </div>

        {/* Nombre */}
        <h3 className="font-bold text-gray-900 text-base mb-1 truncate group-hover:text-indigo-600 transition-colors">
          {tienda.nombre}
        </h3>

        {/* Descripción */}
        {tienda.descripcion && (
          <p className="text-gray-400 text-sm line-clamp-2 mb-3 leading-relaxed">
            {tienda.descripcion}
          </p>
        )}

        {/* Ubicación */}
        {(tienda.ciudad || tienda.provincia) && (
          <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{[tienda.ciudad, tienda.provincia].filter(Boolean).join(', ')}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: `${accentColor}18`, color: accentColor }}
          >
            Visitar tienda →
          </span>

          {tienda.vistas !== undefined && tienda.vistas > 0 && (
            <span className="text-gray-300 text-xs flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd" />
              </svg>
              {tienda.vistas.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Overlay hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl"
        style={{ background: `${accentColor}06` }}
      />
    </article>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-1.5 bg-gray-100" />
    <div className="p-5">
      <div className="flex justify-between mb-4">
        <div className="w-14 h-14 bg-gray-100 rounded-xl" />
        <div className="w-20 h-6 bg-gray-100 rounded-full" />
      </div>
      <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-full mb-1" />
      <div className="h-3 bg-gray-100 rounded w-2/3 mb-4" />
      <div className="h-3 bg-gray-100 rounded w-1/3 mb-4" />
      <div className="h-px bg-gray-100 mb-3" />
      <div className="flex justify-between">
        <div className="h-6 bg-gray-100 rounded-full w-28" />
        <div className="h-4 bg-gray-100 rounded w-10" />
      </div>
    </div>
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────
const EmptyState = ({ query }: { query: string }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
    <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
      <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <h3 className="font-semibold text-gray-700 text-lg mb-1">No encontramos tiendas</h3>
    <p className="text-gray-400 text-sm max-w-xs">
      {query
        ? `No hay resultados para "${query}". Probá con otro término.`
        : 'Todavía no hay tiendas disponibles. ¡Volvé pronto!'}
    </p>
  </div>
);

// ─── Página principal ─────────────────────────────────────────────
const StoreDirectoryPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [pagina, setPagina] = useState(1);
  const busqueda = useDebounce(searchInput, 400);

  useEffect(() => { setPagina(1); }, [busqueda]);

  const { data, isLoading, isError } = useListarTiendas({
    busqueda: busqueda || undefined,
    pagina,
    limite: 12,
    orden: 'creadoEn',
    direccion: 'desc',
  });

  const tiendas: TiendaCard[] = data?.datos ?? [];
  const total: number = data?.paginacion?.total ?? 0;
  const totalPaginas: number = data?.paginacion?.totalPaginas ?? 1;

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #f0f4ff 50%, #fdf4ff 100%)' }}>

      {/* ── Header ──────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <TiendiziLogo className="h-9 w-auto" />
          <span className="text-xs text-gray-400 hidden sm:block font-medium tracking-wide">
            Encontrá tu tienda favorita
          </span>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────── */}
      <section className="pt-14 pb-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-5 border border-indigo-100">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Directorio de tiendas
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
            Descubrí tiendas{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
            >
              únicas
            </span>
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Explorá cientos de tiendas en un solo lugar. Encontrá lo que necesitás y apoyá emprendedores locales.
          </p>

          {/* Buscador */}
          <div className="relative max-w-lg mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="store-search"
              type="text"
              value={searchInput}
              onChange={handleSearch}
              placeholder="Buscar tiendas, ciudades, productos..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-700 placeholder-gray-400 text-base transition"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                aria-label="Limpiar búsqueda"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Grilla de tiendas ───────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 pb-16">

        {/* Contador de resultados */}
        {!isLoading && !isError && (
          <div className="mb-5">
            <p className="text-sm text-gray-500">
              {busqueda ? (
                <><span className="font-semibold text-gray-700">{total}</span> resultado{total !== 1 ? 's' : ''} para "<span className="text-indigo-600">{busqueda}</span>"</>
              ) : (
                <><span className="font-semibold text-gray-700">{total}</span> tiendas disponibles</>
              )}
            </p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">No pudimos cargar las tiendas</p>
            <p className="text-gray-400 text-sm mt-1">Verificá tu conexión e intentá de nuevo.</p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : tiendas.length === 0
              ? <EmptyState query={busqueda} />
              : tiendas.map((tienda) => <StoreCard key={tienda.id} tienda={tienda} />)
          }
        </div>

        {/* Paginación */}
        {!isLoading && totalPaginas > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPagina(p => Math.max(1, p - 1))}
              disabled={pagina === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPaginas, 5) }, (_, i) => {
                const pageNum = totalPaginas <= 5 ? i + 1 : Math.max(1, pagina - 2) + i;
                if (pageNum > totalPaginas) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPagina(pageNum)}
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition ${
                      pageNum === pagina
                        ? 'text-white shadow-sm'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                    style={pageNum === pagina
                      ? { background: 'linear-gradient(135deg, #6366f1, #a855f7)' }
                      : {}
                    }
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
              disabled={pagina === totalPaginas}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
            >
              Siguiente
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </main>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <TiendiziLogo className="h-6 w-auto opacity-60" />
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} Tiendizi · Todas las tiendas en un lugar
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StoreDirectoryPage;
