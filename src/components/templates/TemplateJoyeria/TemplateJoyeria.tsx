import { useCallback, useEffect, useMemo, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useStoreNavigation } from '../../../hooks/useStoreNavigation';
import { useCarrito } from '../../../hooks/useCarrito';
import { useAuthSessionStore } from '../../../store/useAuthSession';
import { useTiendaIDStore } from '../../../store/useTiendaIDStore';

import AboutUs from './AboutUs';
import AccountView from './AccountView';
import AuthView from './AuthView';
import CartDrawer from './CartDrawer';
import Contact from './Contact';
import Footer from './Footer';
import Hero from './Hero';
import Marquee from './Marquee';
import Navbar from './Navbar';
import ProductDetailView from './ProductDetailView';
import Productos from './Productos';
import FullProductCatalog from './FullProductCatalog';
import CheckoutView from './CheckoutView';
import Toast from './Toast';
import TrustBadges from './TrustBadges';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');`;

const TIENDA_DEFAULT = {
  nombre: 'Alma Dorada',
  descripcion: 'Joyería y accesorios artesanales hechos a mano en Tucumán. Cada pieza cuenta una historia.',
  whatsapp: '5493812345678',
  instagram: 'almadorada.tuc',
  facebook: 'almadoradatucuman',
  ciudad: 'Tucumán',
  provincia: 'Tucumán',
  pais: 'Argentina',
  aboutUs: {},
};

export interface PlantillaAccesoriosProps {
  tienda?: any;
  accent?: string;
  themeConfig?: any;
}

type NavTarget = 'inicio' | 'catalog' | 'contacto' | 'about';

function buildCssVars(isDark: boolean, acento: string): React.CSSProperties {
  return {
    '--acc-bg': isDark ? '#121212' : '#f5f1eb',
    '--acc-bg-alpha': isDark ? 'rgba(18,18,18,0.97)' : 'rgba(245,241,235,0.97)',
    '--acc-surface': isDark ? '#1e1e1e' : '#ffffff',
    '--acc-surface2': isDark ? '#262626' : '#ede9e2',
    '--acc-txt': isDark ? '#ede9e2' : '#2a1f14',
    '--acc-muted': isDark ? '#a89e94' : '#7a6e62',
    '--acc-subtle': isDark ? '#7a6e62' : '#a89e94',
    '--acc-border': isDark ? 'rgba(255,255,255,0.08)' : 'rgba(42,31,20,0.1)',
    '--acc-btn-txt': isDark ? '#2a1f14' : '#ffffff',
    '--acc-footer-bg': isDark ? '#000000' : '#2a1f14',
    '--acc-acento': acento,
  } as React.CSSProperties;
}

