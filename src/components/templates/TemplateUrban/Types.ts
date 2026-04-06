export type NavbarTarget = 'inicio' | 'producto' | 'contacto' | 'sobrenosotros';

export interface NavbarProps {
  cartCount: number;
  onCart: () => void;
  logo?: string;
  titulo?: string;
  onIngresar: () => void;
  onMiCuenta: () => void;
  onNavigate: (target: NavbarTarget) => void;
}

export interface CategoriaProducto {
  id: number;
  nombre: string;
  padreId?: number | null;
}

export interface MetodoEntregaItem {
  metodoEntrega: {
    id: number;
    nombre: string;
  };
}

export interface MetodoPagoItem {
  metodoPago: {
    id: number;
    nombre: string;
  };
}

export interface Producto {
  id: number;
  nombre: string;
  name?: string; // Fallback for previous Urban naming
  descripcion?: string;
  description?: string;
  imagenPrincipalUrl?: string;
  imagenUrl?: string; // Additional fallback
  imagen?: string;
  img?: string; // Fallback for previous Urban naming
  imagenes?: Array<{ url: string }>;
  precio?: number | string;
  price?: number | string;
  precioOferta?: number | string;
  destacado?: boolean;
  categoria?: any; // Category object or string
  category?: string;
  tag?: string;
  sizes?: string[];
  talles?: string[];
  colors?: string[];
  colores?: string[];
  variantes?: any[];
}

export interface CarritoItem {
  id: number;
  cantidad: number;
  qty?: number;
  precioUnit: number | string;
  producto: Producto;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Carrito {
  items: CarritoItem[];
  total?: number | string;
  cantidad?: number | string;
}

export interface Tienda {
  id?: number;
  nombre?: string;
  titulo?: string;
  tituloDos?: { primera: string; segunda: string };
  descripcion?: string;
  whatsapp?: string;
  instagram?: string;
  ciudad?: string;
  provincia?: string;
  pais?: string;
  logoUrl?: string;
  metodosEntrega?: MetodoEntregaItem[];
  metodosPago?: MetodoPagoItem[];
  carrusel?: HeroSlide[];
  aboutUs?: {
    titulo?: string | null;
    descripcion?: string | null;
    imagenUrl?: string | null;
    direccion?: string | null;
  } | null;
  marqueeItems?: Array<{ texto: string; orden: number }>;
}

export interface HeroSlide {
  url?: string;
  img?: string;
  label?: string;
  subtitulo?: string;
  titulo?: string;
  descripcion?: string;
}

export interface IHeroProps {
  titulo?: string;
  descripcion?: string;
  imagenCarrusel?: HeroSlide[];
  tituloDos?: { primera: string; segunda: string };
  acento?: string;
  txtColor?: string;
  btnTextColor?: string;
  bgColor?: string;
  mutedColor?: string;
  whatsapp?: string;
  onNavigate?: (target: NavbarTarget) => void;
}

export interface ThemeProps {
  bg?: string;
  surface?: string;
  surface2?: string;
  txt?: string;
  muted?: string;
  subtle?: string;
  border?: string;
  acento?: string;
  btnTxt?: string;
}

export interface ToastProps {
  msg: string;
  visible: boolean;
  imagen?: string;
  nombre?: string;
  precio?: number | string;
  acento?: string;
  bg?: string;
  txt?: string;
}

export interface IFooterProps {
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  descripcion?: string;
  ciudad?: string;
  pais?: string;
  acento?: string;
  nombreTienda?: string;
  onNavigate?: (target: NavbarTarget) => void;
}

export interface AboutUsProps {
  titulo?: string | null;
  descripcion?: string | null;
  imagenUrl?: string | null;
  direccion?: string | null;
  ciudad?: string;
  provincia?: string;
  instagram?: string;
  acento?: string;
  bg?: string;
  border?: string;
  txt?: string;
  muted?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegistroData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
}
