import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ExternalLink,
  MapPin,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useListarTiendas } from '../../hooks/useShop';
import TiendiziLogoMark from '../../assets/Logo.svg';

interface EmptyStoreViewProps {
  tienda: any;
  accent?: string;
}

interface TiendaCard {
  id: number;
  nombre: string;
  descripcion?: string;
  slug: string;
  ciudad?: string;
  provincia?: string;
  logoUrl?: string;
  temaConfig?: { colorAcento?: string; colorPrimario?: string };
  _count?: { productos?: number; resenas?: number };
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

const BrandLogo = ({ compact = false }: { compact?: boolean }) => (
  <div className="flex items-center gap-2">
    <img
      src={TiendiziLogoMark}
      alt="TiendiZi"
      className={compact ? 'h-10 w-10 object-contain' : 'h-12 w-12 object-contain sm:h-14 sm:w-14'}
    />
    <span className="relative inline-flex items-center justify-center px-1 text-xl font-black text-[#15110e] sm:text-2xl">
      <svg
        className="absolute inset-0 -z-10 h-[150%] w-[145%] -translate-x-2 -translate-y-1"
        viewBox="0 0 100 48"
        fill="none"
        stroke="#fca326"
        strokeWidth="13"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path className="opacity-95" d="M92,24 L10,24" />
        <path className="opacity-90" d="M8,38 L95,34" />
      </svg>
      <span className="relative z-10 text-purple-600">TiendiZi</span>
    </span>
  </div>
);

const StoreResultCard = ({ tienda }: { tienda: TiendaCard }) => {
  const navigate = useNavigate();
  const color = tienda.temaConfig?.colorAcento || tienda.temaConfig?.colorPrimario || '#7c6bff';
  const initials = tienda.nombre
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');

  return (
    <button
      type="button"
      onClick={() => navigate(`/${tienda.slug}`)}
      className="group flex h-full min-h-[164px] w-full flex-col justify-between rounded-lg border border-[#ebe7df] bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#d9d0c2] hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg text-sm font-black text-white"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }}
          >
            {tienda.logoUrl ? (
              <img src={tienda.logoUrl} alt={tienda.nombre} className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-black text-[#15110e] transition group-hover:text-purple-600">
              {tienda.nombre}
            </h3>
            {(tienda.ciudad || tienda.provincia) && (
              <p className="mt-1 flex min-w-0 items-center gap-1 text-xs font-medium text-[#77716a]">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{[tienda.ciudad, tienda.provincia].filter(Boolean).join(', ')}</span>
              </p>
            )}
          </div>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-[#b7afa5] transition group-hover:translate-x-0.5 group-hover:text-[#ff4b26]" />
      </div>

      {tienda.descripcion && (
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#5f5850]">
          {tienda.descripcion}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-[#f0ece6] pt-3">
        <span className="rounded-full bg-[#fff3ee] px-3 py-1 text-xs font-black text-[#ff4b26]">
          Ver tienda
        </span>
        {tienda._count?.productos !== undefined && (
          <span className="text-xs font-semibold text-[#8b837a]">
            {tienda._count.productos} productos
          </span>
        )}
      </div>
    </button>
  );
};

const StoreResultSkeleton = () => (
  <div className="min-h-[164px] rounded-lg border border-[#ebe7df] bg-white p-4 shadow-sm">
    <div className="flex items-start gap-3">
      <div className="h-12 w-12 animate-pulse rounded-lg bg-[#eee8df]" />
      <div className="flex-1">
        <div className="h-4 w-2/3 animate-pulse rounded bg-[#eee8df]" />
        <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-[#f4efe9]" />
      </div>
    </div>
    <div className="mt-5 h-3 w-full animate-pulse rounded bg-[#f4efe9]" />
    <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-[#f4efe9]" />
    <div className="mt-6 h-px bg-[#f0ece6]" />
    <div className="mt-3 h-6 w-24 animate-pulse rounded-full bg-[#fff3ee]" />
  </div>
);

export default function EmptyStoreView({ tienda, accent = '#ff4b26' }: EmptyStoreViewProps) {
  const [searchInput, setSearchInput] = useState('');
  const busqueda = useDebounce(searchInput, 350);
  const navigate = useNavigate();
  const storeName = tienda?.nombre || tienda?.titulo || 'Esta tienda';

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const adminUrl = isLocal ? 'http://localhost:5173/login' : 'https://tiendafree.com/login';
  const homeUrl = isLocal ? 'http://localhost:5173/' : 'https://tiendafree.com/';

  const { data, isLoading, isError } = useListarTiendas({
    busqueda: busqueda || undefined,
    pagina: 1,
    limite: 8,
    orden: 'creadoEn',
    direccion: 'desc',
  });

  const tiendas: TiendaCard[] = useMemo(
    () => (data?.datos ?? []).filter((item: TiendaCard) => item.id !== tienda?.id),
    [data?.datos, tienda?.id]
  );

  return (
    <div className="min-h-screen bg-white text-[#15110e]">
      <header className="sticky top-0 z-30 border-b border-[#eceef3] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <BrandLogo compact />
          <a
            href={homeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#15110e] px-4 text-sm font-black text-white transition hover:bg-[#2a211c]"
          >
            Crear tienda
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-12">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col justify-center rounded-lg bg-[#0f1014] p-5 text-white shadow-[0_22px_70px_rgba(15,16,20,0.28)] sm:p-8 lg:min-h-[720px]"
        >
          <div className="mb-6">
            <BrandLogo />
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-wide text-white/70">
            <span className="h-2 w-2 rounded-full bg-[#ff4b26]" />
            Tienda en preparacion
          </div>

          <h1 className="mt-5 max-w-xl text-4xl font-black leading-tight text-white sm:text-5xl">
            {storeName} todavia esta preparando su catalogo.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-[#c7cad4] sm:text-lg">
            Mientras esta tienda termina de cargar sus productos, podes descubrir otros
            comercios publicados en TiendiZi desde este mismo lugar.
          </p>

          <div className="mt-8 max-w-xl rounded-lg border border-white/10 bg-[#1c1d24] p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: accent }}
              >
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-black text-white">Sos el administrador?</h2>
                <p className="mt-1 text-sm leading-6 text-[#aeb3c2]">
                  Entra al panel para cargar productos, logo, portada y metodos de contacto.
                </p>
              </div>
            </div>
            <a
              href={adminUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#ff4b26] px-4 text-sm font-black text-white transition hover:bg-[#e63f1c] sm:w-auto"
            >
              Acceder al panel
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-lg border border-[#eceef3] bg-[#f7f8fb] p-4 shadow-[0_22px_60px_rgba(15,16,20,0.08)] sm:p-5"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-[#ff4b26]">
                <Sparkles className="h-4 w-4" />
                Explorar tiendas
              </div>
              <h2 className="mt-2 text-2xl font-black text-[#15110e]">Busca otra tienda</h2>
            </div>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#e2e5ec] bg-white px-4 text-sm font-black text-[#15110e] transition hover:border-[#c6cad6]"
            >
              Ver todas
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9b9288]" />
            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Buscar por nombre, ciudad o rubro"
              className="h-14 w-full rounded-lg border border-[#dfe3ec] bg-white pl-12 pr-12 text-base font-semibold text-[#15110e] outline-none transition placeholder:text-[#9aa1ad] focus:border-[#ff4b26] focus:ring-4 focus:ring-[#ff4b26]/10"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#8b837a] transition hover:bg-[#f3ece4] hover:text-[#15110e]"
                aria-label="Limpiar busqueda"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => <StoreResultSkeleton key={index} />)
            ) : isError ? (
              <div className="col-span-full rounded-lg border border-[#ffd2c5] bg-[#fff4ef] p-6 text-center">
                <ShoppingBag className="mx-auto h-10 w-10 text-[#ff4b26]" />
                <h3 className="mt-3 text-base font-black text-[#15110e]">No pudimos cargar las tiendas</h3>
                <p className="mt-1 text-sm text-[#6f665e]">Intenta nuevamente en unos instantes.</p>
              </div>
            ) : tiendas.length === 0 ? (
              <div className="col-span-full rounded-lg border border-[#e5d8ca] bg-white p-8 text-center">
                <Search className="mx-auto h-10 w-10 text-[#b7afa5]" />
                <h3 className="mt-3 text-base font-black text-[#15110e]">No encontramos resultados</h3>
                <p className="mt-1 text-sm text-[#6f665e]">
                  {busqueda ? `No hay tiendas para "${busqueda}".` : 'Todavia no hay otras tiendas disponibles.'}
                </p>
              </div>
            ) : (
              tiendas.map((item) => <StoreResultCard key={item.id} tienda={item} />)
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
