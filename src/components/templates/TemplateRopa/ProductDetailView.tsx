import { useEffect, useMemo, useState } from 'react';
import { MetodoChip } from '../../shared/MetodoIcons';

export default function ProductDetailView({
  product,
  onBack,
  onCart,
  tienda,
}: {
  product: any;
  onBack: () => void;
  onCart: (p: any, qty: number, vId?: number) => void;
  tienda?: any;
}) {
  const [qty, setQty] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({});
  const [imagenActiva, setImagenActiva] = useState(product.imagenPrincipalUrl || '');

  // Extraer grupos de atributos
  const attrGroups = useMemo(() => {
    const groups: Record<string, Set<string>> = {};
    product.variantes?.forEach((v: any) => {
      const parts = v.nombre.split(' - ');
      parts.forEach((p: string) => {
        if (p.includes(':')) {
          const [key, val] = p.split(':').map((s: string) => s.trim());
          if (!groups[key]) groups[key] = new Set();
          groups[key].add(val);
        } else {
          if (!groups['Opciones']) groups['Opciones'] = new Set();
          groups['Opciones'].add(p.trim());
        }
      });
    });
    const result: Record<string, string[]> = {};
    Object.keys(groups).forEach((k) => { result[k] = Array.from(groups[k]); });
    return result;
  }, [product.variantes]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setImagenActiva(product.imagenPrincipalUrl || '');

    if (Object.keys(attrGroups).length > 0) {
      const initial: Record<string, string> = {};
      const firstAv = product.variantes?.find((v: any) => v.disponible);
      if (firstAv) {
        firstAv.nombre.split(' - ').forEach((p: string) => {
          if (p.includes(':')) {
            const [k, v] = p.split(':').map((s: string) => s.trim());
            initial[k] = v;
          } else {
            initial['Opciones'] = p.trim();
          }
        });
      } else {
        Object.keys(attrGroups).forEach((k) => { initial[k] = attrGroups[k][0]; });
      }
      setSelectedAttrs(initial);
    }
  }, [product.id, attrGroups, product.imagenPrincipalUrl, product.variantes]);

  useEffect(() => {
    if (Object.keys(attrGroups).length === 0) return;
    const matched = product.variantes?.find((v: any) => {
      const vAttrs: Record<string, string> = {};
      v.nombre.split(' - ').forEach((p: string) => {
        if (p.includes(':')) {
          const [k, val] = p.split(':').map((s: string) => s.trim());
          vAttrs[k] = val;
        } else {
          vAttrs['Opciones'] = p.trim();
        }
      });
      return Object.keys(selectedAttrs).every((k) => vAttrs[k] === selectedAttrs[k]);
    });

    if (matched) {
      setSelectedVariantId(matched.id);
      if (matched.imagenUrl) setImagenActiva(matched.imagenUrl);
    } else {
      setSelectedVariantId(null);
    }
  }, [selectedAttrs, product, attrGroups]);

  if (!product) return null;
  const hasOffer = product.precioOferta && Number(product.precioOferta) > 0 && Number(product.precioOferta) < Number(product.precio);

  let extra = 0;
  if (selectedVariantId) {
    const v = product.variantes?.find((x: any) => x.id === selectedVariantId);
    if (v) extra = Number(v.precioExtra || 0);
  }
  const basePrice = Number(product.precio) + extra;
  const offerPrice = hasOffer ? Number(product.precioOferta) + extra : basePrice;
  const isDisabled = Object.keys(attrGroups).length > 0 && !selectedVariantId;

  return (
    <div className="p-6 md:px-12 md:py-12 min-h-[80vh] flex flex-col">
      <div className="max-w-[1060px] mx-auto w-full flex-1">
        {/* Back button */}
        <button
          onClick={onBack}
          className="bg-transparent border-none cursor-pointer flex items-center gap-2 mb-8 p-0 text-[.85rem] font-medium"
          style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-muted)' }}
        >
          <span className="text-xl">←</span> Volver al catálogo
        </button>

        <div className="flex gap-12 flex-wrap items-start">
          {/* Gallery */}
          <div className="flex-[1_1_400px] flex flex-col gap-4">
            <div
              className="relative aspect-[3/4] rounded-lg overflow-hidden"
              style={{ background: 'var(--rop-surface)' }}
            >
              <img
                src={imagenActiva || product.imagenPrincipalUrl || 'https://via.placeholder.com/600x800'}
                alt={product.nombre}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {(product.imagenes || []).length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                <img
                  src={product.imagenPrincipalUrl}
                  onClick={() => setImagenActiva(product.imagenPrincipalUrl)}
                  className="w-[60px] h-[80px] object-cover rounded cursor-pointer"
                  style={{ border: imagenActiva === product.imagenPrincipalUrl ? '2px solid var(--rop-acento)' : 'none' }}
                />
                {product.imagenes.map((img: any) => (
                  <img
                    key={img.id}
                    src={img.url}
                    onClick={() => setImagenActiva(img.url)}
                    className="w-[60px] h-[80px] object-cover rounded cursor-pointer"
                    style={{ border: imagenActiva === img.url ? '2px solid var(--rop-acento)' : 'none' }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-[1_1_400px] flex flex-col">
            <span
              className="text-[.75rem] uppercase tracking-[.1em] font-semibold mb-3"
              style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-muted)' }}
            >
              {product.categoria?.nombre || 'Producto'}
            </span>

            <h1
              className="text-[clamp(2.5rem,4vw,3.5rem)] tracking-[.04em] leading-[0.9] mb-5"
              style={{ fontFamily: "'Bebas Neue',sans-serif", color: 'var(--rop-dark)' }}
            >
              {product.nombre}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-8">
              {hasOffer ? (
                <>
                  <span className="text-xl line-through" style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-muted)' }}>
                    ${basePrice.toLocaleString()}
                  </span>
                  <span className="text-[2.4rem] tracking-[.04em]" style={{ fontFamily: "'Bebas Neue',sans-serif", color: 'var(--rop-acento)' }}>
                    ${offerPrice.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-[2.4rem] tracking-[.04em]" style={{ fontFamily: "'Bebas Neue',sans-serif", color: 'var(--rop-dark)' }}>
                  ${basePrice.toLocaleString()}
                </span>
              )}
            </div>

            <p
              className="text-base leading-[1.7] mb-10"
              style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-subtle)' }}
            >
              {product.descripcion || 'Diseño exclusivo pensado para la nueva temporada. Calidad superior y detalles únicos en cada prenda.'}
            </p>

            {/* Variant selector */}
            {Object.keys(attrGroups).length > 0 && (
              <div className="mb-10 flex flex-col gap-6">
                {Object.entries(attrGroups).map(([groupName, values]) => (
                  <div key={groupName}>
                    <p
                      className="text-[.75rem] font-semibold uppercase mb-3"
                      style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-muted)' }}
                    >
                      {groupName}
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {values.map((v) => (
                        <button
                          key={v}
                          onClick={() => setSelectedAttrs((prev) => ({ ...prev, [groupName]: v }))}
                          className="py-2.5 px-4 rounded cursor-pointer text-[.85rem] font-semibold transition-all duration-200"
                          style={{
                            background: selectedAttrs[groupName] === v ? 'var(--rop-dark)' : 'transparent',
                            color: selectedAttrs[groupName] === v ? 'var(--rop-bg)' : 'var(--rop-dark)',
                            border: `1.5px solid ${selectedAttrs[groupName] === v ? 'var(--rop-dark)' : 'var(--rop-border)'}`,
                            fontFamily: "'Outfit',sans-serif",
                          }}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {!selectedVariantId && (
                  <p className="text-[.8rem] font-medium" style={{ color: 'var(--rop-acento)' }}>
                    Esta combinación no está disponible temporalmente.
                  </p>
                )}
              </div>
            )}

            {/* Qty + Add to cart */}
            <div className="flex gap-4 mb-12 flex-wrap">
              <div
                className="flex rounded overflow-hidden w-[120px]"
                style={{ border: '1px solid var(--rop-border)' }}
              >
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="flex-1 bg-transparent border-none cursor-pointer text-xl"
                  style={{ color: 'var(--rop-dark)' }}
                >
                  −
                </button>
                <span
                  className="flex-1 flex items-center justify-center text-base font-semibold"
                  style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-dark)' }}
                >
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="flex-1 bg-transparent border-none cursor-pointer text-xl"
                  style={{ color: 'var(--rop-dark)' }}
                >
                  +
                </button>
              </div>

              <button
                disabled={isDisabled}
                onClick={() => onCart(product, qty, selectedVariantId || undefined)}
                className="flex-1 border-none rounded cursor-pointer text-[.85rem] font-semibold tracking-[.1em] uppercase px-8 min-h-[52px] transition-colors duration-200"
                style={{
                  background: 'var(--rop-dark)',
                  color: 'var(--rop-btn-txt)',
                  fontFamily: "'Outfit',sans-serif",
                  opacity: isDisabled ? 0.4 : 1,
                }}
                onMouseEnter={(e) => { if (!isDisabled) e.currentTarget.style.background = 'var(--rop-acento)'; }}
                onMouseLeave={(e) => { if (!isDisabled) e.currentTarget.style.background = 'var(--rop-dark)'; }}
              >
                {selectedVariantId || Object.keys(attrGroups).length === 0 ? 'Agregar al Carrito' : 'No disponible'}
              </button>
            </div>

            {/* Shipping & Payment */}
            <div
              className="mt-auto pt-8 flex flex-col gap-6"
              style={{ borderTop: '1px solid var(--rop-border)' }}
            >
              {tienda?.metodosEntrega?.length > 0 && (
                <div>
                  <h4
                    className="text-[.85rem] font-semibold tracking-[.05em] uppercase mb-3"
                    style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-dark)' }}
                  >
                    Envíos
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tienda.metodosEntrega.map((me: any) => (
                      <MetodoChip
                        key={me.metodoEntrega.id}
                        nombre={me.metodoEntrega.nombre}
                        iconSize={18}
                        borderColor="var(--rop-border)"
                        backgroundColor="transparent"
                        textColor="var(--rop-muted)"
                      />
                    ))}
                  </div>
                </div>
              )}
              {tienda?.metodosPago?.length > 0 && (
                <div>
                  <h4
                    className="text-[.85rem] font-semibold tracking-[.05em] uppercase mb-3"
                    style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-dark)' }}
                  >
                    Medios de Pago
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tienda.metodosPago.map((mp: any) => (
                      <MetodoChip
                        key={mp.metodoPago.id}
                        nombre={mp.metodoPago.nombre}
                        iconSize={18}
                        borderColor="var(--rop-border)"
                        backgroundColor="transparent"
                        textColor="var(--rop-muted)"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
