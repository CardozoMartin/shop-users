import { resolveTemplateIdFromShop } from "./registry";
import PlantillaGorras from "./templates/TemplateGorras/TemplateGorras";
import PlantillaAccesorios from "./templates/TemplateJoyeria/TemplateJoyeria";
import PlantillaRopa from "./templates/TemplateRopa/TemplateRop";


const TEMPLATES: Record<string, React.ComponentType<any>> = {
  plantilla_accesorios: PlantillaAccesorios,
  plantilla_gorras: PlantillaGorras,
  plantilla_ropa: PlantillaRopa,
  // Pendientes de implementación — usan la plantilla visual más cercana como fallback
  plantilla_moder: PlantillaRopa,
  plantilla_pink: PlantillaAccesorios,
};


interface StoreRendererProps {
  tienda: any;
}

const StoreRenderer = ({ tienda }: StoreRendererProps) => {
  const templateId = resolveTemplateIdFromShop(tienda);
  const Template = TEMPLATES[templateId] ?? PlantillaAccesorios;
  const tema = tienda.temaConfig;

  const getDefaultDesign = (id: string) => {
    switch (id) {
      case 'plantilla_gorras':
        return { accent: '#f97316', font: 'Playfair Display' };
      case 'plantilla_ropa':
        return { accent: '#e63946', font: 'Bebas Neue' };
      default:
        return { accent: '#b5835a', font: 'Cormorant Garamond' };
    }
  };

  const { accent: defaultAccent, font: defaultFont } = getDefaultDesign(templateId);

  const resolvedAccent = tema?.colorAcento || tema?.colorPrimario || defaultAccent;

  return (
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
  );
};

export default StoreRenderer;
