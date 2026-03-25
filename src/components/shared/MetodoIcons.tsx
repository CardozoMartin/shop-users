import andreaniImg from '../../assets/metodos/andreani.jpg';
import correoImg from '../../assets/metodos/correo-argentino.png';
import creditoImg from '../../assets/metodos/credito.png';
import debitoImg from '../../assets/metodos/debito.png';
import efectivoImg from '../../assets/metodos/efectivo.png';
import mercadopagoImg from '../../assets/metodos/mercadopago.png';
import puntoImg from '../../assets/metodos/punto-encuentro.png';
import qrImg from '../../assets/metodos/qr.webp';
import retiroImg from '../../assets/metodos/retiro.webp';
import transferenciaImg from '../../assets/metodos/transferencia.jpg';
import uberImg from '../../assets/metodos/uber.png';

export const METODOS_IMAGENES: Record<string, string> = {
  mercadopago: mercadopagoImg,
  efectivo: efectivoImg,
  transferencia: transferenciaImg,
  debito: debitoImg,
  credito: creditoImg,
  qr: qrImg,
  retiro: retiroImg,
  andreani: andreaniImg,
  correo: correoImg,
  uber: uberImg,
  punto: puntoImg,
};

export const IMAGEN_DEFAULT = efectivoImg;

/**
 * Normaliza un string: minúsculas, sin acentos, sin espacios.
 */
export function normalizarMetodo(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');
}

/**
 * Devuelve la ruta de imagen correspondiente al nombre del método.
 */
export function getImagenForMetodo(nombre: string): string {
  const normalizado = normalizarMetodo(nombre);
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
}

export function MetodoChip({
  nombre,
  style,
  iconSize = 22,
  textColor = 'inherit',
  borderColor = 'rgba(0,0,0,0.08)',
  backgroundColor = 'transparent',
}: MetodoChipProps) {
  const imagenSrc = getImagenForMetodo(nombre);

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
          whiteSpace: 'nowrap',
        }}
      >
        {nombre}
      </span>
    </div>
  );
}