export default function TemplateJoyeria({ tienda, accent, themeConfig }: PlantillaAccesoriosProps) {
  const { handleNavigate: navigateSection, navigateTo } = useStoreNavigation();
  const resolvedAccent = accent || themeConfig?.primary || '#b5835a';
  const isDark = themeConfig?.modoOscuro ?? false;
  const cssVars = useMemo(() => buildCssVars(isDark, resolvedAccent), [isDark, resolvedAccent]);

  const { setTiendaId } = useTiendaIDStore();
  const { logout, cliente } = useAuthSessionStore();

  useEffect(() => {
    if (tienda?.id) setTiendaId(tienda.id);
  }, [tienda?.id, setTiendaId]);

  const mergedTienda = useMemo(
    () => ({
      ...TIENDA_DEFAULT,
      ...tienda,
      nombre: tienda?.nombre || tienda?.titulo || TIENDA_DEFAULT.nombre,
      descripcion: tienda?.descripcion || TIENDA_DEFAULT.descripcion,
      whatsapp: tienda?.whatsapp || TIENDA_DEFAULT.whatsapp,
      instagram: tienda?.instagram || TIENDA_DEFAULT.instagram,
      facebook: tienda?.facebook || TIENDA_DEFAULT.facebook,
      ciudad: tienda?.ciudad || TIENDA_DEFAULT.ciudad,
      pais: tienda?.pais || TIENDA_DEFAULT.pais,
      aboutUs: {
        ...(TIENDA_DEFAULT.aboutUs || {}),
        ...(tienda?.aboutUs || {}),
      },
    }),
    [tienda]
  );

  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [lastOrderId, setLastOrderId] = useState<number | null>(null);
  const [toast, setToast] = useState({ msg: '', visible: false });

  const { carrito, agregarAlCarrito, actualizarCantidad, eliminarItem, isVaciando, sessionId } =
    useCarrito(tienda?.id || 0);

  const cartCount = carrito?.cantidad || 0;

  const addToCart = async (p: any, qty = 1, varianteId?: number) => {
    if (!tienda?.id) return;
    try {
      await agregarAlCarrito({ productoId: p.id, cantidad: qty, varianteId: varianteId || null });
      setToast({ msg: `${p.nombre} agregado al carrito`, visible: true });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2200);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNavigate = useCallback(
    (target: string) => {
      setSelectedProduct(null);

      if (['inicio', 'contacto'].includes(target)) {
        if (target === 'inicio') {
           navigateTo('');
           setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 100);
        } else {
           navigateTo('');
           setTimeout(() => { document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }); }, 100);
        }
      } else {
        navigateTo(target);
      }
    },
    [navigateTo]
  );

  return (
    <div style={cssVars}>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        img { display: block; }
        .ac-scroll { overflow-y: auto; height: 100vh; scroll-behavior: smooth; }
        .ac-hide-mob { display: flex !important; }
        .ac-show-mob { display: none !important; }
        @media(max-width: 640px) {
          .ac-hide-mob { display: none !important; }
          .ac-show-mob { display: flex !important; }
        }
      `}</style>

      <div className="ac-scroll" style={{ background: 'var(--acc-bg)' }}>
        <Navbar
          cartCount={cartCount}
          onCart={() => setCartOpen(true)}
          onIngresar={() => navigateTo('auth')}
          onMiCuenta={() => navigateTo('account')}
          onNavigate={handleNavigate}
          logo={tienda?.logoUrl}
          titulo={mergedTienda.nombre}
          theme={{}}
        />

        <Routes>
          <Route
            path="/"
            element={
              selectedProduct ? (
                <ProductDetailView
                  product={selectedProduct}
                  onBack={() => setSelectedProduct(null)}
                  onCart={addToCart}
                  tienda={mergedTienda}
                />
              ) : (
                <>
                  <div id="inicio" />
                  <Hero
                    titulo={mergedTienda.nombre}
                    descripcion={mergedTienda.descripcion}
                    imagenes={tienda?.carrusel?.length ? tienda.carrusel.map((img: any) => img.url) : undefined}
                    ciudad={mergedTienda.ciudad}
                    whatsapp={mergedTienda.whatsapp}
                    onNavigate={handleNavigate}
                  />
                  <Marquee />
                  <div id="productos">
                    <Productos
                      onSelect={(p) => {
                         setSelectedProduct(p);
                      }}
                      onCart={addToCart}
                      tiendaId={tienda?.id}
                      onViewAll={() => navigateTo('catalog')}
                    />
                  </div>
                  <TrustBadges />
                  <div id="contacto">
                    <Contact tienda={mergedTienda} />
                  </div>
                </>
              )
            }
          />

          <Route
            path="/catalog"
            element={
              <div className="px-6 py-10 min-h-screen" style={{ background: 'var(--acc-bg)' }}>
                <button
                  onClick={() => navigateTo('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--acc-muted)',
                    fontFamily: "'Jost',sans-serif",
                    fontSize: '.75rem',
                    fontWeight: 400,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '2rem',
                    padding: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '.12em',
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>←</span> Volver al inicio
                </button>
                <FullProductCatalog
                  tiendaId={tienda?.id || 0}
                  onSelect={(p) => {
                    setSelectedProduct(p);
                    navigateTo('');
                  }}
                  onCart={addToCart}
                />
              </div>
            }
          />

          <Route
            path="/about"
            element={
              <div className="min-h-screen" style={{ background: 'var(--acc-bg)' }}>
                <div style={{ padding: '2rem', maxWidth: '1060px', margin: '0 auto' }}>
                  <button
                    onClick={() => navigateTo('')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--acc-muted)',
                      fontFamily: "'Jost',sans-serif",
                      fontSize: '.75rem',
                      fontWeight: 400,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '1rem',
                      padding: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '.12em',
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>←</span> Volver al inicio
                  </button>
                </div>
                <AboutUs tienda={mergedTienda} />
              </div>
            }
          />

          <Route
            path="/auth/*"
            element={
              <AuthView
                onClose={() => navigateTo('')}
                onLoginSuccess={() => navigateTo('account')}
                tienda={mergedTienda}
              />
            }
          />

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

          <Route
            path="/checkout"
            element={
              <div style={{ background: 'var(--acc-bg)', minHeight: '100vh', paddingTop: '2rem' }}>
                <CheckoutView
                  tienda={mergedTienda}
                  carrito={carrito!}
                  sessionId={sessionId}
                  onClose={() => navigateTo('')}
                  onSuccess={(id) => {
                    setLastOrderId(id);
                    navigateTo('order-success');
                  }}
                />
              </div>
            }
          />

          <Route
            path="/order-success"
            element={
              <div style={{ padding: '8rem 2rem', textAlign: 'center', background: 'var(--acc-bg)', minHeight: '100vh' }}>
                <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✨</div>
                  <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3.5rem', color: 'var(--acc-txt)', marginBottom: '1rem', fontWeight: 300 }}>¡PEDIDO RECIBIDO!</h1>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '1.1rem', color: 'var(--acc-muted)', marginBottom: '2.5rem' }}>
                    Muchas gracias por tu compra. Tu pedido <strong>#{lastOrderId}</strong> ya fue registrado.
                    Nos pondremos en contacto con vos a la brevedad.
                  </p>
                  <div className="flex flex-col w-full gap-4">
                    <button
                      onClick={() => {
                        const msj = `¡Hola! Acabo de realizar el pedido #${lastOrderId} en la web y quería confirmar los detalles.`;
                        window.open(`https://wa.me/${mergedTienda.whatsapp}?text=${encodeURIComponent(msj)}`, '_blank');
                      }}
                      style={{ width: '100%', padding: '15px 40px', background: 'var(--acc-acento)', color: 'var(--acc-btn-txt)', border: 'none', borderRadius: '40px', cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: '.8rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase' }}
                    >
                      Hablar por WhatsApp
                    </button>
                    <button
                      onClick={() => navigateTo('')}
                      style={{ width: '100%', padding: '15px 40px', background: 'transparent', color: 'var(--acc-txt)', border: '1px solid var(--acc-acento)', borderRadius: '40px', cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: '.8rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase' }}
                    >
                      VOLVER A LA TIENDA
                    </button>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>

        <Footer tienda={mergedTienda} />
      </div>

      {cartOpen && (
        <CartDrawer
          items={carrito?.items || []}
          isVaciando={isVaciando}
          onClose={() => setCartOpen(false)}
          onQty={(id, q) => actualizarCantidad({ itemId: id, cantidad: q })}
          onRemove={(id) => eliminarItem(id)}
          onConfirm={() => {
            setCartOpen(false);
            navigateTo('checkout');
          }}
        />
      )}

      <Toast msg={toast.msg} visible={toast.visible} />
    </div>
  );
}
