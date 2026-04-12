import { useEffect, useMemo, useState } from 'react';
import { MetodoChip } from '../../shared/MetodoIcons';
import ReviewSection from './ReviewSection';
import type { Producto, ThemeProps, Tienda } from './Types';

export default function ProductDetailView({
  product,
  onBack,
  onCart,
  tienda,
  onLogin,
  theme,
}: {
  product: Producto;
  onBack: () => void;
  onCart: (p: Producto, qty: number, variantId?: number) => void;
  tienda?: Tienda;
  onLogin?: () => void;
  theme?: ThemeProps;
}) {
  const [qty, setQty] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [imagenActiva, setImagenActiva] = useState(product.imagenPrincipalUrl || '');
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);

  // 1. Extraer grupos de atributos de las variantes
  const variantes = product.variantes || [];
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

  // 2. Inicializar selección si hay grupos
  useEffect(() => {
    window.scrollTo(0, 0);
    if (Object.keys(attrGroups).length > 0) {
      const initial: Record<string, string> = {};
      const firstAv = product.variantes?.find((v: any) => v.disponible);
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

  if (!product) return null;

  const handleAttrClick = (group: string, val: string) => {
    setSelectedAttrs((prev) => ({ ...prev, [group]: val }));
  };

  const handleAdd = () => {
    if (variantes.length > 0 && !selectedVariantId) return;
    onCart(product, qty, selectedVariantId || undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  let extra = 0;
  if (selectedVariantId) {
    const v = variantes.find((x: any) => x.id === selectedVariantId);
    if (v) extra = Number(v.precioExtra || 0);
  }

  const todasLasImagenes = [
    ...(product.imagenPrincipalUrl ? [{ url: product.imagenPrincipalUrl }] : []),
    ...(product.imagenes || []),
  ];

  const currentImage =
    imagenActiva || product.imagenPrincipalUrl || 'https://via.placeholder.com/600';
  const basePrice = Number(product.precio || 0) + extra;
  const offerPrice =
    product.precioOferta && Number(product.precioOferta) > 0
      ? Number(product.precioOferta) + extra
      : null;

  const productCategory = (product.categoria as any)?.nombre || product.category || 'GENERAL_STUFF';
  const metodosEntrega = tienda?.metodosEntrega ?? [];
  const metodosPago = tienda?.metodosPago ?? [];
  const isDarkMode = theme?.modoOscuro ?? false;

  return (
    <div className="bg-black min-h-screen text-white pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <button
          onClick={onBack}
          className="mb-10 px-6 py-2 border-2 border-zinc-900 text-zinc-500 hover:border-white hover:text-white font-black uppercase text-[10px] tracking-widest transition cursor-pointer bg-transparent"
        >
          ← BACK_TO_COLLECTION
        </button>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden bg-zinc-950 border border-zinc-900">
              <img
                src={currentImage}
                alt={product.nombre}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              {offerPrice && (
                <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-4 py-2 uppercase tracking-[0.2em] font-syncopate">
                  OFERTA_LIMITADA
                </span>
              )}
            </div>
            {todasLasImagenes.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {todasLasImagenes.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setImagenActiva(img.url)}
                    className={`w-20 h-20 shrink-0 border-2 transition-all p-0.5 ${
                      (imagenActiva || product.imagenPrincipalUrl) === img.url
                        ? 'border-red-600'
                        : 'border-zinc-900 opacity-50'
                    }`}
                  >
                    <img src={img.url} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-10">
            <div>
              <p className="text-zinc-600 text-[10px] uppercase tracking-[0.4em] font-black mb-2 font-syncopate">
                {productCategory}
              </p>
              <h1 className="text-white text-6xl leading-[0.9] uppercase font-bebas">
                {product.nombre}
              </h1>
              <div className="flex items-baseline gap-4 mt-4">
                {offerPrice ? (
                  <>
                    <p className="text-red-600 text-5xl font-bebas">${offerPrice}.00</p>
                    <p className="text-zinc-700 text-2xl font-bebas line-through">
                      ${basePrice}.00
                    </p>
                  </>
                ) : (
                  <p className="text-white text-5xl font-bebas">${basePrice}.00</p>
                )}
              </div>
            </div>

            <p className="text-zinc-500 text-xs leading-relaxed uppercase tracking-wide font-barlow max-w-md">
              {product.descripcion || 'NO_DESCRIPTION_PROVIDED_IN_ARCHIVE'}
            </p>

            <div className="space-y-8">
              {Object.entries(attrGroups).map(([groupName, values]) => (
                <div key={groupName}>
                  <p className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-black mb-4 font-syncopate">
                    {groupName}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {values.map((val) => {
                      const isSelected = selectedAttrs[groupName] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleAttrClick(groupName, val)}
                          className={`px-6 py-2.5 text-[10px] font-black uppercase transition-all cursor-pointer border-2 ${
                            isSelected
                              ? 'border-red-600 bg-red-600 text-white shadow-[0_0_15px_rgba(255,0,0,0.3)]'
                              : 'border-zinc-900 bg-black text-zinc-600 hover:border-zinc-700'
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {!selectedVariantId && variantes.length > 0 && (
                <p className="text-red-500 text-[9px] font-black uppercase tracking-widest mt-2 animate-pulse">
                  ERROR: SELECCIONÁ TODAS LAS VARIANTES
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <div className="flex border-2 border-zinc-900 bg-black h-16 w-32">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="flex-1 bg-transparent border-none text-white text-xl cursor-pointer hover:bg-zinc-900 transition-colors"
                >
                  −
                </button>
                <span className="flex-1 flex items-center justify-center font-black text-sm">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="flex-1 bg-transparent border-none text-white text-xl cursor-pointer hover:bg-zinc-900 transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={(variantes.length > 0 && !selectedVariantId) || added}
                className={`flex-1 font-black uppercase tracking-[0.3em] transition-all duration-500 text-xs border-none cursor-pointer h-16 ${
                  added
                    ? 'bg-white text-black'
                    : variantes.length === 0 || selectedVariantId
                      ? 'bg-red-600 hover:skew-x-2 text-white scale-100 hover:scale-105'
                      : 'bg-zinc-900 text-zinc-700 cursor-not-allowed opacity-50'
                }`}
              >
                {added ? '✓ UNIT_LOCKED' : 'ADD_TO_CARGO'}
              </button>
            </div>

            <div className="flex flex-col gap-12 pt-10 border-t border-zinc-900">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] font-syncopate">
                  LOGISTICS_NETWORK
                </h4>
                {metodosEntrega.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {metodosEntrega.map((me) => (
                      <div
                        key={me.metodoEntrega.id}
                        className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-900 hover:border-red-600 transition-colors group"
                      >
                        <MetodoChip
                          nombre={me.metodoEntrega.nombre}
                          backgroundColor="transparent"
                          borderColor="transparent"
                          textColor="#a1a1aa"
                          preferSVG={true}
                          isDarkMode={true}
                          iconSize={26}
                          style={{
                            padding: 0,
                            border: 'none',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[9px] text-zinc-800 font-black">DATA_NOT_FOUND</p>
                )}
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] font-syncopate">
                  TRANSACTION_LAYERS
                </h4>
                {metodosPago.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {metodosPago.map((mp) => (
                      <div
                        key={mp.metodoPago.id}
                        className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-900 hover:border-red-600 transition-colors"
                      >
                        <MetodoChip
                          nombre={mp.metodoPago.nombre}
                          backgroundColor="transparent"
                          borderColor="transparent"
                          textColor="#a1a1aa"
                          preferSVG={true}
                          isDarkMode={true}
                          iconSize={26}
                          style={{
                            padding: 0,
                            border: 'none',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[9px] text-zinc-800 font-black">ACCESS_DENIED_METHODS</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <ReviewSection productoId={product.id} onLogin={onLogin ?? (() => {})} theme={theme} />
      </div>
    </div>
  );
}
