import { useParams, useNavigate } from "react-router-dom";
import { usePublicShop } from "../hooks/useShop";
import StoreRenderer from "../components/StoreRenderer";

// ─── Página de error cuando la tienda no existe ────────────────
const StoreNotFound = ({ slug }: { slug: string }) => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #f0f4ff 50%, #fdf4ff 100%)' }}
    >
      {/* Logo Tiendizi */}
      <svg viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-auto mb-8 opacity-80">
        <text x="0" y="40" fontFamily="'Outfit', sans-serif" fontWeight="800" fontSize="42" fill="url(#ng)" letterSpacing="-2">tiendizi</text>
        <defs>
          <linearGradient id="ng" x1="0" y1="0" x2="200" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>

      {/* Ícono carrito */}
      <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-5 border border-gray-100">
        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">Tienda no encontrada</h1>
      <p className="text-gray-500 text-sm text-center mb-1">
        La tienda <span className="font-semibold text-gray-700">«{slug}»</span> no existe o fue eliminada.
      </p>
      <p className="text-gray-400 text-xs mb-8">
        Puede que el enlace esté mal escrito o la tienda ya no esté disponible.
      </p>

      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold shadow-sm transition hover:opacity-90 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Ver todas las tiendas
      </button>
    </div>
  );
};

// ─── Página pública de tienda ──────────────────────────────────
const PublicStorePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: tienda, isLoading, isError } = usePublicShop(slug!);
  console.log('Datos de la tienda pública:', tienda);

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #f0f4ff 50%, #fdf4ff 100%)' }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '3px solid #e0e7ff', borderTopColor: '#6366f1',
          animation: 'spin 0.7s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (isError || !tienda) {
    return <StoreNotFound slug={slug ?? ''} />;
  }

  return <StoreRenderer tienda={tienda} />;
};

export default PublicStorePage;
