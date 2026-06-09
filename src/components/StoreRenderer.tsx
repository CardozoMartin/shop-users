import { lazy, Suspense } from 'react';
import { resolveTemplateIdFromShop } from './registry';
import { useStorefrontProductos } from '../hooks/useStorefrontProducts';

const PlantillaGorras = lazy(() => import('./templates/TemplateGorras/TemplateGorras'));
const PlantillaAccesorios = lazy(() => import('./templates/TemplateJoyeria/TemplateJoyeria'));
const PlantillaRopa = lazy(() => import('./templates/TemplateRopa/TemplateRopa'));
const PlantillaUrban = lazy(() => import('./templates/TemplateUrban/UrbanTiendzi'));

const TEMPLATES: Record<string, React.ComponentType<any>> = {
  plantilla_accesorios: PlantillaAccesorios,
  plantilla_gorras: PlantillaGorras,
  plantilla_ropa: PlantillaRopa,
  plantilla_urban: PlantillaUrban,
  // Pendientes de implementación — usan la plantilla visual más cercana como fallback
  plantilla_moder: PlantillaRopa,
  plantilla_pink: PlantillaAccesorios,
};

interface StoreRendererProps {
  tienda: any;
}

const StoreRenderer = ({ tienda }: StoreRendererProps) => {
  const { data: productosData, isLoading: isLoadingProd } = useStorefrontProductos(tienda?.id || 0);

  const templateId = resolveTemplateIdFromShop(tienda);
  const Template = TEMPLATES[templateId] ?? PlantillaAccesorios;
  const tema = tienda.temaConfig;

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
  const hasProducts = productosData?.datos && productosData.datos.length > 0;

  if (isLoadingProd) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
        </div>
      }
    >
      {!hasProducts && isPreview && (
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-center py-2.5 px-4 text-[11px] sm:text-xs font-bold tracking-wider uppercase sticky top-0 z-[99999] flex items-center justify-center gap-2 shadow-lg border-b border-amber-500/20">
          <span className="inline-block animate-pulse">⚠️</span>
          <span>Modo Vista Previa: Tu tienda está vacía. Tus clientes verán la pantalla "Tienda en Preparación" hasta que cargues tu primer producto.</span>
        </div>
      )}
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
          tema?.seccionesVisibles ?? {
            hero: true,
            products: true,
            contact: true,
            footer: true,
            navbar: true,
          }
        ).map(([key, enabled], i) => ({
          id: i + 1,
          key,
          enabled,
        })),
      }}
    />
  </Suspense>
);
};

export default StoreRenderer;
