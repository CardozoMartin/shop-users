// ProductosDestacados.tsx
import { useStorefrontDestacados } from '../../../hooks/useStorefrontProducts';
import ProductCard from './ProductCard';
import type { Producto } from './Types';

const BG = 'var(--gor-bg)';
const BORDER = 'var(--gor-border)';
const TXT = 'var(--gor-txt)';
const ACENTO = 'var(--gor-acento)';

interface Props {
  onSelect: (p: Producto) => void;
  tiendaId?: number;
}

export default function ProductosDestacados({ onSelect, tiendaId }: Props) {
  const { data: productosData, isLoading } = useStorefrontDestacados(tiendaId ?? 0);
  const productos = productosData?.datos || [];

  if (isLoading || productos.length === 0) return null;

  return (
    <section
      className="px-6 py-[4.5rem]"
      style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}
    >
      <div className="max-w-[1060px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2
            className="font-bold"
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 'clamp(1.8rem,3.5vw,2.8rem)',
              color: TXT,
            }}
          >
            Productos{' '}
            <em className="italic font-normal" style={{ color: ACENTO }}>
              Destacados
            </em>
          </h2>
        </div>

        {/* Grid */}
        <div
          className="grid gap-x-7 gap-y-10"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))' }}
        >
          {productos.map((p: Producto) => (
            <ProductCard key={p.id} producto={p} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </section>
  );
}
