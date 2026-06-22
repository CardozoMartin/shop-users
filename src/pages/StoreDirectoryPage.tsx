import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListarTiendas } from '../hooks/useShop';

// ─── Tipos ────────────────────────────────────────────────────────
interface TiendaCard {
  id: number;
  nombre: string;
  descripcion?: string;
  slug: string;
  ciudad?: string;
  provincia?: string;
  logoUrl?: string;
  temaConfig?: { colorAcento?: string; colorPrimario?: string };
  _count?: { productos: number; resenas: number };
  vistas?: number;
}

// ─── Debounce ─────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [dv, setDv] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDv(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return dv;
}

// ─── Logo (mismo estilo que tiendafree Hero) ──────────────────────
const Logo = () => (
  <div className="flex items-center gap-2 flex-shrink-0">
    <div className="relative inline-flex items-center justify-center isolate">
      {/* brush strokes naranjas detrás del texto */}
      <svg
        className="absolute inset-0 -z-10 w-[150%] h-[160%] -translate-x-3 -translate-y-1"
        viewBox="0 0 100 48"
        fill="none"
        stroke="#ff6b3d"
        strokeWidth="13"
        strokeLinecap="round"
      >
        <path d="M92,24 L10,24" pathLength="100" strokeDasharray="100" strokeOpacity="0.35" />
        <path d="M8,38 L95,34" pathLength="100" strokeDasharray="100" strokeOpacity="0.28" />
      </svg>
      <span className="relative z-10 text-xl sm:text-2xl font-black tracking-[-0.04em] text-[#15110e] px-1">
        <span style={{ color: '#7c3aed' }}>Tiendi</span>Zi
      </span>
    </div>
  </div>
);

