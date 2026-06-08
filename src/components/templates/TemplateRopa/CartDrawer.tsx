export default function CartDrawer({
  items,
  onClose,
  onQty,
  onRemove,
  onConfirm,
  isVaciando,
}: {
  items: any[];
  onClose: () => void;
  onQty: (id: number, q: number) => void;
  onRemove: (id: number) => void;
  onConfirm: () => void;
  isVaciando?: boolean;
}) {
  const subtotal = items.reduce((a, i) => a + Number(i.precioUnit) * i.cantidad, 0);
  const ship = subtotal >= 10000 ? 0 : 900;
  const total = subtotal + ship;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 backdrop-blur-sm"
        style={{ background: 'rgba(0,0,0,.45)' }}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-[min(400px,100vw)] z-50 flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,.1)]"
        style={{
          background: 'var(--rop-surface)',
          borderLeft: '1px solid var(--rop-border)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid var(--rop-border)' }}
        >
          <span
            className="text-[1.4rem] tracking-[.08em]"
            style={{ fontFamily: "'Bebas Neue',sans-serif", color: 'var(--rop-dark)' }}
          >
            CARRITO{' '}
            {items.length > 0 && (
              <span
                className="text-[.72rem] font-normal tracking-normal"
                style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-acento)' }}
              >
                {items.length} ítems
              </span>
            )}
          </span>
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer text-[1.1rem]"
            style={{ color: 'var(--rop-muted)' }}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div
          className="flex-1 overflow-y-auto px-6 py-4"
          style={{ opacity: isVaciando ? 0.5 : 1 }}
        >
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <p className="text-[.85rem]" style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-muted)' }}>
                Tu carrito está vacío
              </p>
              <button
                onClick={onClose}
                className="bg-transparent border-none cursor-pointer underline underline-offset-[3px] text-[.78rem]"
                style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-acento)' }}
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 py-3.5"
                style={{ borderBottom: '1px solid var(--rop-border)' }}
              >
                {/* Thumb */}
                <div
                  className="w-[72px] h-[90px] rounded-md overflow-hidden shrink-0"
                  style={{ background: 'var(--rop-bg)' }}
                >
                  <img
                    src={item.producto?.imagenPrincipalUrl || 'https://via.placeholder.com/150'}
                    alt={item.producto?.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <p
                    className="text-[.8rem] font-medium"
                    style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-dark)' }}
                  >
                    {item.producto?.nombre}
                  </p>
                  <p
                    className="text-[.65rem] mt-0.5"
                    style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-muted)' }}
                  >
                    {item.producto?.categoria?.nombre || 'General'}
                    {item.varianteId ? ' - Variante' : ''}
                  </p>

                  {/* Qty + Price */}
                  <div className="flex items-center justify-between mt-2.5">
                    <div
                      className="flex rounded overflow-hidden"
                      style={{ border: '1px solid var(--rop-border)' }}
                    >
                      {[
                        { l: '−', a: () => item.cantidad > 1 ? onQty(item.id, item.cantidad - 1) : onRemove(item.id) },
                        { l: String(item.cantidad), a: null },
                        { l: '+', a: () => onQty(item.id, item.cantidad + 1) },
                      ].map(({ l, a }, i) => (
                        <div
                          key={i}
                          onClick={a ?? undefined}
                          className="w-[30px] h-[30px] flex items-center justify-center text-[.85rem]"
                          style={{
                            cursor: a ? 'pointer' : 'default',
                            color: i === 1 ? 'var(--rop-dark)' : 'var(--rop-muted)',
                            fontFamily: "'Outfit',sans-serif",
                            fontWeight: i === 1 ? 600 : 400,
                            borderLeft: i > 0 ? '1px solid var(--rop-border)' : 'none',
                            background: i === 1 ? 'var(--rop-bg)' : 'transparent',
                          }}
                        >
                          {l}
                        </div>
                      ))}
                    </div>
                    <span
                      className="text-[1.15rem] tracking-[.04em]"
                      style={{ fontFamily: "'Bebas Neue',sans-serif", color: 'var(--rop-acento)' }}
                    >
                      ${(Number(item.precioUnit) * item.cantidad).toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => onRemove(item.id)}
                    className="mt-1.5 bg-transparent border-none cursor-pointer p-0 text-[.62rem] transition-colors duration-200"
                    style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-subtle)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--rop-subtle)')}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <div
            className="px-6 py-5"
            style={{ borderTop: '1px solid var(--rop-border)', background: 'var(--rop-bg)' }}
          >
            {[
              { l: 'Subtotal', v: `$${subtotal.toLocaleString()}` },
              { l: 'Envío', v: ship === 0 ? 'Gratis' : `$${ship.toLocaleString()}`, green: ship === 0 },
            ].map(({ l, v, green }: any) => (
              <div key={l} className="flex justify-between mb-1.5">
                <span className="text-[.75rem]" style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-muted)' }}>
                  {l}
                </span>
                <span
                  className="text-[.75rem]"
                  style={{ fontFamily: "'Outfit',sans-serif", color: green ? '#16a34a' : 'var(--rop-subtle)' }}
                >
                  {v}
                </span>
              </div>
            ))}

            {ship > 0 && (
              <p className="text-[.62rem] mb-2" style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-subtle)' }}>
                Envío gratis en pedidos desde $10.000
              </p>
            )}

            <div
              className="flex justify-between pt-2.5 mb-4"
              style={{ borderTop: '1px solid var(--rop-border)' }}
            >
              <span
                className="text-[.88rem] font-semibold"
                style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-dark)' }}
              >
                Total
              </span>
              <span
                className="text-2xl tracking-[.04em]"
                style={{ fontFamily: "'Bebas Neue',sans-serif", color: 'var(--rop-dark)' }}
              >
                ${total.toLocaleString()}
              </span>
            </div>

            <button
              onClick={onConfirm}
              className="w-full py-3.5 border-none rounded cursor-pointer text-[.75rem] font-bold tracking-[.12em] uppercase mb-2 transition-colors duration-200"
              style={{
                background: 'var(--rop-dark)',
                color: 'var(--rop-btn-txt)',
                fontFamily: "'Outfit',sans-serif",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--rop-acento)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--rop-dark)')}
            >
              Confirmar pedido
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-transparent rounded cursor-pointer text-[.72rem]"
              style={{
                border: '1px solid var(--rop-border)',
                color: 'var(--rop-muted)',
                fontFamily: "'Outfit',sans-serif",
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
