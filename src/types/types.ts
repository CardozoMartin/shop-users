// ─── Imagen del carrusel ─────────────────────────────────────────────────────

export interface CarruselItem {
  id?: number;
  url: string;
  src?: string;
  titulo?: string | null;
  subtitulo?: string;
  linkUrl?: string | null;
  orden?: number;
  activa?: boolean;
}

// ─── About Us ─────────────────────────────────────────────────────────────

export interface AboutUsData {
  titulo?: string | null;
  descripcion?: string | null;
  imagenUrl?: string | null;
  direccion?: string | null;
}

// ─── Marquee Item ─────────────────────────────────────────────────────────

export interface MarqueeItem {
  id?: number;
  texto: string;
  orden?: number;
}

// ─── Datos editables de la tienda ────────────────────────────────────────────

export interface TiendaData {
  titulo: string;
  descripcion?: string;
  carrusel?: CarruselItem[];
  aboutUs?: AboutUsData | null;
  marqueeItems?: MarqueeItem[];
  // Agregá más campos a medida que crezca
}

// ─── Props base que recibe cada sección editable ─────────────────────────────

export interface SectionEditProps<T = Record<string, any>> {
  data: T;
  editMode: boolean;
  onChange: (patch: Partial<T>) => void;
  onSave: () => void;
  onCancel: () => void;
}

// ─── Configuración de una sección dentro de una plantilla ────────────────────

export interface SectionConfig {
  /** id único dentro de la plantilla, ej: 'hero', 'marcas' */
  id: string;
  /** Label visible en el editor */
  label: string;
  /** Descripción corta para el editor */
  descripcion?: string;
  /** Qué campo(s) de TiendaData maneja esta sección */
  campos: (keyof TiendaData)[];
}

// ─── Configuración completa de una plantilla ─────────────────────────────────

export interface TemplateConfig {
  /** id que se guarda en la BD, ej: 'plantilla_comun' */
  id: string;
  /** Nombre visible */
  nombre: string;
  /** Descripción corta */
  descripcion?: string;
  /** Lista ordenada de secciones editables */
  secciones: SectionConfig[];
}
