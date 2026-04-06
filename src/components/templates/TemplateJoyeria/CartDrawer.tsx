export default function CartDrawer({
  items,
  onClose,
  onQty,
  onRemove,
  onConfirm,
  isVaciando
}: {
  items: any[];
  onClose: () => void;
  onQty: (id: number, q: number) => void;
  onRemove: (id: number) => void;
  onConfirm: () => void;
  isVaciando?: boolean;
}) {
  const subtotal = items.reduce((a, i) => a + Number(i.precioUnit) * i.cantidad, 0);
  const ship = subtotal >= 5000 ? 0 : 750;
  const total = subtotal + ship;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(42,31,20,.35)',
          backdropFilter: 'blur(4px)',
          zIndex: 40,
        }}
      />
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          height: '100%',
          width: 'min(390px,100vw)',
          background: 'var(--acc-surface)',
          borderLeft: `0.5px solid var(--acc-border)`,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-16px 0 48px rgba(42,31,20,.08)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: `0.5px solid var(--acc-border)`,
          }}
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: '1.25rem',
              fontWeight: 300,
              color: 'var(--acc-txt)',
            }}
          >
            Carrito{' '}
            {items.length > 0 && (
              <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '.72rem', color: 'var(--acc-acento)' }}>
                {items.length} {items.length === 1 ? 'ítem' : 'ítems'}
              </span>
            )}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--acc-muted)',
              fontSize: '1.1rem',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem', opacity: isVaciando ? 0.5 : 1 }}>
          {items.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: '1rem',
              }}
            >
              <p style={{ fontFamily: "'Jost',sans-serif", fontSize: '.82rem', color: 'var(--acc-muted)' }}>
                Tu carrito está vacío
              </p>
              <button
                onClick={onClose}
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: '.75rem',
                  color: 'var(--acc-acento)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                }}
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '14px 0',
                  borderBottom: `0.5px solid var(--acc-border)`,
                }}
              >
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    background: 'var(--acc-surface2)',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={item.producto?.imagenPrincipalUrl || 'https://via.placeholder.com/150'}
                    alt={item.producto?.nombre}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontFamily: "'Jost',sans-serif",
                      fontSize: '.78rem',
                      fontWeight: 300,
                      color: 'var(--acc-txt)',
                    }}
                  >
                    {item.producto?.nombre}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Jost',sans-serif",
                      fontSize: '.65rem',
                      color: 'var(--acc-muted)',
                      marginTop: '2px',
                    }}
                  >
                    {item.producto?.categoria?.nombre || 'General'}
                    {item.varianteId ? ` - Variante` : ''}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '10px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        border: `0.5px solid var(--acc-border)`,
                        borderRadius: '6px',
                        overflow: 'hidden',
                      }}
                    >
                      {[
                        {
                          l: '−',
                          a: () =>
                            item.cantidad > 1
                              ? onQty(item.id, item.cantidad - 1)
                              : onRemove(item.id),
                        },
                        { l: String(item.cantidad), a: null },
                        { l: '+', a: () => onQty(item.id, item.cantidad + 1) },
                      ].map(({ l, a }, i) => (
                        <div
                          key={i}
                          onClick={a ?? undefined}
                          style={{
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: a ? 'pointer' : 'default',
                            color: i === 1 ? 'var(--acc-txt)' : 'var(--acc-muted)',
                            fontSize: '.82rem',
                            borderLeft: i > 0 ? `0.5px solid var(--acc-border)` : 'none',
                            background: i === 1 ? 'var(--acc-bg)' : 'transparent',
                          }}
                        >
                          {l}
                        </div>
                      ))}
                    </div>
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: '1.1rem',
                        fontWeight: 300,
                        color: 'var(--acc-acento)',
                      }}
                    >
                      ${(Number(item.precioUnit) * item.cantidad).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    style={{
                      marginTop: '6px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: "'Jost',sans-serif",
                      fontSize: '.62rem',
                      color: 'var(--acc-subtle)',
                      padding: 0,
                      transition: 'color .2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--acc-subtle)')}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: `0.5px solid var(--acc-border)`,
              background: 'var(--acc-bg)',
            }}
          >
            {[
              { l: 'Subtotal', v: `$${subtotal.toLocaleString()}` },
              {
                l: 'Envío',
                v: ship === 0 ? 'Gratis' : `$${ship.toLocaleString()}`,
                green: ship === 0,
              },
            ].map(({ l, v, green }: any) => (
              <div
                key={l}
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}
              >
                <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '.75rem', color: 'var(--acc-muted)' }}>
                  {l}
                </span>
                <span
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: '.75rem',
                    color: green ? '#16a34a' : 'var(--acc-subtle)',
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
            {ship > 0 && (
              <p
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: '.62rem',
                  color: 'var(--acc-subtle)',
                  marginBottom: '8px',
                }}
              >
                Envío gratis en pedidos desde $5.000
              </p>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '10px',
                borderTop: `0.5px solid var(--acc-border)`,
                marginBottom: '1.1rem',
              }}
            >
              <span
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: '.85rem',
                  fontWeight: 400,
                  color: 'var(--acc-txt)',
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: '1.35rem',
                  fontWeight: 300,
                  color: 'var(--acc-acento)',
                }}
              >
                ${total.toLocaleString()}
              </span>
            </div>
            <button
              onClick={onConfirm}
              style={{
                width: '100%',
                padding: '13px',
                background: 'var(--acc-acento)',
                color: 'var(--acc-btn-txt)',
                border: 'none',
                borderRadius: '8px',
                fontFamily: "'Jost',sans-serif",
                fontSize: '.7rem',
                fontWeight: 600,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                marginBottom: '8px',
                transition: 'opacity .2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Confirmar pedido
            </button>
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '10px',
                background: 'transparent',
                border: `0.5px solid var(--acc-border)`,
                borderRadius: '8px',
                color: 'var(--acc-muted)',
                fontFamily: "'Jost',sans-serif",
                fontSize: '.7rem',
                cursor: 'pointer',
              }}
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
