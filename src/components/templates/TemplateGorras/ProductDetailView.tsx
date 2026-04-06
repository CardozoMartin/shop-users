import { useEffect, useMemo, useState } from 'react';
import { MetodoChip } from '../../shared/MetodoIcons';
import ReviewSection from './ReviewSection';
import type { Producto, ThemeProps, Tienda } from './Types';

interface ProductDetailViewProps {
  product: Producto;
  onBack: () => void;
  onCart: (p: Producto, qty: number, vId?: number) => void;
  tienda?: Tienda;
  theme?: ThemeProps;
  onLogin?: () => void;
}

const ProductDetailView = ({
  product,
  onBack,
  onCart,
  tienda,
  theme,
  onLogin,
}: ProductDetailViewProps) => {
  const [qty, setQty] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [imagenActiva, setImagenActiva] = useState(product.imagenPrincipalUrl || '');
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({});

  // 1. Extraer grupos de atributos de las variantes
  const variantes = (product as any).variantes || [];
  const attrGroups = useMemo(() => {
    const groups: Record<string, Set<string>> = {};
    variantes.forEach((v: any) => {
      const parts = v.nombre.split(' - ');
      parts.forEach((p: string) => {
        if (p.includes(':')) {
          const [key, val] = p.split(':').map((s) => s.trim());
          if (!groups[key]) groups[key] = new Set();
          groups[key].add(val);
        } else {
          if (!groups['Opciones']) groups['Opciones'] = new Set();
          groups['Opciones'].add(p.trim());
        }
      });
    });
    const result: Record<string, string[]> = {};
    Object.keys(groups).forEach((k) => {
      result[k] = Array.from(groups[k]);
    });
    return result;
  }, [variantes]);

  useEffect(() => {
    setImagenActiva(product.imagenPrincipalUrl || '');
  }, [product.imagenPrincipalUrl]);

  // 2. Inicializar selección si hay grupos (Solo cuando cambia el ID del producto)
  useEffect(() => {
    window.scrollTo(0, 0);
    if (Object.keys(attrGroups).length > 0) {
      const initial: Record<string, string> = {};
      const firstAv = (product as any).variantes?.find((v: any) => v.disponible);
      if (firstAv) {
        const parts = firstAv.nombre.split(' - ');
        parts.forEach((p: string) => {
          if (p.includes(':')) {
            const [key, val] = p.split(':').map((s) => s.trim());
            initial[key] = val;
          } else {
            initial['Opciones'] = p.trim();
          }
        });
      } else {
        Object.keys(attrGroups).forEach((k) => {
          initial[k] = attrGroups[k][0];
        });
      }
      setSelectedAttrs(initial);
    } else {
      setSelectedVariantId(null);
    }
  }, [product.id, attrGroups]);

  // 3. Encontrar variante que coincida con la selección actual
  useEffect(() => {
    if (Object.keys(attrGroups).length === 0) return;

    const matched = variantes.find((v: any) => {
      const vParts = v.nombre.split(' - ');
      const vAttrs: Record<string, string> = {};
      vParts.forEach((p: string) => {
        if (p.includes(':')) {
          const [key, val] = p.split(':').map((s) => s.trim());
          vAttrs[key] = val;
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

  const handleAttrClick = (group: string, val: string) => {
    setSelectedAttrs((prev) => ({ ...prev, [group]: val }));
  };

  if (!product) return null;

  const {
    surface = 'var(--gor-surface)',
    surface2 = 'var(--gor-surface2)',
    txt = 'var(--gor-txt)',
    muted = 'var(--gor-muted)',
    subtle = 'var(--gor-subtle)',
    border = 'var(--gor-border)',
    acento = 'var(--gor-acento)',
    btnTxt = 'var(--gor-btn-txt)',
  } = theme || {};

  let extra = 0;
  if (selectedVariantId) {
    const v = variantes.find((x: any) => x.id === selectedVariantId);
    if (v) {
      extra = Number(v.precioExtra || 0);
    }
  }

  const todasLasImagenes = [
    ...(product.imagenPrincipalUrl ? [{ url: product.imagenPrincipalUrl }] : []),
    ...(product.imagenes || []),
  ];

  const currentImage =
    imagenActiva || product.imagenPrincipalUrl || 'https://via.placeholder.com/600';

  const hasOffer =
    product.precioOferta &&
    Number(product.precioOferta) > 0 &&
    Number(product.precioOferta) < Number(product.precio);

  const basePrice = Number(product.precio) + extra;
  const offerPrice = hasOffer ? Number(product.precioOferta) + extra : basePrice;

  const metodosEntrega = tienda?.metodosEntrega ?? [];
  const metodosPago = tienda?.metodosPago ?? [];

  return (
    <div className="px-6 py-12 min-h-[80vh] flex flex-col" style={{ background: 'var(--gor-bg)' }}>
      <div className="max-w-[1060px] mx-auto w-full flex-1">
        {/* Volver */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-transparent border-none cursor-pointer text-[.85rem] font-medium mb-8 p-0 transition-colors duration-200"
          style={{ color: muted, fontFamily: "'DM Sans',sans-serif" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = String(txt))}
          onMouseLeave={(e) => (e.currentTarget.style.color = String(muted))}
        >
          <span className="text-xl">←</span> Volver al catálogo
        </button>

        <div className="flex gap-12 flex-wrap items-start">
          {/* Columna Izquierda: Imágenes */}
          <div className="flex-[1_1_400px] flex flex-col gap-4">
            {/* Imagen principal activa */}
            <div
              className="relative aspect-square rounded-3xl overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
              style={{ background: surface2 }}
            >
              <img
                src={currentImage}
                alt={product.nombre}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>

            {/* Galería de imágenes (miniaturas) — solo si hay varias */}
            {todasLasImagenes.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                {todasLasImagenes.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImagenActiva(img.url)}
                    className="shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200"
                    style={{
                      borderColor:
                        (imagenActiva || product.imagenPrincipalUrl) === img.url
                          ? String(acento)
                          : String(border),
                      opacity: (imagenActiva || product.imagenPrincipalUrl) === img.url ? 1 : 0.65,
                    }}
                  >
                    <img
                      src={img.url}
                      alt={`Foto ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detalles */}
          <div className="flex-[1_1_400px] flex flex-col">
            <span
              className="text-[.75rem] font-semibold uppercase tracking-[.1em] mb-3"
              style={{ color: muted, fontFamily: "'DM Sans',sans-serif" }}
            >
              {product.categoria?.nombre || 'Producto'}
            </span>

            <h1
              className="font-bold leading-[1.15] mb-5"
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                color: txt,
              }}
            >
              {product.nombre}
            </h1>

            <div className="flex items-center gap-3 mb-8">
              {hasOffer ? (
                <>
                  <span
                    className="text-[1.2rem] line-through"
                    style={{ color: muted, fontFamily: "'DM Sans',sans-serif" }}
                  >
                    ${basePrice.toLocaleString()}
                  </span>
                  <span
                    className="text-[2.4rem] font-bold"
                    style={{ color: acento, fontFamily: "'Playfair Display',serif" }}
                  >
                    ${offerPrice.toLocaleString()}
                  </span>
                  <span
                    className="text-[.8rem] font-bold px-3.5 py-1.5 rounded-full ml-1"
                    style={{ background: `${acento}14`, color: acento }}
                  >
                    Oferta Especial
                  </span>
                </>
              ) : (
                <span
                  className="text-[2.4rem] font-bold"
                  style={{ color: acento, fontFamily: "'Playfair Display',serif" }}
                >
                  ${basePrice.toLocaleString()}
                </span>
              )}
            </div>

            <p
              className="text-base leading-[1.7] mb-8"
              style={{ color: subtle, fontFamily: "'DM Sans',sans-serif" }}
            >
              {product.descripcion ||
                'Diseño exclusivo pensado para vos. Calidad superior y detalles que marcan la diferencia en cada uso.'}
            </p>

            {/* Variantes (Agrupadas por Atributo) */}
            {Object.keys(attrGroups).length > 0 && (
              <div className="mb-10 space-y-6">
                {Object.entries(attrGroups).map(([groupName, values]) => (
                  <div key={groupName}>
                    <h4
                      className="text-[.85rem] font-bold mb-3 uppercase tracking-wider"
                      style={{ color: muted, fontFamily: "'DM Sans',sans-serif" }}
                    >
                      {groupName}
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {values.map((val) => {
                        const isSelected = selectedAttrs[groupName] === val;
                        return (
                          <button
                            key={val}
                            onClick={() => handleAttrClick(groupName, val)}
                            className="px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer"
                            style={{
                              border: `2px solid ${isSelected ? acento : border}`,
                              background: isSelected ? acento : surface,
                              color: isSelected ? 'var(--gor-btn-txt)' : txt,
                              fontWeight: isSelected ? 600 : 400,
                              fontFamily: "'DM Sans',sans-serif",
                            }}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Nota de disponibilidad/precio de la variante detectada */}
                {selectedVariantId ? (
                  <div className="flex items-center gap-2 pt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <p className="text-[.8rem] font-medium" style={{ color: txt }}>
                      Variante disponible
                      {Number(
                        (product as any).variantes?.find((v: any) => v.id === selectedVariantId)
                          ?.precioExtra
                      ) > 0 &&
                        ` (+$${Number((product as any).variantes?.find((v: any) => v.id === selectedVariantId)?.precioExtra)})`}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 pt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <p className="text-[.8rem] font-medium text-red-500">
                      Esta combinación no está disponible.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 mb-12 flex-wrap">
              <div
                className="flex rounded-full overflow-hidden w-[140px]"
                style={{ border: `1.5px solid ${border}`, background: surface }}
              >
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="flex-1 bg-transparent border-none cursor-pointer text-[1.2rem] pt-0.5"
                  style={{ color: txt }}
                >
                  −
                </button>
                <span
                  className="flex-1 flex items-center justify-center text-base font-semibold"
                  style={{ color: txt, fontFamily: "'DM Sans',sans-serif" }}
                >
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="flex-1 bg-transparent border-none cursor-pointer text-[1.2rem] pt-0.5"
                  style={{ color: txt }}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => onCart(product, qty, selectedVariantId || undefined)}
                disabled={(product as any).variantes?.length > 0 && !selectedVariantId}
                className="flex-1 rounded-full text-[.95rem] font-semibold border-none cursor-pointer px-8 min-h-[52px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: acento,
                  color: btnTxt,
                  fontFamily: "'DM Sans',sans-serif",
                  boxShadow: `0 8px 20px ${acento}30`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '.9';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Agregar al Carrito
              </button>
            </div>

            <div
              className="mt-auto pt-8 flex flex-col gap-6"
              style={{ borderTop: `1.5px solid ${border}` }}
            >
              <div>
                <h4
                  className="text-[.9rem] font-bold mb-3"
                  style={{ color: txt, fontFamily: "'DM Sans',sans-serif" }}
                >
                  Métodos de Envío
                </h4>
                {metodosEntrega.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {metodosEntrega.map((me) => (
                      <div
                        key={me.metodoEntrega.id}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                        style={{ background: surface2 }}
                      >
                        <MetodoChip
                          nombre={me.metodoEntrega.nombre}
                          borderColor={border}
                          backgroundColor={surface2}
                          textColor={txt}
                          style={{ border: 'none' }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    className="text-sm"
                    style={{ color: muted, fontFamily: "'DM Sans',sans-serif" }}
                  >
                    El dueño de la tienda no ingresó los métodos de entrega.
                  </p>
                )}
              </div>

              <div>
                <h4
                  className="text-[.9rem] font-bold mb-3"
                  style={{ color: txt, fontFamily: "'DM Sans',sans-serif" }}
                >
                  Medios de Pago
                </h4>
                {metodosPago.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {metodosPago.map((mp) => (
                      <div
                        key={mp.metodoPago.id}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                        style={{ background: surface2 }}
                      >
                        <MetodoChip
                          nombre={mp.metodoPago.nombre}
                          borderColor={border}
                          backgroundColor={surface2}
                          textColor={txt}
                          style={{ border: 'none' }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    className="text-sm"
                    style={{ color: muted, fontFamily: "'DM Sans',sans-serif" }}
                  >
                    El dueño de la tienda no ingresó los métodos de pago.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reseñas del producto */}
        <ReviewSection productoId={product.id} onLogin={onLogin ?? (() => {})} theme={theme} />
      </div>
    </div>
  );
};

export default ProductDetailView;
