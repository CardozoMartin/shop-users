import { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useCarrito } from '../../../hooks/useCarrito';
import { useStoreNavigation } from '../../../hooks/useStoreNavigation';
import { useAuthSessionStore } from '../../../store/useAuthSession';
import { useTiendaIDStore } from '../../../store/useTiendaIDStore';

// ── Componentes ───────────────────────────────────────────────
import AboutUs from './AboutUs';
import AccountView from './AccountView';
import AuthView from './AuthView';
import CartDrawer from './CartDrawer';
import CheckoutView from './CheckoutView';
import Contact from './Contact';
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
import type { IHeroProps, Producto, Tienda } from './Types';

// ── Tipos ─────────────────────────────────────────────────────
export interface PlantillaGorrasProps {
  tienda?: Tienda;
  accent?: string;
  themeConfig?: {
    primary?: string;
    modoOscuro?: boolean;
  };
}

type NavTarget = 'inicio' | 'producto' | 'contacto' | 'sobrenosotros';

// ── Constantes ────────────────────────────────────────────────
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const TIENDA_DEFAULT = {
  nombre: 'CapZone',
  descripcion: 'Gorras y accesorios urbanos para los que marcan tendencia en Tucumán.',
  whatsapp: '5493812345678',
  instagram: 'capzone.tuc',
  facebook: 'capzonetucuman',
  ciudad: 'Tucumán',
  provincia: 'Tucumán',
  pais: 'Argentina',
};

// ── Helpers puros (fuera del componente) ──────────────────────

/** CSS variables del tema */
function buildCssVars(isDark: boolean, acento: string): React.CSSProperties {
  return {
    '--gor-bg': isDark ? '#121212' : '#ffffff',
    '--gor-bg-alpha': isDark ? 'rgba(18,18,18,0.97)' : 'rgba(255,255,255,0.97)',
    '--gor-surface': isDark ? '#1e1e1e' : '#fafafa',
    '--gor-surface2': isDark ? '#262626' : '#f3f4f6',
    '--gor-txt': isDark ? '#f3f4f6' : '#111827',
    '--gor-muted': isDark ? '#9ca3af' : '#6b7280',
    '--gor-subtle': isDark ? '#6b7280' : '#9ca3af',
    '--gor-border': isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    '--gor-btn-txt': isDark ? '#111827' : '#ffffff',
    '--gor-footer-bg': isDark ? '#000000' : '#111827',
    '--gor-acento': acento,
  } as React.CSSProperties;
}

const THEME = {
  bg: 'var(--gor-bg)',
  surface: 'var(--gor-surface)',
  surface2: 'var(--gor-surface2)',
  txt: 'var(--gor-txt)',
  muted: 'var(--gor-muted)',
  subtle: 'var(--gor-subtle)',
  border: 'var(--gor-border)',
  acento: 'var(--gor-acento)',
  btnTxt: 'var(--gor-btn-txt)',
};

