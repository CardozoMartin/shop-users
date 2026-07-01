import { lazy, Suspense, Component } from 'react';
import type { ReactNode } from 'react';
import { resolveTemplateIdFromShop } from './registry';
import { useStorefrontProductos } from '../hooks/useStorefrontProducts';
import EmptyStoreView from './shared/EmptyStoreView';
import StorePopup from './shared/StorePopup';

// ── Error Boundary para capturar crashes del template ────────────
class TemplateBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: '#0d0d12', color: '#f3f4f6', fontFamily: 'sans-serif', padding: 32, textAlign: 'center' }}>
          <p style={{ fontSize: 48 }}>⚠️</p>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Ocurrió un error al cargar la tienda</h2>
          <p style={{ fontSize: 14, color: '#9ca3af', maxWidth: 380 }}>{this.state.error.message}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 8, padding: '10px 24px', borderRadius: 12, border: 'none', background: '#f97316', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
          >
            Recargar página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const PlantillaGorras = lazy(() => import('./templates/TemplateGorras/TemplateGorras'));
const PlantillaAccesorios = lazy(() => import('./templates/TemplateJoyeria/TemplateJoyeria'));
const PlantillaRopa = lazy(() => import('./templates/TemplateRopa/TemplateRopa'));
const PlantillaUrban = lazy(() => import('./templates/TemplateUrban/UrbanTiendzi'));

const TEMPLATES: Record<string, React.ComponentType<any>> = {
  plantilla_accesorios: PlantillaAccesorios,
  plantilla_gorras: PlantillaGorras,
  plantilla_ropa: PlantillaRopa,
  plantilla_urban: PlantillaUrban,
  plantilla_moder: PlantillaRopa,
  plantilla_pink: PlantillaAccesorios,
};

interface StoreRendererProps {
  tienda: any;
}

const StoreRenderer = ({ tienda }: StoreRendererProps) => {
  const { data: productosData, isLoading: isLoadingProd } = useStorefrontProductos(tienda?.id || 0);

  const templateId = resolveTemplateIdFromShop(tienda);
  const Template = TEMPLATES[templateId] ?? PlantillaGorras;
  const tema = tienda?.temaConfig ?? {};

  const getDefaultDesign = (id: string) => {
    switch (id) {
      case 'plantilla_gorras':
        return { accent: '#f97316', font: 'Playfair Display' };
      case 'plantilla_ropa':
        return { accent: '#e63946', font: 'Bebas Neue' };
      case 'plantilla_urban':
        return { accent: '#ef4444', font: 'Bebas Neue' };
      default:
        return { accent: '#b5835a', font: 'Cormorant Garamond' };
    }
  };

  const { accent: defaultAccent, font: defaultFont } = getDefaultDesign(templateId);
  const resolvedAccent = tema?.colorAcento || tema?.colorPrimario || defaultAccent;
  const isPreview = new URLSearchParams(window.location.search).get('preview') === 'true';
  const hasProducts = Boolean(productosData?.datos?.length);

  if (isLoadingProd) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500" />
      </div>
    );
  }

  // Mostrar EmptyStoreView solo si la tienda está explícitamente inactiva o desactivada
  const tiendaActiva = tienda?.activa !== false;
  if (!hasProducts && !isPreview && !tiendaActiva) {
    return <EmptyStoreView tienda={tienda} accent={resolvedAccent} />;
  }

  return (
    <TemplateBoundary>
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500" />
        </div>
      }
    >
      {!hasProducts && isPreview && (
        <div className="sticky top-0 z-[99999] flex items-center justify-center gap-2 border-b border-amber-500/20 bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-white shadow-lg sm:text-xs">
          <span className="inline-block animate-pulse">!</span>
          <span>
            Modo Vista Previa: Tu tienda esta vacia. Tus clientes veran la pantalla
            "Tienda en Preparacion" hasta que cargues tu primer producto.
          </span>
        </div>
      )}

      <StorePopup tiendaId={tienda.id} />
      <Template
        tienda={tienda}
        tema={tema}
        accent={resolvedAccent}
        fontFamily={tema?.fuenteTitulo || defaultFont}
        themeConfig={{
          primary: resolvedAccent,
          secondary: tema?.colorSecundario || '#64748b',
          accent: resolvedAccent,
          background: tema?.colorFondo || (templateId === 'plantilla_pink' ? '#fff1f2' : '#ffffff'),
          text: tema?.colorTexto || '#1e293b',
          buttonBg: tema?.buttonBg || tema?.colorBoton || resolvedAccent,
          buttonText: tema?.colorTextoBoton || '#ffffff',
          navbarBg: tema?.colorNavbarBg || '#ffffff',
          navbarText: tema?.colorNavbarText || resolvedAccent,
          fontTitle: tema?.fuenteTitulo || defaultFont,
          fontBody: tema?.fuenteCuerpo || 'Inter',
          navbarStyle: tema?.navbarStyle || 'STICKY',
          heroLayout: tema?.heroLayout || 'CENTERED',
          cardStyle: tema?.cardStyle || 'MINIMAL',
          borderRadius: tema?.borderRadius || 'MD',
          heroCtaTexto: tema?.heroCtaTexto || 'Comprar ahora',
          heroBg: tema?.heroBg,
          heroTitulo: tema?.heroTitulo,
          heroSubtitulo: tema?.heroSubtitulo,
          borderNavBg: tema?.borderNavBg || '#E5E7EB',
          colorTextNav: tema?.colorTextNav,
          hoverTextNav: tema?.hoverTextNav,
          navbarFixed: tema?.navbarFixed ?? true,
          seccionesVisibles: tema?.seccionesVisibles,
          cardMostrarPrecio: tema?.cardMostrarPrecio ?? true,
          cardMostrarBadge: tema?.cardMostrarBadge ?? true,
          modoOscuro: tema?.modoOscuro ?? true,
        }}
        personalizacion={{
          temaConfig: {
            ...tema,
            color_primario: tema?.colorPrimario,
            hero_titulo: tema?.heroTitulo || tienda.titulo,
            hero_subtitulo: tema?.heroSubtitulo || tienda.descripcion,
          },
          sections: Object.entries(
            (tema?.seccionesVisibles && typeof tema.seccionesVisibles === 'object')
              ? tema.seccionesVisibles
              : { hero: true, products: true, contact: true, footer: true, navbar: true }
          ).map(([key, enabled], i) => ({
            id: i + 1,
            key,
            enabled,
          })),
        }}
      />
    </Suspense>
    </TemplateBoundary>
  );
};

export default StoreRenderer;
