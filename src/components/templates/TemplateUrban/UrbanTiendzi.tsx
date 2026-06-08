import { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useCarrito } from '../../../hooks/useCarrito';
import { useStorefrontProductos } from '../../../hooks/useStorefrontProducts';
import type { StoreNavTarget } from '../../../hooks/useStoreNavigation';
import { useStoreNavigation } from '../../../hooks/useStoreNavigation';
import { useAuthSessionStore } from '../../../store/useAuthSession';
import { useTiendaIDStore } from '../../../store/useTiendaIDStore';

// ── Componentes ───────────────────────────────────────────────
import AboutUs from './AboutUs';
import AccountView from './AccountView';
import AuthView from './AuthView';
import CartSidebar from './CartSidebar';
import CheckoutView from './CheckoutView';
import { Footer } from './Footer';
import FullProductCatalog from './FullProductCatalog';
import Hero from './Hero';
import Marquee from './Marquee';
import { Navbar } from './Navbar';
import ProductDetailView from './ProductDetailView';
import Productos from './Productos';
import ProductosDestacados from './ProductosDestacados';
import StoreReviewSection from './StoreReviewSection';
import Toast from './Toast';

import type { Producto, Tienda } from './Types';

// ── Props ─────────────────────────────────────────────────────
interface UrbanTiendziProps {
  tienda?: Tienda;
  accent?: string;
  fontFamily?: string;
  themeConfig?: { primary?: string; modoOscuro?: boolean };
}

// ── Constantes y Estilos ──────────────────────────────────────
const FONTS =
  "@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;700;900&family=Syncopate:wght@400;700&display=swap');";

const TIENDA_DEFAULT = {
  nombre: 'URBAN TIENDZI',
  descripcion: 'EL ESTILO DE LA CALLE EN TU MANO. CALIDAD PREMIUM Y DISEÑO EXCLUSIVO.',
  whatsapp: '549381000000',
  instagram: 'urban.tiendzi',
  ciudad: 'SAN MIGUEL DE TUCUMÁN',
  provincia: 'TUCUMÁN',
  pais: 'ARGENTINA',
};

