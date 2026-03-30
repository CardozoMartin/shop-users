import { useEffect, useState } from 'react';
import { MetodoChip } from '../../shared/MetodoIcons';
import type { Producto, ThemeProps, Tienda } from './Types';

interface ProductDetailViewProps {
  product: Producto;
  onBack: () => void;
  onCart: (p: Producto, qty: number) => void;
  tienda?: Tienda;
  theme?: ThemeProps;
}

const ProductDetailView = ({ product, onBack, onCart, tienda, theme }: ProductDetailViewProps) => {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const hasOffer =
    product.precioOferta &&
    Number(product.precioOferta) > 0 &&
    Number(product.precioOferta) < Number(product.precio);

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
          {/* Imagen */}
          <div
            className="flex-[1_1_400px] relative aspect-square rounded-3xl overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
            style={{ background: surface2 }}
          >
            <img
              src={product.imagenPrincipalUrl || 'https://via.placeholder.com/600'}
              alt={product.nombre}
              className="w-full h-full object-cover"
            />
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
                    ${Number(product.precio).toLocaleString()}
                  </span>
                  <span
                    className="text-[2.4rem] font-bold"
                    style={{ color: acento, fontFamily: "'Playfair Display',serif" }}
                  >
                    ${Number(product.precioOferta).toLocaleString()}
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
                  ${Number(product.precio).toLocaleString()}
                </span>
              )}
            </div>

            <p
              className="text-base leading-[1.7] mb-10"
              style={{ color: subtle, fontFamily: "'DM Sans',sans-serif" }}
            >
              {product.descripcion ||
                'Diseño exclusivo pensado para vos. Calidad superior y detalles que marcan la diferencia en cada uso.'}
            </p>

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
                onClick={() => onCart(product, qty)}
                className="flex-1 rounded-full text-[.95rem] font-semibold border-none cursor-pointer px-8 min-h-[52px] transition-all duration-200"
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
      </div>
    </div>
  );
};

export default ProductDetailView;
