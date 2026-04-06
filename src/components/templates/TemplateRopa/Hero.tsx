import { useCallback, useEffect, useRef, useState } from 'react';

export default function Hero({
  carrusel,
  tienda,
  onNavigate,
}: {
  carrusel: any[];
  tienda: any;
  onNavigate?: (path: string) => void;
}) {
  const [cur, setCur] = useState(0);
  const [fading, setFading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (dir: number) => {
      if (fading || carrusel.length === 0) return;
      setFading(true);
      setTimeout(() => {
        setCur((c) => (c + dir + carrusel.length) % carrusel.length);
        setFading(false);
      }, 550);
      clearInterval(timerRef.current!);
      timerRef.current = setInterval(() => go(1), 6000);
    },
    [fading, carrusel.length]
  );

  useEffect(() => {
    timerRef.current = setInterval(() => go(1), 6000);
    return () => clearInterval(timerRef.current!);
  }, [go]);

  const onDown = (e: any) => {
    setDragging(true);
    setStartX(e.touches?.[0]?.clientX ?? e.clientX);
  };
  const onMove = (e: any) => {
    if (!dragging) return;
    setOffsetX((e.touches?.[0]?.clientX ?? e.clientX) - startX);
  };
  const onUp = () => {
    if (Math.abs(offsetX) > 55) go(offsetX < 0 ? 1 : -1);
    setDragging(false);
    setOffsetX(0);
  };

  const slide = carrusel[cur] ?? {};

  if (carrusel.length === 0) {
    return (
      <div
        className="h-[94vh] min-h-[520px] grid place-items-center"
        style={{ background: 'var(--rop-dark)', color: '#fff' }}
      >
        <p className="text-base opacity-90" style={{ fontFamily: "'Outfit',sans-serif" }}>
          No hay elementos en el carrusel.
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative h-[94vh] min-h-[520px] overflow-hidden select-none"
      style={{
        background: 'var(--rop-dark)',
        cursor: dragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onTouchStart={onDown}
      onTouchMove={onMove}
      onTouchEnd={onUp}
    >
      {/* Slides */}
      {carrusel.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[550ms] ease-out"
          style={{
            opacity: i === cur ? (fading ? 0 : 1) : 0,
            pointerEvents: i === cur ? 'auto' : 'none',
          }}
        >
          <img
            src={s.url}
            alt=""
            className="w-full h-full object-cover"
            style={{
              filter: 'brightness(.45)',
              transform: `translateX(${i === cur ? offsetX * 0.04 : 0}px) scale(1.02)`,
              transition: dragging ? 'none' : 'transform .5s ease',
            }}
          />
        </div>
      ))}

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(20,20,20,.8) 0%, transparent 45%), linear-gradient(to right, rgba(20,20,20,.4) 0%, transparent 55%)',
        }}
      />

      {/* Slide counter (top right) */}
      <div className="absolute top-8 right-10 flex items-center gap-2 pointer-events-none">
        <span
          className="text-[1.1rem] tracking-[.1em]"
          style={{ fontFamily: "'Bebas Neue',sans-serif", color: 'rgba(255,255,255,.7)' }}
        >
          {String(cur + 1).padStart(2, '0')}
        </span>
        <div className="w-10 h-px" style={{ background: 'rgba(255,255,255,.25)' }} />
        <span
          className="text-[1.1rem] tracking-[.1em]"
          style={{ fontFamily: "'Bebas Neue',sans-serif", color: 'rgba(255,255,255,.3)' }}
        >
          {String(carrusel.length).padStart(2, '0')}
        </span>
      </div>

      {/* Label (top left) */}
      <div
        className="absolute top-8 left-10 transition-opacity duration-[400ms]"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <div className="inline-flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--rop-acento)' }} />
          <span
            className="text-[.65rem] tracking-[.2em] uppercase font-medium"
            style={{ fontFamily: "'Outfit',sans-serif", color: 'rgba(255,255,255,.6)' }}
          >
            {slide?.subtitulo || tienda.tagline || 'Colección'}
          </span>
        </div>
      </div>

      {/* Content bottom-left */}
      <div className="absolute bottom-14 left-10 right-10 pointer-events-none">
        <h1
          className="text-[clamp(4rem,9vw,8rem)] font-normal leading-[0.92] tracking-[.03em] whitespace-pre-line mb-5 transition-all duration-500"
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            color: '#f7f5f2',
            opacity: fading ? 0 : 1,
            transform: fading ? 'translateY(16px)' : 'translateY(0)',
          }}
        >
          {slide?.titulo || 'Nueva Colección'}
        </h1>
        <div className="flex items-center gap-6 flex-wrap pointer-events-auto">
          <p
            className="text-[.85rem] font-light transition-opacity duration-500"
            style={{
              fontFamily: "'Outfit',sans-serif",
              color: 'rgba(247,245,242,.5)',
              opacity: fading ? 0 : 1,
              transitionDelay: '.1s',
            }}
          >
            {slide?.subtitulo || 'Descubre nuestras mejores prendas'}
          </p>
          <button
            onClick={() => onNavigate?.('productos')}
            className="py-3 px-7 border-none rounded cursor-pointer text-[.72rem] font-semibold tracking-[.1em] uppercase shrink-0 transition-opacity duration-500"
            style={{
              background: 'var(--rop-acento)',
              color: 'var(--rop-btn-txt)',
              fontFamily: "'Outfit',sans-serif",
              opacity: fading ? 0 : 1,
              transitionDelay: '.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            {slide?.cta || 'Explorar'}
          </button>
        </div>
      </div>

      {/* Arrows */}
      {([-1, 1] as const).map((dir) => (
        <button
          key={dir}
          onClick={() => go(dir)}
          className="absolute top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-base text-white cursor-pointer transition-colors duration-200 pointer-events-auto backdrop-blur-lg"
          style={{
            [dir === -1 ? 'left' : 'right']: '1.5rem',
            background: 'rgba(255,255,255,.1)',
            border: '0.5px solid rgba(255,255,255,.2)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--rop-acento)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.1)')}
        >
          {dir === -1 ? '←' : '→'}
        </button>
      ))}

      {/* Progress dots */}
      <div className="absolute bottom-6 right-10 flex gap-1.5">
        {carrusel.map((_, i) => (
          <div
            key={i}
            onClick={() => {
              if (!fading) {
                setFading(true);
                setTimeout(() => { setCur(i); setFading(false); }, 550);
              }
            }}
            className="h-1.5 rounded-[3px] cursor-pointer transition-all duration-[350ms]"
            style={{
              width: i === cur ? '24px' : '6px',
              background: i === cur ? 'var(--rop-acento)' : 'rgba(255,255,255,.25)',
            }}
          />
        ))}
      </div>

      {/* Drag hint */}
      <div
        className="absolute bottom-[1.6rem] left-1/2 -translate-x-1/2 text-[.55rem] tracking-[.22em] uppercase pointer-events-none"
        style={{ fontFamily: "'Outfit',sans-serif", color: 'rgba(255,255,255,.2)' }}
      >
        ← arrastrá →
      </div>
    </div>
  );
}