// ── Componente Principal ──────────────────────────────────────
export default function UrbanTiendzi({ tienda, accent, themeConfig }: UrbanTiendziProps) {
  const { handleNavigate: navigateSection, navigateTo } = useStoreNavigation();

  const resolvedAccent = accent || themeConfig?.primary || '#dc2626';

  // ── Stores ────────────────────────────────────────────────
  const { setTiendaId } = useTiendaIDStore();
  const { logout } = useAuthSessionStore();

  useEffect(() => {
    if (tienda?.id) setTiendaId(tienda.id);
  }, [tienda?.id, setTiendaId]);

  // ── Datos de tienda mergeados ─────────────────────────────
  const mergedTienda = useMemo(
    () => ({
      ...TIENDA_DEFAULT,
      ...tienda,
      nombre: tienda?.nombre || tienda?.titulo || TIENDA_DEFAULT.nombre,
      descripcion: tienda?.descripcion || TIENDA_DEFAULT.descripcion,
      whatsapp: tienda?.whatsapp || TIENDA_DEFAULT.whatsapp,
      instagram: tienda?.instagram || TIENDA_DEFAULT.instagram,
      ciudad: tienda?.ciudad || TIENDA_DEFAULT.ciudad,
      provincia: tienda?.provincia || TIENDA_DEFAULT.provincia,
    }),
    [tienda]
  );

  // ── Carrito & Data ────────────────────────────────────────
  const { carrito, agregarAlCarrito, eliminarItem, sessionId } = useCarrito(tienda?.id || 0);

  const {
    data: productos,
    isLoading: productsLoading,
    isError: productsError,
  } = useStorefrontProductos(tienda?.id || 0);
  const productosList = Array.isArray(productos) ? productos : productos?.datos || [];

  // ── Estado UI ─────────────────────────────────────────────
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [lastOrderId, setLastOrderId] = useState<number | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    visible: boolean;
    imagen?: string;
    nombre?: string;
    precio?: number | string;
  }>({ msg: '', visible: false });

  // ── Handlers ──────────────────────────────────────────────
  const addToCart = async (p: Producto, qty = 1, varianteId?: number) => {
    if (!tienda?.id) return;
    try {
      await agregarAlCarrito({ productoId: p.id, cantidad: qty, varianteId: varianteId || null });
      setToast({
        visible: true,
        msg: `Agregado`,
        imagen: p.imagenPrincipalUrl || p.imagenUrl || p.img || 'https://via.placeholder.com/80',
        nombre: p.nombre || p.name || 'Producto',
        precio: p.precioOferta || p.precio || p.price,
      });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNavigate = useCallback(
    (target: StoreNavTarget) => {
      setSelectedProduct(null);
      navigateSection(target);
    },
    [navigateSection]
  );

  const cartCount = carrito?.cantidad || 0;

  return (
    <div
      style={
        {
          '--urban-acento': resolvedAccent,
          '--urb-acento': resolvedAccent, // For CheckoutView compatibility
          '--urb-txt': '#ffffff',
          '--urb-muted': '#71717a',
          '--urb-border': '#27272a',
          '--urb-surface': '#0a0a0a',
          '--urb-btn-txt': '#ffffff',
        } as React.CSSProperties
      }
    >
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000; color: #fff; overflow-x: hidden; }
        .urban-scroll { overflow-y: auto; height: 100vh; scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: ${resolvedAccent}; }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div className="urban-scroll bg-black">
        <Navbar
          cartCount={cartCount}
          onCart={() => setCartOpen(true)}
          onIngresar={() => navigateTo('auth')}
          onMiCuenta={() => navigateTo('account')}
          onNavigate={handleNavigate}
          logo={tienda?.logoUrl}
          titulo={mergedTienda.nombre}
        />

        <Routes>
          {/* ── HOME ── */}
          <Route
            path="/"
            element={
              selectedProduct ? (
                <ProductDetailView
                  product={selectedProduct}
                  onBack={() => setSelectedProduct(null)}
                  onCart={addToCart}
                  tienda={tienda}
                  onLogin={() => navigateTo('auth')}
                  theme={{
                    acento: resolvedAccent,
                    surface: '#000000',
                    surface2: '#0a0a0a',
                    txt: '#ffffff',
                    muted: '#71717a',
                    border: '#27272a',
                    btnTxt: '#ffffff',
                    modoOscuro: themeConfig?.modoOscuro ?? false,
                  }}
                />
              ) : (
                <>
                  <div id="inicio" />
                  <Hero
                    titulo={mergedTienda.nombre}
                    descripcion={mergedTienda.descripcion}
                    imagenCarrusel={tienda?.carrusel}
                    tituloDos={tienda?.tituloDos}
                    acento={resolvedAccent}
                    onNavigate={handleNavigate}
                  />
                  <Marquee items={tienda?.marqueeItems} />
                  <div id="productos" className="scroll-mt-20">
                    <ProductosDestacados
                      tiendaId={tienda?.id}
                      onSelect={setSelectedProduct}
                      onCart={addToCart}
                      acento={resolvedAccent}
                    />
                    <Productos
                      allProducts={productosList}
                      isLoading={productsLoading}
                      isError={productsError}
                      onSelect={setSelectedProduct}
                      onCart={addToCart}
                      onViewAll={() => navigateTo('catalog')}
                    />
                  </div>
                  <section
                    id="contacto"
                    className="bg-zinc-950 py-24 px-6 border-t border-zinc-900"
                  >
                    <div className="max-w-5xl mx-auto text-center">
                      <h2
                        className="text-white text-5xl uppercase font-black mb-4"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                      >
                        CONTÁCTANOS
                      </h2>
                      <p className="text-zinc-400 uppercase text-xs tracking-[0.3em] font-black mb-10">
                        {mergedTienda.descripcion ||
                          'Escribinos en WhatsApp o seguinos en Instagram para consultas y pedidos.'}
                      </p>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <a
                          href={`https://wa.me/${mergedTienda.whatsapp}`}
                          target="_blank"
                          rel="noreferrer"
                          className="block py-6 px-8 bg-white text-black uppercase font-black tracking-[0.2em] transition hover:bg-zinc-200"
                        >
                          WhatsApp: {mergedTienda.whatsapp}
                        </a>
                        <a
                          href={`https://instagram.com/${mergedTienda.instagram}`}
                          target="_blank"
                          rel="noreferrer"
                          className="block py-6 px-8 bg-zinc-900 border border-zinc-800 text-white uppercase font-black tracking-[0.2em] transition hover:bg-zinc-800"
                        >
                          Instagram: @{mergedTienda.instagram}
                        </a>
                      </div>
                    </div>
                  </section>
                  {tienda?.id && (
                    <StoreReviewSection
                      tiendaId={tienda.id}
                      onLogin={() => navigateTo('auth')}
                      acento={resolvedAccent}
                    />
                  )}
                </>
              )
            }
          />

          {/* ── CATALOG ── */}
          <Route
            path="/catalog"
            element={
              <FullProductCatalog
                allProducts={productosList}
                isLoading={productsLoading}
                isError={productsError}
                onSelect={(p) => {
                  setSelectedProduct(p);
                  navigateTo('');
                }}
                onCart={addToCart}
              />
            }
          />

          {/* ── ABOUT ── */}
          <Route
            path="/about"
            element={
              <AboutUs
                titulo={tienda?.aboutUs?.titulo}
                descripcion={tienda?.aboutUs?.descripcion || mergedTienda.descripcion}
                imagenUrl={tienda?.aboutUs?.imagenUrl}
                direccion={tienda?.aboutUs?.direccion}
                ciudad={mergedTienda.ciudad}
                provincia={mergedTienda.provincia}
                instagram={mergedTienda.instagram}
                acento={resolvedAccent}
              />
            }
          />

          {/* ── AUTH ── */}
          <Route
            path="/auth/*"
            element={
              <AuthView
                onClose={() => navigateTo('')}
                onLoginSuccess={() => navigateTo('account')}
              />
            }
          />

          {/* ── ACCOUNT ── */}
          <Route
            path="/account"
            element={
              <AccountView
                onBack={() => navigateTo('')}
                onLogout={() => {
                  logout();
                  navigateTo('');
                }}
              />
            }
          />

          {/* ── CHECKOUT ── */}
          <Route
            path="/checkout"
            element={
              <div className="pt-10 pb-20">
                <CheckoutView
                  tienda={tienda!}
                  carrito={carrito!}
                  onClose={() => navigateTo('')}
                  sessionId={sessionId}
                  onSuccess={(id) => {
                    setLastOrderId(id);
                    navigateTo('order-success');
                  }}
                />
              </div>
            }
          />

          {/* ── SUCCESS ── */}
          <Route
            path="/order-success"
            element={
              <div className="min-h-[80vh] flex items-center justify-center text-center px-6">
                <div className="max-w-xl">
                  <div
                    className="text-red-600 text-8xl mb-8 font-black"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    CONFIRMED
                  </div>
                  <h1
                    className="text-white text-4xl font-black mb-4 uppercase tracking-tighter"
                    style={{ fontFamily: "'Syncopate', sans-serif" }}
                  >
                    ORDER_RECEIVED
                  </h1>
                  <p className="text-zinc-500 text-lg mb-12 uppercase tracking-widest font-bold">
                    Your order #{lastOrderId} is being processed. Stay tuned for updates.
                  </p>
                  <button
                    onClick={() => navigateTo('')}
                    className="bg-white text-black font-black py-4 px-12 transition duration-300 uppercase tracking-widest text-sm hover:bg-red-600 hover:text-white border-none cursor-pointer"
                  >
                    Return to Street
                  </button>
                </div>
              </div>
            }
          />
        </Routes>

        <Footer
          instagram={mergedTienda.instagram}
          whatsapp={mergedTienda.whatsapp}
          descripcion={mergedTienda.descripcion}
          ciudad={mergedTienda.ciudad}
          pais={mergedTienda.pais}
          nombreTienda={mergedTienda.nombre}
          acento={resolvedAccent}
          onNavigate={handleNavigate}
        />
      </div>

      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={carrito?.items || []}
        removeFromCart={(id) => eliminarItem(id)}
        onConfirm={() => {
          setCartOpen(false);
          navigateTo('checkout');
        }}
      />

      <Toast
        msg={toast.msg}
        visible={toast.visible}
        imagen={toast.imagen}
        nombre={toast.nombre}
        precio={toast.precio}
        acento={resolvedAccent}
      />
    </div>
  );
}
