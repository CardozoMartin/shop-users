import { useRef, useState } from 'react';

export default function CarruselProductos({
  onCart,
  onSelect,
  items,
}: {
  onCart: (p: any, qty?: number, varianteId?: number) => void;
  onSelect: (p: any) => void;
  items: any[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hov, setHov] = useState<number | null>(null);

  const onDown = (e: React.MouseEvent) => {
    setIsDrag(true);
    setStartX(e.pageX - (trackRef.current?.offsetLeft ?? 0));
    setScrollLeft(trackRef.current?.scrollLeft ?? 0);
  };
  const onMov = (e: React.MouseEvent) => {
    if (!isDrag) return;
    e.preventDefault();
    const x = e.pageX - (trackRef.current?.offsetLeft ?? 0);
    const walk = (x - startX) * 1.5;
    if (trackRef.current) trackRef.current.scrollLeft = scrollLeft - walk;
  };
  const onUp = () => setIsDrag(false);

  const scroll = (dir: number) => {
    if (trackRef.current) trackRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="py-8" style={{ background: 'var(--rop-surface)' }}>
      <div className="max-w-[1060px] mx-auto px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <span
              className="block text-[.62rem] tracking-[.24em] uppercase font-semibold mb-2"
              style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-acento)' }}
            >
              Catálogo Destacado
            </span>
            <h2
              className="text-[clamp(2.5rem,4vw,3.5rem)] tracking-[.04em] leading-[0.9]"
              style={{ fontFamily: "'Bebas Neue',sans-serif", color: 'var(--rop-dark)' }}
            >
              LO MEJOR
            </h2>
          </div>
          <div className="flex gap-2">
            {([-1, 1] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-[.9rem] cursor-pointer transition-all duration-200"
                style={{
                  border: '1px solid var(--rop-border)',
                  color: 'var(--rop-dark)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--rop-acento)';
                  e.currentTarget.style.borderColor = 'var(--rop-acento)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--rop-border)';
                  e.currentTarget.style.color = 'var(--rop-dark)';
                }}
              >
                {dir === -1 ? '←' : '→'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Track */}
      <div className="flex justify-center w-full max-w-[1060px] mx-auto">
        <div
          ref={trackRef}
          onMouseDown={onDown}
          onMouseMove={onMov}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          className="vt-scroll flex gap-4 overflow-x-auto max-w-full px-8 pt-4 pb-8 select-none"
          style={{
            cursor: isDrag ? 'grabbing' : 'grab',
            scrollbarWidth: 'none',
          }}
        >
          {items.map((p, i) => (
            <div
              key={p.id}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              onClick={() => { if (!isDrag) onSelect(p); }}
              className="shrink-0 w-[260px] flex flex-col cursor-pointer"
            >
              {/* Image */}
              <div
                className="relative rounded-lg overflow-hidden aspect-[3/4]"
                style={{ background: 'var(--rop-bg)' }}
              >
                <img
                  src={p.imagenPrincipalUrl || 'https://via.placeholder.com/600x800'}
                  alt={p.nombre}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out"
                  style={{ transform: hov === i ? 'scale(1.05)' : 'scale(1)' }}
                />

                {/* Overlay */}
                <div
                  className="absolute inset-0 flex flex-col justify-end p-3.5 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(to top, rgba(20,20,20,.7) 0%, transparent 55%)',
                    opacity: hov === i ? 1 : 0,
                  }}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); onCart(p, 1); }}
                    className="w-full py-2.5 border-none rounded cursor-pointer text-[.65rem] font-bold tracking-[.1em] uppercase"
                    style={{
                      background: 'var(--rop-acento)',
                      color: 'var(--rop-btn-txt)',
                      fontFamily: "'Outfit',sans-serif",
                    }}
                  >
                    Agregar al carrito
                  </button>
                </div>

                {/* Badge */}
                {p.destacado && (
                  <span
                    className="absolute top-2.5 left-2.5 text-[.56rem] font-bold py-[3px] px-2 rounded-[3px] tracking-[.1em] uppercase"
                    style={{ background: 'var(--rop-acento)', color: 'var(--rop-btn-txt)' }}
                  >
                    Destacado
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="mt-2.5 px-0.5">
                <p
                  className="text-[.82rem] font-medium truncate mb-[3px]"
                  style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-dark)' }}
                >
                  {p.nombre}
                </p>
                <p
                  className="text-[.65rem] mb-1"
                  style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-muted)' }}
                >
                  {p.categoria?.nombre || 'General'}
                </p>
                <div className="flex items-baseline gap-1.5">
                  {p.precioOferta && Number(p.precioOferta) > 0 && (
                    <span className="text-[.68rem] line-through" style={{ color: 'var(--rop-subtle)' }}>
                      ${Number(p.precio).toLocaleString()}
                    </span>
                  )}
                  <span
                    className="text-[1.2rem] tracking-[.04em]"
                    style={{
                      fontFamily: "'Bebas Neue',sans-serif",
                      color: p.precioOferta && Number(p.precioOferta) > 0 ? 'var(--rop-acento)' : 'var(--rop-dark)',
                    }}
                  >
                    ${Number(p.precioOferta || p.precio).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
