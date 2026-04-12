import { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useCarrito } from '../../../hooks/useCarrito';
import { useStorefrontDestacados } from '../../../hooks/useStorefrontProducts';
import { useStoreNavigation } from '../../../hooks/useStoreNavigation';
import { useAuthSessionStore } from '../../../store/useAuthSession';
import { useTiendaIDStore } from '../../../store/useTiendaIDStore';

import AccountView from './AccountView';
import AuthView from './AuthView';
import Banner from './Banner';
import CarruselProductos from './CarruselProductos';
import CartDrawer from './CartDrawer';
import CheckoutView from './CheckoutView';
import Footer from './Footer';
import GridProductos from './GridProductos';
import Hero from './Hero';
import Marquee from './Marquee';
import Navbar from './Navbar';
import ProductDetailView from './ProductDetailView';
import SobreNosotros from './SobreNosotros';
import Toast from './Toast';

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&display=swap');
`;

const TIENDA_DEFAULT = {
  nombre: 'VESTE',
  tagline: 'Ropa de autor · Tucumán',
  descripcion:
    'Diseño local con identidad propia. Prendas que combinan comodidad, tendencia y carácter tucumano.',
  whatsapp: '5493812345678',
  instagram: 'veste.tuc',
  ciudad: 'Tucumán',
  pais: 'Argentina',
  aboutUs: {},
};

export interface PlantillaRopaProps {
  tienda?: any;
  tema?: any;
  accent?: string;
  themeConfig?: any;
}

export default function TemplateRopa({ tienda, accent, themeConfig }: PlantillaRopaProps) {
  const { handleNavigate: navigateSection, navigateTo } = useStoreNavigation();
  const resolvedAccent = accent || themeConfig?.primary || '#e63946';
  const isDark = themeConfig?.modoOscuro ?? false;

  const cssVars = useMemo(() => {
    return {
      '--rop-bg': isDark ? '#121212' : '#f7f5f2',
      '--rop-bg-alpha': isDark ? 'rgba(18,18,18,0.96)' : 'rgba(247,245,242,0.96)',
      '--rop-dark': isDark ? '#f5f0e8' : '#141414',
      '--rop-surface': isDark ? '#1e1e1e' : '#ffffff',
      '--rop-acento': resolvedAccent,
      '--rop-muted': isDark ? '#a8a29e' : '#888580',
      '--rop-subtle': isDark ? '#57534e' : '#b8b4af',
      '--rop-border': isDark ? 'rgba(255,255,255,0.08)' : 'rgba(20,20,20,0.09)',
      '--rop-btn-txt': isDark ? '#141414' : '#ffffff',
      '--rop-nav-link': isDark ? 'rgba(245,240,232,0.7)' : 'rgba(20,20,20,0.7)',
      '--rop-slider-text': isDark ? 'rgba(20,20,20,0.45)' : 'rgba(247,245,242,0.35)',
      '--rop-footer-bg': isDark ? '#000000' : '#141414',
    } as React.CSSProperties;
  }, [isDark, resolvedAccent]);

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
      tagline: tienda?.tagline || TIENDA_DEFAULT.tagline,
      descripcion: tienda?.descripcion || TIENDA_DEFAULT.descripcion,
      whatsapp: tienda?.whatsapp || TIENDA_DEFAULT.whatsapp,
      instagram: tienda?.instagram || TIENDA_DEFAULT.instagram,
      ciudad: tienda?.ciudad || TIENDA_DEFAULT.ciudad,
      pais: tienda?.pais || TIENDA_DEFAULT.pais,
      aboutUs: {
        ...(TIENDA_DEFAULT.aboutUs || {}),
        ...(tienda?.aboutUs || {}),
      },
      metodosPago: tienda?.metodosPago || [],
      metodosEntrega: tienda?.metodosEntrega || [],
    }),
    [tienda]
  );

  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [lastOrderId, setLastOrderId] = useState<number | null>(null);
  const [toast, setToast] = useState({ msg: '', visible: false });

  const tiendaIdNum = Number(tienda?.id || 0);
  const { carrito, agregarAlCarrito, actualizarCantidad, eliminarItem, isVaciando, sessionId } =
    useCarrito(tiendaIdNum);

  const { data: destacadosData } = useStorefrontDestacados(tiendaIdNum);
  const destacadosProducts = destacadosData?.datos || [];

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

      if (['', 'inicio', 'contacto', 'productos', 'lookbook', 'nosotros'].includes(target)) {
        if (target === '' || target === 'inicio') {
          navigateTo('');
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 100);
        } else {
          navigateTo('');
          setTimeout(() => {
            document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
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
        \${FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        img { display: block; }
        .vt-scroll { overflow-y: auto; height: 100vh; scroll-behavior: smooth; }
        .vt-hide-mob { display: flex !important; }
        .vt-show-mob { display: none !important; }
        @media(max-width: 640px) {
          .vt-hide-mob { display: none !important; }
          .vt-show-mob { display: flex !important; }
        }
      `}</style>

      <div className="vt-scroll" style={{ background: 'var(--rop-bg)' }}>
        <Navbar
          cartCount={cartCount}
          onCart={() => setCartOpen(true)}
          onIngresar={() => navigateTo('auth')}
          onMiCuenta={() => navigateTo('account')}
          onNavigate={handleNavigate}
          tienda={mergedTienda}
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
                    carrusel={tienda?.carrusel || []}
                    tienda={mergedTienda}
                    onNavigate={handleNavigate}
                  />
                  <Marquee tienda={mergedTienda} />

                  <div id="destacados">
                    <CarruselProductos
                      items={destacadosProducts}
                      onSelect={(p) => setSelectedProduct(p)}
                      onCart={addToCart}
                    />
                  </div>
                  <div id="productos">
                    <GridProductos
                      onSelect={(p) => setSelectedProduct(p)}
                      onCart={addToCart}
                      tiendaId={tienda?.id}
                    />
                  </div>
                  <Banner tienda={mergedTienda} />
                  <div id="nosotros">
                    <SobreNosotros tienda={mergedTienda} />
                  </div>
                </>
              )
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
              <div style={{ background: 'var(--rop-bg)', minHeight: '100vh', paddingTop: '2rem' }}>
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
              <div
                style={{
                  padding: '8rem 2rem',
                  textAlign: 'center',
                  background: 'var(--rop-bg)',
                  minHeight: '100vh',
                }}
              >
                <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✨</div>
                  <h1
                    style={{
                      fontFamily: "'Bebas Neue', serif",
                      fontSize: '3.5rem',
                      color: 'var(--rop-dark)',
                      marginBottom: '1rem',
                      letterSpacing: '.04em',
                    }}
                  >
                    ¡PEDIDO RECIBIDO!
                  </h1>
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '1.1rem',
                      color: 'var(--rop-muted)',
                      marginBottom: '2.5rem',
                    }}
                  >
                    Muchas gracias por tu compra. Tu pedido <strong>#{lastOrderId}</strong> ya fue
                    registrado. Nos pondremos en contacto con vos a la brevedad.
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
                      style={{
                        width: '100%',
                        padding: '15px 40px',
                        background: 'var(--rop-acento)',
                        color: 'var(--rop-btn-txt)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '.8rem',
                        fontWeight: 600,
                        letterSpacing: '.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Hablar por WhatsApp
                    </button>
                    <button
                      onClick={() => navigateTo('')}
                      style={{
                        width: '100%',
                        padding: '15px 40px',
                        background: 'transparent',
                        color: 'var(--rop-dark)',
                        border: '1px solid var(--rop-acento)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '.8rem',
                        fontWeight: 600,
                        letterSpacing: '.1em',
                        textTransform: 'uppercase',
                      }}
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
