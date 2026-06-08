const metodoAssets = import.meta.glob('../../assets/metodos/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const svgAssets = import.meta.glob('../../assets/SVG/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

function crearMetodosImagenes(assets: Record<string, string>): Record<string, string> {
  return Object.entries(assets).reduce(
    (acc, [path, src]) => {
      const fileName = path.split('/').pop() ?? '';
      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');

      // Ignorar versiones -1 para el nombre base
      if (nameWithoutExt.endsWith('-1')) {
        return acc;
      }

      // Normalizar la key (remover espacios, guiones, y pasar a minúsculas)
      const normalizedKey = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      if (!normalizedKey) {
        return acc;
      }

      acc[normalizedKey] = src;
      return acc;
    },
    {} as Record<string, string>
  );
}

export const METODOS_IMAGENES: Record<string, string> = crearMetodosImagenes(metodoAssets);
export const SVG_METODOS_IMAGENES: Record<string, string> = crearMetodosImagenes(svgAssets);
export const IMAGEN_DEFAULT = Object.values(METODOS_IMAGENES)[0] ?? '';

/**
 * Normaliza un string: minúsculas, sin acentos, sin espacios ni guiones.
 */
export function normalizarMetodo(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Devuelve la ruta de imagen correspondiente al nombre del método.
 * Prioriza la carpeta SVG si se solicita.
 */
export function getImagenForMetodo(nombre: string, preferSVG = false, isDarkMode = false): string {
  const normalizado = normalizarMetodo(nombre);

  if (preferSVG) {
    const getVariant = (baseKey: string) => {
      if (isDarkMode) {
        // Intentar encontrar la versión darkmode (case insensitive)
        const darkKey = baseKey + 'darkmode';
        if (SVG_METODOS_IMAGENES[darkKey]) return SVG_METODOS_IMAGENES[darkKey];
      }
      return SVG_METODOS_IMAGENES[baseKey];
    };

    // 1. Pagos
    if (normalizado.includes('efectivo')) return getVariant('efectivo');
    if (normalizado.includes('transferencia')) return getVariant('transferencia');
    if (
      normalizado.includes('pagoqr') ||
      normalizado.includes('qr') ||
      normalizado.includes('mercadopago')
    )
      return getVariant('pagosqr');
    if (
      normalizado.includes('tarjeta') ||
      normalizado.includes('credito') ||
      normalizado.includes('debito')
    )
      return getVariant('tarjetadecredito');

    // 2. Entregas (Orden de prioridad: marcas/específicos primero)
    if (normalizado.includes('uber') || normalizado.includes('ubber')) return getVariant('uber');
    if (
      normalizado.includes('cadeteria') ||
      normalizado.includes('propia') ||
      normalizado.includes('moto')
    )
      return getVariant('cadeteriapropia');
    if (normalizado.includes('punto') && normalizado.includes('encuentro'))
      return getVariant('puntoencuentro');
    if (normalizado.includes('retiro') || normalizado.includes('local'))
      return getVariant('retirolocal');

    // Catch-all para envíos que no matchearon marcas específicas
    if (
      normalizado.includes('envio') ||
      normalizado.includes('domicilio') ||
      normalizado.includes('andrenai') ||
      normalizado.includes('correo')
    )
      return getVariant('enviotodopais');

    // Si nada de lo anterior funcionó, intentar match directo por key
    const baseMatch = Object.keys(SVG_METODOS_IMAGENES).find(
      (key) => !key.includes('darkmode') && normalizado.includes(key)
    );
    if (baseMatch) return getVariant(baseMatch);
  }

  const keyMatch = Object.keys(METODOS_IMAGENES).find((key) => normalizado.includes(key));
  return keyMatch ? METODOS_IMAGENES[keyMatch] : IMAGEN_DEFAULT;
}

interface MetodoChipProps {
  nombre: string;
  className?: string;
  style?: React.CSSProperties;
  iconSize?: number;
  textColor?: string;
  borderColor?: string;
  backgroundColor?: string;
  preferSVG?: boolean;
  isDarkMode?: boolean;
}

export function MetodoChip({
  nombre,
  style,
  iconSize = 22,
  textColor = 'inherit',
  borderColor = 'rgba(0,0,0,0.08)',
  backgroundColor = 'transparent',
  preferSVG = false,
  isDarkMode = false,
}: MetodoChipProps) {
  const imagenSrc = getImagenForMetodo(nombre, preferSVG, isDarkMode);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        padding: '6px 12px',
        borderRadius: '8px',
        border: `0.5px solid ${borderColor}`,
        background: backgroundColor,
        ...style,
      }}
    >
      <img
        src={imagenSrc}
        alt={nombre}
        width={iconSize}
        height={iconSize}
        style={{ objectFit: 'contain', flexShrink: 0 }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = IMAGEN_DEFAULT;
        }}
      />
      <span
        style={{
          fontSize: '13px',
          fontWeight: 500,
          color: textColor,
          lineHeight: '1.2',
        }}
      >
        {nombre}
      </span>
    </div>
  );
}