// ── Componente Principal ──────────────────────────────────────
export default function PlantillaGorras({ tienda, accent, themeConfig }: PlantillaGorrasProps) {
  const { handleNavigate: navigateSection, navigateTo } = useStoreNavigation();
  const resolvedAccent = accent || themeConfig?.primary || '#f97316';
  const isDark = themeConfig?.modoOscuro ?? false;
  const cssVars = useMemo(() => buildCssVars(isDark, resolvedAccent), [isDark, resolvedAccent]);
  const theme = useMemo(
    () => ({
      ...THEME,
      modoOscuro: isDark,
    }),
    [isDark]
  );

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
      metodosEntrega: tienda?.metodosEntrega || [],
      metodosPago: tienda?.metodosPago || [],
    }),
    [tienda]
  );

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

  // ── Carrito ───────────────────────────────────────────────
  const { carrito, agregarAlCarrito, actualizarCantidad, eliminarItem, isVaciando, sessionId } =
    useCarrito(tienda?.id || 0);

  const cartCount = carrito?.cantidad || 0;

  const addToCart = async (p: Producto, qty = 1, varianteId?: number) => {
    if (!tienda?.id) return;
    try {
      await agregarAlCarrito({ productoId: p.id, cantidad: qty, varianteId: varianteId || null });
      setToast({
        visible: true,
        msg: `${p.nombre} agregado al carrito`,
        imagen: p.imagenPrincipalUrl || p.imagen || 'https://via.placeholder.com/80',
        nombre: p.nombre || 'Producto',
        precio:
          p.precioOferta && Number(p.precioOferta) > 0 && Number(p.precioOferta) < Number(p.precio)
            ? p.precioOferta
            : p.precio,
      });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2200);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Navegación ────────────────────────────────────────────
  const handleNavigate = useCallback(
    (target: NavTarget) => {
      setSelectedProduct(null);
      navigateSection(target);
    },
    [navigateSection]
  );

  // ── Props del Hero ────────────────────────────────────────
  const heroProps: IHeroProps = {
    titulo: mergedTienda.nombre,
    descripcion: mergedTienda.descripcion,
    imagenCarrusel: tienda?.carrusel || [],
    tituloDos: tienda?.tituloDos,
    acento: resolvedAccent,
    txtColor: isDark ? '#f3f4f6' : '#111827',
    btnTextColor: isDark ? '#111827' : '#ffffff',
    bgColor: isDark ? '#121212' : '#ffffff',
    mutedColor: isDark ? '#9ca3af' : '#6b7280',
    whatsapp: mergedTienda.whatsapp,
    onNavigate: handleNavigate,
  };

  return (
    <div style={cssVars}>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        img { display: block; }
        .cz-scroll { overflow-y: auto; height: 100vh; scroll-behavior: smooth; }
        .cz-hide-mob { display: flex !important; }
        .cz-show-mob { display: none !important; }
        @media(max-width: 640px) {
          .cz-hide-mob { display: none !important; }
          .cz-show-mob { display: flex !important; }
        }
      `}</style>

      <div className="cz-scroll" style={{ background: 'var(--gor-bg)' }}>
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
                  tienda={mergedTienda}
                  theme={theme}
                  onLogin={() => navigateTo('auth')}
                />
              ) : (
                <>
                  <div id="inicio" />
                  <Hero {...heroProps} />
                  <Marquee items={tienda?.marqueeItems} />
                  <div id="productos" className="scroll-mt-20">
                    <ProductosDestacados
                      onSelect={setSelectedProduct}
                      onCart={addToCart}
                      tiendaId={tienda?.id}
                    />
                    <Productos
                      onSelect={setSelectedProduct}
                      onCart={addToCart}
                      tiendaId={tienda?.id}
                      onViewAll={() => navigateTo('catalog')}
                    />
                  </div>
                  <div id="contacto">
                    <Contact tienda={mergedTienda} theme={THEME} />
                  </div>
                  {tienda?.id && (
                    <StoreReviewSection
                      tiendaId={tienda.id}
                      onLogin={() => navigateTo('auth')}
                      theme={THEME}
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
              <div className="px-6 py-10 min-h-screen">
                <button
                  onClick={() => navigateTo('')}
                  className="mb-8 px-5 py-2.5 rounded-full border-none cursor-pointer font-bold text-xs uppercase tracking-widest transition-all hover:scale-105"
                  style={{
                    background: resolvedAccent,
                    color: 'white',
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  ← Volver al Inicio
                </button>
                <FullProductCatalog
                  tiendaId={tienda?.id || 0}
                  onSelect={(p) => {
                    setSelectedProduct(p);
                    navigateTo('');
                  }}
                  onCart={addToCart}
                  accent={resolvedAccent}
                  theme={THEME}
                />
              </div>
            }
          />

          {/* ── ABOUT ── */}
          <Route
            path="/about"
            element={
              <div className="px-6 py-10">
                <button
                  onClick={() => navigateTo('')}
                  className="mb-6 px-4 py-2 rounded-full border-none cursor-pointer font-semibold transition-opacity hover:opacity-80"
                  style={{
                    background: 'var(--gor-acento)',
                    color: 'var(--gor-btn-txt)',
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  ← Volver a Inicio
                </button>
                <AboutUs
                  titulo={tienda?.aboutUs?.titulo}
                  descripcion={tienda?.aboutUs?.descripcion || mergedTienda.descripcion}
                  imagenUrl={tienda?.aboutUs?.imagenUrl}
                  direccion={tienda?.aboutUs?.direccion}
                  ciudad={mergedTienda.ciudad}
                  provincia={mergedTienda.provincia}
                  instagram={mergedTienda.instagram}
                  acento={resolvedAccent}
                  bg="var(--gor-bg)"
                  border="var(--gor-border)"
                  txt="var(--gor-txt)"
                  muted="var(--gor-muted)"
                />
              </div>
            }
          />

          {/* ── AUTH ── */}
          <Route
            path="/auth/*"
            element={
              <AuthView
                onClose={() => navigateTo('')}
                onLoginSuccess={() => navigateTo('account')}
                tienda={tienda}
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
              <CheckoutView
                tienda={tienda || mergedTienda}
                carrito={carrito!}
                onClose={() => navigateTo('')}
                sessionId={sessionId}
                onSuccess={(id) => {
                  setLastOrderId(id);
                  navigateTo('order-success');
                }}
              />
            }
          />

          {/* ── SUCCESS ── */}
          <Route
            path="/order-success"
            element={
              <div className="px-6 py-20 flex flex-col items-center text-center max-w-[500px] mx-auto">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-8"
                  style={{
                    background: `${resolvedAccent}15`,
                    border: `2px solid ${resolvedAccent}`,
                  }}
                >
                  🎉
                </div>
                <h1
                  className="font-bold mb-4"
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: '2.5rem',
                    color: 'var(--gor-txt)',
                  }}
                >
                  ¡Pedido Recibido!
                </h1>
                <p
                  className="text-[.95rem] leading-relaxed mb-10"
                  style={{ color: 'var(--gor-muted)', fontFamily: "'DM Sans',sans-serif" }}
                >
                  Muchas gracias por tu compra. Tu pedido <strong>#{lastOrderId}</strong> ya fue
                  registrado. Nos pondremos en contacto con vos a la brevedad para coordinar el pago
                  y envío.
                </p>
                <div className="flex flex-col w-full gap-4">
                  <button
                    onClick={() => {
                      const msj = `¡Hola! Acabo de realizar el pedido #${lastOrderId} en la web y quería confirmar los detalles.`;
                      window.open(
                        `https://wa.me/${mergedTienda.whatsapp}?text=${encodeURIComponent(msj)}`,
                        '_blank'
                      );
                    }}
                    className="w-full py-4 rounded-xl font-bold border-none cursor-pointer transition-all hover:scale-[1.02]"
                    style={{
                      background: resolvedAccent,
                      color: 'var(--gor-btn-txt)',
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    Hablar por WhatsApp
                  </button>
                  <button
                    onClick={() => navigateTo('')}
                    className="w-full py-4 rounded-xl font-bold bg-transparent cursor-pointer transition-all hover:opacity-70"
                    style={{
                      border: `1.5px solid var(--gor-border)`,
                      color: 'var(--gor-txt)',
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    Volver al inicio
                  </button>
                </div>
              </div>
            }
          />
        </Routes>

        {/* ── GLOBAL FOOTER ── */}
        <Footer
          instagram={mergedTienda.instagram}
          whatsapp={mergedTienda.whatsapp}
          descripcion={mergedTienda.descripcion}
          ciudad={mergedTienda.ciudad}
          pais={mergedTienda.pais}
          nombreTienda={mergedTienda.nombre}
          acento="var(--gor-acento)"
          onNavigate={handleNavigate}
        />
      </div>

      {/* ── Cart Drawer ── */}
      {cartOpen && (
        <CartDrawer
          carrito={carrito}
          tienda={tienda}
          isVaciando={isVaciando}
          onClose={() => setCartOpen(false)}
          onQty={(id, q) => actualizarCantidad({ itemId: id, cantidad: q })}
          onRemove={(id) => eliminarItem(id)}
          onConfirmar={() => {
            setCartOpen(false);
            navigateTo('checkout');
          }}
          theme={THEME}
        />
      )}

      {/* ── Toast ── */}
      <Toast
        msg={toast.msg}
        visible={toast.visible}
        imagen={toast.imagen}
        nombre={toast.nombre}
        precio={toast.precio}
        bg="var(--gor-bg)"
        txt="var(--gor-txt)"
        acento="var(--gor-acento)"
      />
    </div>
  );
}
