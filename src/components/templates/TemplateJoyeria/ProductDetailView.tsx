import { useEffect, useState } from 'react';

export default function ProductDetailView({
  product,
  onBack,
  onCart,
  tienda,
}: {
  product: any;
  onBack: () => void;
  onCart: (p: any, qty: number, varianteId?: number) => void;
  tienda?: any;
}) {
  const [qty, setQty] = useState(1);
  const tiendaNombre = tienda?.nombre || tienda?.titulo || 'Tienda';
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  if (!product) return null;

  const hasOffer =
    product.precioOferta &&
    Number(product.precioOferta) > 0 &&
    Number(product.precioOferta) < Number(product.precio);

  const activeVariant = selectedVariant ? product.variantes?.find((v: any) => v.id === selectedVariant) : null;
  const currentPrice = activeVariant ? Number(activeVariant.precio) : Number(product.precio);
  // Asumimos que la oferta de la variante no existe o no tiene estructura en el backend actual, usamos precioOferta base
  const currentOfferPrice = hasOffer ? Number(product.precioOferta) : null;

  return (
    <div
      style={{
        padding: '3rem 1.5rem',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ maxWidth: '1060px', margin: '0 auto', width: '100%', flex: 1 }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--acc-muted)',
            fontFamily: "'Jost',sans-serif",
            fontSize: '.75rem',
            fontWeight: 400,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '2rem',
            padding: 0,
            textTransform: 'uppercase',
            letterSpacing: '.12em',
          }}
        >
          <span style={{ fontSize: '1rem' }}>←</span> Volver a la colección
        </button>

        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div
            style={{
              flex: '1 1 420px',
              position: 'relative',
              aspectRatio: '1',
              borderRadius: '2px',
              overflow: 'hidden',
              background: 'var(--acc-surface2)',
              border: `1px solid var(--acc-border)`,
            }}
          >
            <img
              src={product.imagenPrincipalUrl || 'https://via.placeholder.com/600'}
              alt={product.nombre}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ flex: '1 1 380px', display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: '.65rem',
                color: 'var(--acc-acento)',
                marginBottom: '.75rem',
                textTransform: 'uppercase',
                letterSpacing: '.2em',
                fontWeight: 500,
              }}
            >
              {product.categoria?.nombre || 'Esencial'}
            </span>

            <p
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: '.82rem',
                color: 'var(--acc-muted)',
                marginBottom: '.5rem',
              }}
            >
              {tiendaNombre}
            </p>

            <h1
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                fontWeight: 300,
                color: 'var(--acc-txt)',
                marginBottom: '1.2rem',
                lineHeight: 1.1,
              }}
            >
              {product.nombre}
            </h1>

            <div
              style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2.5rem' }}
            >
              {currentOfferPrice ? (
                <>
                  <span
                    style={{
                      fontFamily: "'Jost',sans-serif",
                      fontSize: '1.1rem',
                      color: 'var(--acc-subtle)',
                      textDecoration: 'line-through',
                      fontWeight: 300,
                    }}
                  >
                    ${currentPrice.toLocaleString()}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: '2.4rem',
                      fontWeight: 400,
                      color: 'var(--acc-txt)',
                    }}
                  >
                    ${currentOfferPrice.toLocaleString()}
                  </span>
                </>
              ) : (
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: '2.4rem',
                    fontWeight: 400,
                    color: 'var(--acc-txt)',
                  }}
                >
                   ${currentPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: '.9rem',
                color: 'var(--acc-muted)',
                lineHeight: 1.8,
                marginBottom: '2.5rem',
                fontWeight: 300,
                whiteSpace: 'pre-wrap',
              }}
            >
              {product.descripcion ||
                'Una pieza única de diseño artesanal, pensada para resaltar la elegancia natural con materiales de primera calidad.'}
            </p>
            
            {product.variantes && product.variantes.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontFamily: "'Jost',sans-serif", fontSize: '.8rem', color: 'var(--acc-txt)', marginBottom: '.5rem', fontWeight: 500 }}>
                  Variante:
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {product.variantes.map((v: any) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.id)}
                      style={{
                        padding: '8px 16px',
                        border: `1px solid ${selectedVariant === v.id ? 'var(--acc-acento)' : 'var(--acc-border)'}`,
                        background: selectedVariant === v.id ? 'var(--acc-acento)' : 'transparent',
                        color: selectedVariant === v.id ? 'var(--acc-btn-txt)' : 'var(--acc-txt)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontFamily: "'Jost',sans-serif",
                        fontSize: '.75rem',
                        transition: 'all .2s'
                      }}
                    >
                      {v.nombre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div
              style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '2.5rem' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: `1px solid var(--acc-border)`,
                  borderRadius: '0px',
                }}
              >
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{
                    padding: '10px 15px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--acc-txt)',
                    cursor: 'pointer',
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    padding: '0 10px',
                    fontFamily: "'Jost',sans-serif",
                    minWidth: '30px',
                    textAlign: 'center',
                    color: 'var(--acc-txt)',
                  }}
                >
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  style={{
                    padding: '10px 15px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--acc-txt)',
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => onCart(product, qty, selectedVariant || undefined)}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'var(--acc-txt)',
                  color: 'var(--acc-bg)',
                  border: 'none',
                  borderRadius: '0px',
                  fontFamily: "'Jost',sans-serif",
                  fontSize: '.75rem',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '.15em',
                  cursor: 'pointer',
                  transition: 'all .3s',
                }}
              >
                Agregar a la bolsa
              </button>
            </div>

            <div style={{ borderTop: `1px solid var(--acc-border)`, paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#4CAF50',
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: '.7rem',
                    color: 'var(--acc-muted)',
                    letterSpacing: '.05em',
                  }}
                >
                  DISPONIBLE PARA ENVÍO INMEDIATO
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
