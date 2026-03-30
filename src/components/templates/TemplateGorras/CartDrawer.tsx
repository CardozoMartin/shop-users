import type { Carrito, CarritoItem, ThemeProps, Tienda } from './Types';

interface CartDrawerProps {
  carrito?: Carrito;
  tienda?: Tienda;
  isVaciando?: boolean;
  onClose: () => void;
  onQty: (itemId: number, q: number) => void;
  onRemove: (itemId: number) => void;
  onConfirmar: () => void;
  theme?: ThemeProps;
}

const CartDrawer = ({
  carrito,
  tienda,
  isVaciando,
  onClose,
  onQty,
  onRemove,
  onConfirmar,
  theme,
}: CartDrawerProps) => {
  const {
    bg = 'var(--gor-bg)',
    surface = 'var(--gor-surface)',
    surface2 = 'var(--gor-surface2)',
    txt = 'var(--gor-txt)',
    muted = 'var(--gor-muted)',
    subtle = 'var(--gor-subtle)',
    border = 'var(--gor-border)',
    acento = 'var(--gor-acento)',
    btnTxt = 'var(--gor-btn-txt)',
  } = theme || {};

  const items = carrito?.items || [];
  const subtotal = Number(carrito?.total || 0);
  const ship = subtotal > 8000 ? 0 : 800;
  const total = subtotal + ship;

  const handleConfirmar = () => {
    if (!items.length) return;
    let msj = `¡Hola! Quiero confirmar mi pedido:\n\n`;
    items.forEach((item: CarritoItem) => {
      msj += `- ${item.cantidad}x ${item.producto?.nombre} ($${(Number(item.precioUnit) * item.cantidad).toLocaleString()})\n`;
    });
    msj += `\nSubtotal: $${subtotal.toLocaleString()}`;
    msj += `\nEnvío: $${ship === 0 ? 'Gratis' : ship.toLocaleString()}`;
    msj += `\n*TOTAL: $${total.toLocaleString()}*\n\n`;
    msj += `Espero confirmación. ¡Muchas gracias!`;
    const numeroStr = tienda?.whatsapp?.toString().replace(/\D/g, '') || '5493812345678';
    window.open(`https://wa.me/${numeroStr}?text=${encodeURIComponent(msj)}`, '_blank');
    onConfirmar();
  };

  const isDisabled = isVaciando || items.length === 0;

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full z-50 flex flex-col shadow-[-16px_0_48px_rgba(0,0,0,.08)]"
        style={{
          width: 'min(400px, 100vw)',
          background: bg,
          borderLeft: `1px solid ${border}`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: `1px solid ${border}` }}
        >
          <span
            className="text-[1.2rem] font-bold"
            style={{ color: txt, fontFamily: "'Playfair Display',serif" }}
          >
            Carrito{' '}
            {items.length > 0 && (
              <span
                className="text-[.72rem] font-normal"
                style={{ color: acento, fontFamily: "'DM Sans',sans-serif" }}
              >
                {items.length} {items.length === 1 ? 'ítem' : 'ítems'}
              </span>
            )}
          </span>
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer text-[1.1rem] transition-opacity hover:opacity-60"
            style={{ color: muted }}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <p
                className="text-[.85rem]"
                style={{ color: muted, fontFamily: "'DM Sans',sans-serif" }}
              >
                Tu carrito está vacío
              </p>
              <button
                onClick={onClose}
                className="bg-transparent border-none cursor-pointer text-[.78rem] underline"
                style={{ color: acento, fontFamily: "'DM Sans',sans-serif" }}
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            items.map((item: CarritoItem) => (
              <div
                key={item.id}
                className="flex gap-3 py-3.5"
                style={{ borderBottom: `1px solid ${border}` }}
              >
                {/* Imagen */}
                <div
                  className="w-[68px] h-[68px] rounded-[10px] overflow-hidden flex-shrink-0"
                  style={{ background: surface2 }}
                >
                  <img
                    src={
                      item.producto?.imagenPrincipalUrl ||
                      item.producto?.imagenes?.[0]?.url ||
                      'https://via.placeholder.com/150'
                    }
                    alt={item.producto?.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <p
                    className="text-[.8rem] font-medium"
                    style={{ color: txt, fontFamily: "'DM Sans',sans-serif" }}
                  >
                    {item.producto?.nombre}
                  </p>
                  <p
                    className="text-[.68rem] mt-0.5"
                    style={{ color: muted, fontFamily: "'DM Sans',sans-serif" }}
                  >
                    {item.producto?.categoria?.nombre || 'General'}
                  </p>

                  <div className="flex items-center justify-between mt-2.5">
                    {/* Cantidad */}
                    <div
                      className="flex rounded-lg overflow-hidden"
                      style={{ border: `1px solid ${border}` }}
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
                          className="w-[30px] h-[30px] flex items-center justify-center text-[.85rem]"
                          style={{
                            cursor: a ? 'pointer' : 'default',
                            color: i === 1 ? txt : muted,
                            fontWeight: i === 1 ? 600 : 400,
                            borderLeft: i > 0 ? `1px solid ${border}` : 'none',
                            background: i === 1 ? surface : 'transparent',
                            fontFamily: "'DM Sans',sans-serif",
                          }}
                        >
                          {l}
                        </div>
                      ))}
                    </div>

                    {/* Precio */}
                    <span
                      className="text-[1.1rem] font-bold"
                      style={{ color: acento, fontFamily: "'Playfair Display',serif" }}
                    >
                      ${(Number(item.precioUnit) * item.cantidad).toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => onRemove(item.id)}
                    className="mt-1.5 bg-transparent border-none cursor-pointer text-[.62rem] p-0 transition-colors duration-200"
                    style={{ color: subtle, fontFamily: "'DM Sans',sans-serif" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = String(subtle))}
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
            style={{ borderTop: `1px solid ${border}`, background: surface }}
          >
            {/* Subtotal y envío */}
            {[
              { l: 'Subtotal', v: `$${subtotal.toLocaleString()}`, green: false },
              {
                l: 'Envío',
                v: ship === 0 ? 'Gratis' : `$${ship.toLocaleString()}`,
                green: ship === 0,
              },
            ].map(({ l, v, green }) => (
              <div key={l} className="flex justify-between mb-1.5">
                <span
                  className="text-[.75rem]"
                  style={{ color: muted, fontFamily: "'DM Sans',sans-serif" }}
                >
                  {l}
                </span>
                <span
                  className="text-[.75rem]"
                  style={{ color: green ? '#16a34a' : subtle, fontFamily: "'DM Sans',sans-serif" }}
                >
                  {v}
                </span>
              </div>
            ))}

            {ship > 0 && (
              <p
                className="text-[.62rem] mb-2"
                style={{ color: subtle, fontFamily: "'DM Sans',sans-serif" }}
              >
                Envío gratis en pedidos desde $8.000
              </p>
            )}

            {/* Total */}
            <div
              className="flex justify-between pt-2.5 mb-4"
              style={{ borderTop: `1px solid ${border}` }}
            >
              <span
                className="text-[.85rem] font-semibold"
                style={{ color: txt, fontFamily: "'DM Sans',sans-serif" }}
              >
                Total
              </span>
              <span
                className="text-[1.3rem] font-bold"
                style={{ color: acento, fontFamily: "'Playfair Display',serif" }}
              >
                ${total.toLocaleString()}
              </span>
            </div>

            {/* Confirmar */}
            <button
              onClick={handleConfirmar}
              disabled={isDisabled}
              className="w-full py-3.5 rounded-full text-[.75rem] font-bold tracking-widest uppercase border-none mb-2 transition-opacity duration-200"
              style={{
                background: acento,
                color: btnTxt,
                opacity: isDisabled ? 0.6 : 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans',sans-serif",
              }}
              onMouseEnter={(e) => {
                if (!isDisabled) e.currentTarget.style.opacity = '.85';
              }}
              onMouseLeave={(e) => {
                if (!isDisabled) e.currentTarget.style.opacity = '1';
              }}
            >
              {isVaciando ? 'Procesando...' : 'Confirmar pedido'}
            </button>

            {/* Seguir comprando */}
            <button
              onClick={onClose}
              className="w-full py-3 rounded-full text-[.72rem] bg-transparent cursor-pointer transition-opacity hover:opacity-70"
              style={{
                border: `1px solid ${border}`,
                color: muted,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