// ─── Store Card ───────────────────────────────────────────────────
const StoreCard = ({ tienda }: { tienda: TiendaCard }) => {
  const navigate = useNavigate();
  const accent = tienda.temaConfig?.colorAcento || tienda.temaConfig?.colorPrimario || '#ff6b3d';
  const initials = tienda.nombre
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase())
    .join('');

  return (
    <article
      onClick={() => navigate(`/${tienda.slug}`)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#e8e0d8] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
    >
      {/* barra de color de la tienda */}
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}88)` }} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          {/* Avatar */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm flex-shrink-0 overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}99)` }}
          >
            {tienda.logoUrl ? (
              <img src={tienda.logoUrl} alt={tienda.nombre} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>

          {tienda._count?.productos !== undefined && (
            <span className="bg-[#f7f4ef] text-[#64584f] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#e8e0d8] flex-shrink-0">
              {tienda._count.productos} productos
            </span>
          )}
        </div>

        <h3 className="font-black text-[#15110e] text-base mb-1 truncate group-hover:text-[#ff6b3d] transition-colors tracking-tight">
          {tienda.nombre}
        </h3>

        {tienda.descripcion && (
          <p className="text-[#64584f] text-sm line-clamp-2 mb-3 leading-relaxed">
            {tienda.descripcion}
          </p>
        )}

        {(tienda.ciudad || tienda.provincia) && (
          <div className="flex items-center gap-1.5 text-[#a09488] text-xs mb-3">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{[tienda.ciudad, tienda.provincia].filter(Boolean).join(', ')}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-[#f0ebe4]">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full transition-colors"
            style={{ background: `${accent}18`, color: accent }}
          >
            Visitar →
          </span>
          {tienda.vistas !== undefined && tienda.vistas > 0 && (
            <span className="text-[#c4b8ae] text-xs flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {tienda.vistas.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* overlay hover sutil */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl"
        style={{ background: `${accent}05` }}
      />
    </article>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-[#e8e0d8] overflow-hidden animate-pulse">
    <div className="h-1.5 bg-[#f0ebe4]" />
    <div className="p-5">
      <div className="flex justify-between mb-4">
        <div className="w-14 h-14 bg-[#f0ebe4] rounded-xl" />
        <div className="w-20 h-6 bg-[#f0ebe4] rounded-full" />
      </div>
      <div className="h-4 bg-[#f0ebe4] rounded w-3/4 mb-2" />
      <div className="h-3 bg-[#f0ebe4] rounded w-full mb-1" />
      <div className="h-3 bg-[#f0ebe4] rounded w-2/3 mb-4" />
      <div className="h-3 bg-[#f0ebe4] rounded w-1/3 mb-4" />
      <div className="h-px bg-[#f0ebe4] mb-3" />
      <div className="flex justify-between">
        <div className="h-6 bg-[#f0ebe4] rounded-full w-20" />
        <div className="h-4 bg-[#f0ebe4] rounded w-10" />
      </div>
    </div>
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────
const EmptyState = ({ query }: { query: string }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
    <div className="w-20 h-20 rounded-full bg-[#fff3ee] flex items-center justify-center mb-4">
      <svg className="w-10 h-10 text-[#ff6b3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <h3 className="font-black text-[#15110e] text-lg mb-1 tracking-tight">No encontramos tiendas</h3>
    <p className="text-[#64584f] text-sm max-w-xs leading-relaxed">
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
    <div className="min-h-screen" style={{ background: '#f7f4ef' }}>

      {/* Detalles decorativos de fondo */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 70% 20%, rgba(203,183,255,0.12) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 10% 80%, rgba(255,107,61,0.07) 0%, transparent 60%)',
        }}
      />

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 backdrop-blur-lg border-b border-[#e8e0d8]" style={{ background: 'rgba(247,244,239,0.85)' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo />
          <span className="text-xs text-[#a09488] hidden sm:block font-medium tracking-wide">
            Encontrá tu tienda favorita
          </span>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-14 pb-10 px-4">
        <div className="max-w-3xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#fff3ee] text-[#ff6b3d] text-xs font-bold px-3.5 py-1.5 rounded-full mb-6 border border-[#ffd4c2]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b3d] animate-pulse" />
            Directorio de tiendas
          </div>

          {/* Título */}
          <h1 className="text-[clamp(2.4rem,6vw,4.5rem)] font-black leading-[0.92] tracking-[-0.05em] text-[#15110e] mb-5">
            Descubrí tiendas{' '}
            <span className="relative inline-block">
              <span style={{ color: '#ff6b3d' }}>únicas</span>
              {/* Wavy underline naranja */}
              <svg
                className="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
                fill="none"
                stroke="#ff6b3d"
                strokeWidth="4"
                strokeLinecap="round"
                style={{ height: '0.35em' }}
              >
                <path d="M2,8 Q25,2 50,8 T98,8" />
              </svg>
            </span>
          </h1>

          <p className="text-[#64584f] text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Explorá tiendas en un solo lugar. Encontrá lo que necesitás y apoyá emprendedores locales.
          </p>

          {/* Buscador */}
          <div className="relative max-w-lg mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-[#a09488]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={handleSearch}
              placeholder="Buscar tiendas, ciudades, productos..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl border border-[#e8e0d8] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d] text-[#15110e] placeholder-[#a09488] text-base transition"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute inset-y-0 right-4 flex items-center text-[#a09488] hover:text-[#64584f] transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Grilla ── */}
      <main className="max-w-6xl mx-auto px-4 pb-16">

        {/* Contador */}
        {!isLoading && !isError && (
          <p className="text-sm text-[#a09488] mb-5">
            {busqueda ? (
              <><span className="font-bold text-[#15110e]">{total}</span> resultado{total !== 1 ? 's' : ''} para "<span style={{ color: '#ff6b3d' }}>{busqueda}</span>"</>
            ) : (
              <><span className="font-bold text-[#15110e]">{total}</span> tiendas disponibles</>
            )}
          </p>
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
            <p className="text-[#15110e] font-bold">No pudimos cargar las tiendas</p>
            <p className="text-[#a09488] text-sm mt-1">Verificá tu conexión e intentá de nuevo.</p>
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#e8e0d8] text-[#64584f] text-sm font-semibold hover:bg-[#f0ebe4] disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
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
                    className="w-9 h-9 rounded-xl text-sm font-bold transition"
                    style={pageNum === pagina
                      ? { background: '#15110e', color: 'white' }
                      : { background: 'white', color: '#64584f', border: '1px solid #e8e0d8' }
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#e8e0d8] text-[#64584f] text-sm font-semibold hover:bg-[#f0ebe4] disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
            >
              Siguiente
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#e8e0d8] py-6" style={{ background: 'rgba(247,244,239,0.95)' }}>
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <Logo />
          <p className="text-[#a09488] text-xs">
            © {new Date().getFullYear()} TiendiZi · Todas las tiendas en un lugar
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StoreDirectoryPage;
