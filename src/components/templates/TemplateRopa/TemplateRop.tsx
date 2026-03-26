import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useStorefrontCategorias, useStorefrontDestacados, useStorefrontNormales } from '../../../hooks/useStorefrontProducts';
import { MetodoChip } from '../../shared/MetodoIcons';
import { useAuthSessionStore } from '../../../store/useAuthSession';
import AuthView from './AuthView';

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&display=swap');
`;

// ── PALETA ────────────────────────────────────────────────────
const BG = 'var(--rop-bg)';
const DARK = 'var(--rop-dark)';
const SURFACE = 'var(--rop-surface)';
let ACENTO = 'var(--rop-acento)'; // rojo editorial
const MUTED = 'var(--rop-muted)';
const SUBTLE = 'var(--rop-subtle)';
const BORDER = 'var(--rop-border)';
const BTN_TXT = 'var(--rop-btn-txt)';

// ── TIENDA ────────────────────────────────────────────────────
let TIENDA = {
  nombre: 'VESTE',
  tagline: 'Ropa de autor · Tucumán',
  descripcion:
    'Diseño local con identidad propia. Prendas que combinan comodidad, tendencia y carácter tucumano.',
  whatsapp: '5493812345678',
  instagram: 'veste.tuc',
  ciudad: 'Tucumán',
  pais: 'Argentina',
};


// ── NAVBAR ────────────────────────────────────────────────────



// ── LOOKBOOK (editorial) ──────────────────────────────────────
const LOOKBOOK = [
  {
    img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop&q=80',
    span: '1/3',
  },
  {
    img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=400&fit=crop&q=80',
    span: '1/1',
  },
  {
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=400&fit=crop&q=80',
    span: '1/1',
  },
  {
    img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop&q=80',
    span: '1/3',
  },
  {
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80',
    span: '1/1',
  },
  {
    img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=400&fit=crop&q=80',
    span: '1/1',
  },
];

/* ═══════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════ */
function Navbar({ 
  cartCount, 
  onCart,
  onIngresar,
  onMiCuenta 
}: { 
  cartCount: number; 
  onCart: () => void;
  onIngresar: () => void;
  onMiCuenta: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const cliente = useAuthSessionStore((s) => s.cliente);

  useEffect(() => {
    const el = document.querySelector('.vt-scroll');
    const fn = () => setScrolled((el?.scrollTop ?? 0) > 70);
    el?.addEventListener('scroll', fn, { passive: true });
    return () => el?.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: scrolled ? 'var(--rop-bg-alpha)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${BORDER}` : 'none',
        padding: '0 2rem',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all .3s ease',
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: '1.8rem',
            color: DARK,
            letterSpacing: '.08em',
            lineHeight: 0.9,
          }}
        >
          {TIENDA.nombre}
        </span>
        <span
          style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: '.52rem',
            color: MUTED,
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            marginTop: '1px',
          }}
        >
          {TIENDA.tagline}
        </span>
      </div>

      {/* Desktop links */}
      <div className="vt-hide-mob" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {['Colección', 'Lookbook', 'Nosotros', 'Contacto'].map((l) => (
          <a
            key={l}
            href="#"
            style={{
              fontFamily: "'Outfit',sans-serif",
              fontSize: '.78rem',
              fontWeight: 500,
              color: 'var(--rop-nav-link)',
              textDecoration: 'none',
              letterSpacing: '.04em',
              transition: 'color .2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = ACENTO)}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--rop-nav-link)')}
          >
            {l}
          </a>
        ))}
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Search */}
        <button
          className="vt-hide-mob"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: MUTED,
          }}
        >
          <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
            <path
              d="M10.836 10.615 15 14.695"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <path
              clipRule="evenodd"
              d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Cart */}
        <button
          onClick={onCart}
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <svg width="19" height="19" viewBox="0 0 14 14" fill="none">
            <path
              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
              stroke={ACENTO}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {cartCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-3px',
                right: '-5px',
                background: ACENTO,
                color: BTN_TXT,
                fontSize: '.5rem',
                fontWeight: 700,
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {cartCount}
            </span>
          )}
        </button>

        {/* Mi Cuenta / Ingresar */}
        <button
          onClick={cliente ? onMiCuenta : onIngresar}
          className="vt-hide-mob"
          style={{
            padding: '9px 22px',
            background: DARK,
            color: BTN_TXT,
            border: 'none',
            borderRadius: '4px',
            fontFamily: "'Outfit',sans-serif",
            fontSize: '.72rem',
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '.06em',
            transition: 'background .2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = ACENTO)}
          onMouseLeave={(e) => (e.currentTarget.style.background = DARK)}
        >
          {cliente ? 'Mi cuenta' : 'Ingresar'}
        </button>

        {/* Hamburger */}
        <button
          className="vt-show-mob"
          onClick={() => setOpen(!open)}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
            <rect width="22" height="1.5" rx=".75" fill={DARK} />
            <rect x="5" y="6.25" width="17" height="1.5" rx=".75" fill={DARK} />
            <rect x="2" y="12.5" width="20" height="1.5" rx=".75" fill={DARK} />
          </svg>
        </button>
      </div>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '68px',
            left: 0,
            right: 0,
            background: SURFACE,
            borderBottom: `1px solid ${BORDER}`,
            padding: '1.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 50,
            boxShadow: '0 8px 24px rgba(0,0,0,.06)',
          }}
        >
          {['Colección', 'Lookbook', 'Nosotros', 'Contacto'].map((l) => (
            <a
              key={l}
              href="#"
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: '.9rem',
                fontWeight: 500,
                color: MUTED,
                textDecoration: 'none',
              }}
            >
              {l}
            </a>
          ))}
          <button
            onClick={cliente ? onMiCuenta : onIngresar}
            style={{
              alignSelf: 'flex-start',
              padding: '10px 24px',
              background: DARK,
              color: BTN_TXT,
              border: 'none',
              borderRadius: '4px',
              fontFamily: "'Outfit',sans-serif",
              fontSize: '.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '.5rem',
            }}
          >
            {cliente ? 'Mi cuenta' : 'Ingresar'}
          </button>
        </div>
      )}
    </nav>
  );
}

/* ═══════════════════════════════════════════════
   HERO — FULLSCREEN DRAG SLIDER
═══════════════════════════════════════════════ */
function Hero({ carrusel }: { carrusel: any[] }) {
  const [cur, setCur] = useState(0);
  const [fading, setFading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (dir: number) => {
      if (fading) return;
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

  const slide = carrusel[cur];

  return (
    <div
      style={{
        position: 'relative',
        height: '94vh',
        minHeight: '520px',
        overflow: 'hidden',
        background: DARK,
        userSelect: 'none',
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
          style={{
            position: 'absolute',
            inset: 0,
            opacity: i === cur ? (fading ? 0 : 1) : 0,
            transition: 'opacity .55s ease',
            pointerEvents: i === cur ? 'auto' : 'none',
          }}
        >
          <img
            src={s.url}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(.45)',
              transform: `translateX(${i === cur ? offsetX * 0.04 : 0}px) scale(1.02)`,
              transition: dragging ? 'none' : 'transform .5s ease',
            }}
          />
        </div>
      ))}

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(20,20,20,.8) 0%, transparent 45%), linear-gradient(to right, rgba(20,20,20,.4) 0%, transparent 55%)',
          pointerEvents: 'none',
        }}
      />

      {/* Número de slide (top right) */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,.7)',
            letterSpacing: '.1em',
          }}
        >
          {String(cur + 1).padStart(2, '0')}
        </span>
        <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,.25)' }} />
        <span
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,.3)',
            letterSpacing: '.1em',
          }}
        >
          {String(carrusel.length).padStart(2, '0')}
        </span>
      </div>

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2.5rem',
          opacity: fading ? 0 : 1,
          transition: 'opacity .4s ease',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ACENTO }} />
          <span
            style={{
              fontFamily: "'Outfit',sans-serif",
              fontSize: '.65rem',
              letterSpacing: '.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,.6)',
              fontWeight: 500,
            }}
          >
            {slide?.subtitulo || 'Colección'}
          </span>
        </div>
      </div>

      {/* Content bottom-left */}
      <div
        style={{
          position: 'absolute',
          bottom: '3.5rem',
          left: '2.5rem',
          right: '2.5rem',
          pointerEvents: 'none',
        }}
      >
        <h1
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 'clamp(4rem,9vw,8rem)',
            fontWeight: 400,
            color: '#f7f5f2',
            lineHeight: 0.92,
            letterSpacing: '.03em',
            whiteSpace: 'pre-line',
            marginBottom: '1.2rem',
            opacity: fading ? 0 : 1,
            transform: fading ? 'translateY(16px)' : 'translateY(0)',
            transition: 'all .5s ease',
          }}
        >
          {slide.titulo || 'Nueva Colección'}
        </h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
            pointerEvents: 'auto',
          }}
        >
          <p
            style={{
              fontFamily: "'Outfit',sans-serif",
              fontSize: '.85rem',
              fontWeight: 300,
              color: 'rgba(247,245,242,.5)',
              opacity: fading ? 0 : 1,
              transition: 'opacity .5s .1s ease',
            }}
          >
            {slide.subtitulo || 'Descubre nuestras mejores prendas'}
          </p>
          <button
            style={{
              padding: '12px 28px',
              background: ACENTO,
              color: BTN_TXT,
              border: 'none',
              borderRadius: '4px',
              fontFamily: "'Outfit',sans-serif",
              fontSize: '.72rem',
              fontWeight: 600,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              flexShrink: 0,
              opacity: fading ? 0 : 1,
              transition: 'opacity .5s .15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            {slide.cta || 'Explorar'}
          </button>
        </div>
      </div>

      {/* Arrows */}
      {([-1, 1] as const).map((dir) => (
        <button
          key={dir}
          onClick={() => go(dir)}
          style={{
            position: 'absolute',
            top: '50%',
            [dir === -1 ? 'left' : 'right']: '1.5rem',
            transform: 'translateY(-50%)',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,.1)',
            border: '0.5px solid rgba(255,255,255,.2)',
            color: '#fff',
            fontSize: '1rem',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background .2s',
            pointerEvents: 'auto',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = ACENTO)}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.1)')}
        >
          {dir === -1 ? '←' : '→'}
        </button>
      ))}

      {/* Progress bar dots */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          right: '2.5rem',
          display: 'flex',
          gap: '6px',
        }}
      >
        {carrusel.map((_, i) => (
          <div
            key={i}
            onClick={() => {
              if (!fading) {
                setFading(true);
                setTimeout(() => {
                  setCur(i);
                  setFading(false);
                }, 550);
              }
            }}
            style={{
              width: i === cur ? '24px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: i === cur ? ACENTO : 'rgba(255,255,255,.25)',
              transition: 'all .35s ease',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* Drag hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.6rem',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Outfit',sans-serif",
          fontSize: '.55rem',
          letterSpacing: '.22em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,.2)',
          pointerEvents: 'none',
        }}
      >
        ← arrastrá →
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MARQUEE
═══════════════════════════════════════════════ */
function Marquee() {
  const words = [
    'VESTE',
    'Nueva colección',
    'Ropa de autor',
    'Tucumán',
    'SS 2025',
    'Diseño local',
    'Tendencia',
  ];
  const items = [...words, ...words, ...words];
  return (
    <div style={{ background: DARK, overflow: 'hidden', padding: '10px 0' }}>
      <style>{`@keyframes vtmq{from{transform:translateX(0)}to{transform:translateX(-33.33%)}} .vt-mq{display:flex;width:max-content;animation:vtmq 22s linear infinite} .vt-mq:hover{animation-play-state:paused}`}</style>
      <div className="vt-mq">
        {items.map((w, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: '1rem',
              letterSpacing: '.18em',
              color: i % 3 === 1 ? ACENTO : 'var(--rop-slider-text)',
              padding: '0 1.5rem',
              whiteSpace: 'nowrap',
            }}
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LOOKBOOK — galería editorial asimétrica
═══════════════════════════════════════════════ */
function Lookbook() {
  const [hov, setHov] = useState<number | null>(null);

  return (
    <section style={{ background: BG, padding: '5rem 2rem' }}>
      <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: '.62rem',
                letterSpacing: '.24em',
                textTransform: 'uppercase',
                color: ACENTO,
                fontWeight: 600,
                display: 'block',
                marginBottom: '.5rem',
              }}
            >
              SS 2025
            </span>
            <h2
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 'clamp(2.5rem,5vw,4rem)',
                color: DARK,
                letterSpacing: '.04em',
                lineHeight: 0.9,
              }}
            >
              LOOKBOOK
            </h2>
          </div>
          <p
            style={{
              fontFamily: "'Outfit',sans-serif",
              fontSize: '.8rem',
              fontWeight: 300,
              color: MUTED,
              maxWidth: '280px',
              lineHeight: 1.7,
            }}
          >
            {TIENDA.descripcion}
          </p>
        </div>

        {/* Masonry grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'auto',
            gap: '8px',
          }}
        >
          {LOOKBOOK.map((item, i) => (
            <div
              key={i}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                gridRow: item.span,
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                aspectRatio: item.span === '1/3' ? '3/4' : '1',
              }}
            >
              <img
                src={item.img}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: hov === i ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform .55s ease',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(20,20,20,.4)',
                  opacity: hov === i ? 1 : 0,
                  transition: 'opacity .3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: '1.1rem',
                    color: '#fff',
                    letterSpacing: '.18em',
                  }}
                >
                  VER MÁS
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   CARRUSEL HORIZONTAL — productos
═══════════════════════════════════════════════ */
function CarruselProductos({ onCart, items }: { onCart: (p: any) => void; items: any[] }) {
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

  return (
    <section style={{ background: SURFACE, padding: '5rem 0' }}>
      <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: '.62rem',
                letterSpacing: '.24em',
                textTransform: 'uppercase',
                color: ACENTO,
                fontWeight: 600,
                display: 'block',
                marginBottom: '.5rem',
              }}
            >
              Catálogo
            </span>
            <h2
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 'clamp(2.5rem,4vw,3.5rem)',
                color: DARK,
                letterSpacing: '.04em',
                lineHeight: 0.9,
              }}
            >
              NUEVA COLECCIÓN
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[-1, 1].map((dir) => (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'transparent',
                  border: `1px solid ${BORDER}`,
                  color: DARK,
                  fontSize: '.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all .2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = ACENTO;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = ACENTO;
                  (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = BORDER;
                  (e.currentTarget as HTMLButtonElement).style.color = DARK;
                }}
              >
                {dir === -1 ? '←' : '→'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        onMouseDown={onDown}
        onMouseMove={onMov}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingLeft: 'max(2rem, calc((100% - 1060px) / 2 + 2rem))',
          paddingRight: '2rem',
          paddingBottom: '1rem',
          scrollbarWidth: 'none',
          cursor: isDrag ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
      >
        <style>{`.vt-scroll::-webkit-scrollbar{display:none}`}</style>

        {items.map((p, i) => (
          <div
            key={p.id}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            style={{
              flexShrink: 0,
              width: '260px',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
            }}
          >
            {/* Image */}
            <div
              style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                aspectRatio: '3/4',
                background: BG,
              }}
            >
              <img
                src={p.imagenPrincipalUrl || 'https://via.placeholder.com/600x800'}
                alt={p.nombre}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: hov === i ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform .5s ease',
                }}
              />

              {/* Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(20,20,20,.7) 0%, transparent 55%)',
                  opacity: hov === i ? 1 : 0,
                  transition: 'opacity .3s',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '14px',
                }}
              >
                <button
                  onClick={() => onCart(p)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: ACENTO,
                    color: BTN_TXT,
                    border: 'none',
                    borderRadius: '4px',
                    fontFamily: "'Outfit',sans-serif",
                    fontSize: '.65rem',
                    fontWeight: 700,
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Agregar al carrito
                </button>
              </div>

              {/* Badge */}
              {p.destacado && (
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: ACENTO,
                    color: BTN_TXT,
                    fontSize: '.56rem',
                    fontWeight: 700,
                    padding: '3px 9px',
                    borderRadius: '3px',
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  Destacado
                </span>
              )}
            </div>

            {/* Info */}
            <div style={{ marginTop: '10px', padding: '0 2px' }}>
              <p
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: '.82rem',
                  fontWeight: 500,
                  color: DARK,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: '3px',
                }}
              >
                {p.nombre}
              </p>
              <p
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: '.65rem',
                  color: MUTED,
                  marginBottom: '5px',
                }}
              >
                {p.categoria?.nombre || 'General'}
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                {p.precioOferta && Number(p.precioOferta) > 0 && (
                  <span
                    style={{ fontSize: '.68rem', color: SUBTLE, textDecoration: 'line-through' }}
                  >
                    ${Number(p.precio).toLocaleString()}
                  </span>
                )}
                <span
                  style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: '1.2rem',
                    fontWeight: 400,
                    color: (p.precioOferta && Number(p.precioOferta) > 0) ? ACENTO : DARK,
                    letterSpacing: '.04em',
                  }}
                >
                  ${Number(p.precioOferta || p.precio).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   GRID PRODUCTOS — todos los productos con filtro
═══════════════════════════════════════════════ */
function GridProductos({ onSelect, tiendaId }: { onSelect: (p: any) => void; tiendaId: number }) {
  const [cat, setCat] = useState<number | 'Todo'>('Todo');
  const [busqueda, setBusqueda] = useState('');
  const [busquedaFiltro, setBusquedaFiltro] = useState('');
  const [hov, setHov] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const { data: categoriasData } = useStorefrontCategorias(tiendaId);
  const categorias = categoriasData || [];

  const { data: productosData, isLoading } = useStorefrontNormales(tiendaId, {
    categoriaId: cat !== 'Todo' ? cat : undefined,
    busqueda: busquedaFiltro.trim() !== '' ? busquedaFiltro : undefined,
  });

  const productos = productosData?.datos || [];
  const visibleProducts = productos.slice(0, visibleCount);

  return (
    <section id="productos" style={{ background: BG, padding: '5rem 2rem' }}>
      <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.5rem,4vw,3.5rem)', color: DARK, letterSpacing: '.04em', lineHeight: 0.9 }}>
            TODO EL<br /><span style={{ color: ACENTO }}>CATÁLOGO</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }}>
            <form
              onSubmit={(e) => { e.preventDefault(); setBusquedaFiltro(busqueda); setVisibleCount(12); }}
              style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '300px' }}
            >
              <input type="text" placeholder="Buscar..." value={busqueda} onChange={(e)=>setBusqueda(e.target.value)} style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', border: `1px solid ${BORDER}`, background: SURFACE, color: DARK, fontFamily: "'Outfit',sans-serif", fontSize: '.8rem', outline: 'none' }} onFocus={(e)=>(e.target.style.borderColor = ACENTO)} onBlur={(e)=>(e.target.style.borderColor = BORDER)} />
              <button type="submit" style={{ padding: '0 16px', background: DARK, color: BTN_TXT, border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontSize: '.8rem', fontWeight: 600, transition: 'background .2s' }} onMouseEnter={(e)=>(e.currentTarget.style.background = ACENTO)} onMouseLeave={(e)=>(e.currentTarget.style.background = DARK)}>Buscar</button>
            </form>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setCat('Todo'); setVisibleCount(12); }}
                style={{ padding: '7px 16px', borderRadius: '4px', border: `1px solid ${'Todo' === cat ? ACENTO : BORDER}`, background: 'Todo' === cat ? ACENTO : 'transparent', color: 'Todo' === cat ? BTN_TXT : MUTED, fontFamily: "'Outfit',sans-serif", fontSize: '.7rem', fontWeight: 'Todo' === cat ? 600 : 400, cursor: 'pointer', letterSpacing: '.06em', transition: 'all .18s' }}
              >
                Todo
              </button>
              {categorias.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => { setCat(c.id); setVisibleCount(12); }}
                  style={{ padding: '7px 16px', borderRadius: '4px', border: `1px solid ${c.id === cat ? ACENTO : BORDER}`, background: c.id === cat ? ACENTO : 'transparent', color: c.id === cat ? BTN_TXT : MUTED, fontFamily: "'Outfit',sans-serif", fontSize: '.7rem', fontWeight: c.id === cat ? 600 : 400, cursor: 'pointer', letterSpacing: '.06em', transition: 'all .18s' }}
                >
                  {c.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading && !productos.length ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: MUTED, fontFamily: "'Outfit',sans-serif" }}>Cargando prendas...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '16px' }}>
            {visibleProducts.map((p: any) => (
              <div key={p.id} onMouseEnter={() => setHov(p.id)} onMouseLeave={() => setHov(null)} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '3/4', background: SURFACE, transition: 'transform .25s', transform: hov === p.id ? 'translateY(-3px)' : 'translateY(0)' }}>
                  <img src={p.imagenPrincipalUrl || 'https://via.placeholder.com/300x400'} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hov === p.id ? 'scale(1.05)' : 'scale(1)', transition: 'transform .5s ease' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,20,20,.4)', opacity: hov === p.id ? 1 : 0, transition: 'opacity .3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button onClick={() => onSelect(p)} style={{ padding: '10px 24px', background: ACENTO, color: BTN_TXT, border: 'none', borderRadius: '4px', fontFamily: "'Outfit',sans-serif", fontSize: '.7rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                      Ver Producto
                    </button>
                  </div>
                  {p.destacado && (
                    <span style={{ position: 'absolute', top: '10px', left: '10px', background: DARK, color: BG, fontSize: '.56rem', fontWeight: 700, padding: '3px 8px', borderRadius: '3px', letterSpacing: '.08em', textTransform: 'uppercase' }}>
                      Destacado
                    </span>
                  )}
                </div>
                <div style={{ marginTop: '8px', padding: '0 2px' }}>
                  <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: '.8rem', fontWeight: 500, color: DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.nombre}
                  </p>
                  <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: '.65rem', color: MUTED, marginBottom: '2px' }}>
                    {p.categoria?.nombre || ''}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginTop: '4px' }}>
                    {p.precioOferta && Number(p.precioOferta) > 0 && Number(p.precioOferta) < Number(p.precio) ? (
                      <>
                        <span style={{ fontSize: '.65rem', color: SUBTLE, textDecoration: 'line-through' }}>${Number(p.precio).toLocaleString()}</span>
                        <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.2rem', color: ACENTO, letterSpacing: '.04em' }}>${Number(p.precioOferta).toLocaleString()}</span>
                      </>
                    ) : (
                      <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.2rem', color: DARK, letterSpacing: '.04em' }}>${Number(p.precio).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && visibleCount < productos.length && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
            <button
              onClick={() => setVisibleCount((v) => v + 12)}
              style={{
                padding: '14px 36px',
                background: 'transparent',
                border: `1px solid ${DARK}`,
                color: DARK,
                borderRadius: '4px',
                fontFamily: "'Outfit',sans-serif",
                fontSize: '.85rem',
                fontWeight: 600,
                letterSpacing: '.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all .25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = DARK;
                e.currentTarget.style.color = BG;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = DARK;
              }}
            >
              Ver más productos
            </button>
          </div>
        )}
      </div>
    </section>
  );
}


// ── PRODUCT DETAIL VIEW ───────────────────────────────────────
function ProductDetailView({ product, onBack, onCart, tienda }: { product: any; onBack: () => void; onCart: (p: any, qty: number) => void; tienda?: any }) {
  const [qty, setQty] = useState(1);
  useEffect(() => { window.scrollTo(0, 0); }, []);
  if (!product) return null;
  const hasOffer = product.precioOferta && Number(product.precioOferta) > 0 && Number(product.precioOferta) < Number(product.precio);

  return (
    <div style={{ padding: '3rem 1.5rem', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: '1060px', margin: '0 auto', width: '100%', flex: 1 }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: MUTED, fontFamily: "'Outfit',sans-serif", fontSize: '.85rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', padding: 0 }}
        >
          <span style={{ fontSize: '1.2rem' }}>←</span> Volver al catálogo
        </button>

        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 400px', position: 'relative', aspectRatio: '3/4', borderRadius: '8px', overflow: 'hidden', background: SURFACE }}>
            <img src={product.imagenPrincipalUrl || 'https://via.placeholder.com/600x800'} alt={product.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '.75rem', color: MUTED, marginBottom: '.75rem', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600 }}>
              {product.categoria?.nombre || 'Producto'}
            </span>

            <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: DARK, letterSpacing: '.04em', lineHeight: 0.9, marginBottom: '1.2rem' }}>
              {product.nombre}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
              {hasOffer ? (
                <>
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.2rem', color: MUTED, textDecoration: 'line-through' }}>
                    ${Number(product.precio).toLocaleString()}
                  </span>
                  <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2.4rem', color: ACENTO, letterSpacing: '.04em' }}>
                    ${Number(product.precioOferta).toLocaleString()}
                  </span>
                  <span style={{ background: `${ACENTO}15`, color: ACENTO, padding: '4px 10px', borderRadius: '4px', fontSize: '.7rem', fontWeight: 700, marginLeft: '4px', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                    Sale
                  </span>
                </>
              ) : (
                <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2.4rem', color: DARK, letterSpacing: '.04em' }}>
                  ${Number(product.precio).toLocaleString()}
                </span>
              )}
            </div>

            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1rem', color: SUBTLE, lineHeight: 1.7, marginBottom: '2.5rem' }}>
              {product.descripcion ? product.descripcion : 'Diseño exclusivo pensado para la nueva temporada. Calidad superior y detalles únicos en cada prenda.'}
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', border: `1px solid ${BORDER}`, borderRadius: '4px', overflow: 'hidden', width: '120px', background: 'transparent' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ flex: 1, background: 'transparent', border: 'none', cursor: 'pointer', color: DARK, fontSize: '1.2rem'}}>−</button>
                <span style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit',sans-serif", fontSize: '1rem', fontWeight: 600, color: DARK }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} style={{ flex: 1, background: 'transparent', border: 'none', cursor: 'pointer', color: DARK, fontSize: '1.2rem'}}>+</button>
              </div>

              <button
                onClick={() => onCart(product, qty)}
                style={{ flex: 1, background: DARK, color: BTN_TXT, border: 'none', borderRadius: '4px', fontFamily: "'Outfit',sans-serif", fontSize: '.85rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer', padding: '0 2rem', minHeight: '52px', transition: 'background .2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = ACENTO)}
                onMouseLeave={(e) => (e.currentTarget.style.background = DARK)}
              >
                Agregar al Carrito
              </button>
            </div>

            <div style={{ marginTop: 'auto', borderTop: `1px solid ${BORDER}`, paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {tienda?.metodosEntrega?.length > 0 && (
                <div>
                  <h4 style={{ fontFamily: "'Outfit',sans-serif", fontSize: '.85rem', fontWeight: 600, letterSpacing: '.05em', color: DARK, marginBottom: '0.8rem', textTransform: 'uppercase' }}>Envíos</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {tienda.metodosEntrega.map((me: any) => (
                      <MetodoChip
                        key={me.metodoEntrega.id}
                        nombre={me.metodoEntrega.nombre}
                        iconSize={18}
                        borderColor={BORDER}
                        backgroundColor="transparent"
                        textColor={MUTED}
                      />
                    ))}
                  </div>
                </div>
              )}
              {tienda?.metodosPago?.length > 0 && (
                <div>
                  <h4 style={{ fontFamily: "'Outfit',sans-serif", fontSize: '.85rem', fontWeight: 600, letterSpacing: '.05em', color: DARK, marginBottom: '0.8rem', textTransform: 'uppercase' }}>Medios de Pago</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {tienda.metodosPago.map((mp: any) => (
                      <MetodoChip
                        key={mp.metodoPago.id}
                        nombre={mp.metodoPago.nombre}
                        iconSize={18}
                        borderColor={BORDER}
                        backgroundColor="transparent"
                        textColor={MUTED}
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

/* ═══════════════════════════════════════════════
   BANNER — promo strip
═══════════════════════════════════════════════ */
function Banner() {
  return (
    <section style={{ background: ACENTO, padding: '3.5rem 2rem' }}>
      <div
        style={{
          maxWidth: '1060px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 'clamp(2rem,4vw,3rem)',
              color: BTN_TXT,
              letterSpacing: '.04em',
              lineHeight: 0.9,
              marginBottom: '.5rem',
            }}
          >
            ENVÍO GRATIS
            <br />
            EN PEDIDOS +$10.000
          </h3>
          <p
            style={{
              fontFamily: "'Outfit',sans-serif",
              fontSize: '.8rem',
              fontWeight: 300,
              color: 'rgba(255,255,255,.75)',
            }}
          >
            A todo Tucumán y alrededores.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { n: '+300', l: 'prendas vendidas' },
            { n: '100%', l: 'diseño local' },
            { n: '4.9★', l: 'calificación' },
          ].map(({ n, l }) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: '1.8rem',
                  color: BTN_TXT,
                  letterSpacing: '.06em',
                  lineHeight: 1,
                }}
              >
                {n}
              </div>
              <div
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: '.62rem',
                  color: 'rgba(255,255,255,.65)',
                  marginTop: '3px',
                  letterSpacing: '.06em',
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>
        <a
          href={`https://wa.me/${TIENDA.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          style={{
            padding: '13px 28px',
            background: DARK,
            color: BTN_TXT,
            borderRadius: '4px',
            textDecoration: 'none',
            fontFamily: "'Outfit',sans-serif",
            fontSize: '.75rem',
            fontWeight: 600,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
          }}
        >
          Consultanos →
        </a>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   CART DRAWER
═══════════════════════════════════════════════ */
function CartDrawer({
  items,
  onClose,
  onQty,
  onRemove,
}: {
  items: any[];
  onClose: () => void;
  onQty: (id: number, q: number) => void;
  onRemove: (id: number) => void;
}) {
  const subtotal = items.reduce((a, i) => a + i.precio * i.qty, 0);
  const ship = subtotal >= 10000 ? 0 : 900;
  const total = subtotal + ship;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,.45)',
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
          width: 'min(400px,100vw)',
          background: SURFACE,
          borderLeft: `1px solid ${BORDER}`,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-20px 0 60px rgba(0,0,0,.1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: '1.4rem',
              color: DARK,
              letterSpacing: '.08em',
            }}
          >
            CARRITO{' '}
            {items.length > 0 && (
              <span
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: '.72rem',
                  fontWeight: 400,
                  color: ACENTO,
                  letterSpacing: 0,
                }}
              >
                {items.length} ítems
              </span>
            )}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: MUTED,
              fontSize: '1.1rem',
            }}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
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
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: '.85rem', color: MUTED }}>
                Tu carrito está vacío
              </p>
              <button
                onClick={onClose}
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: '.78rem',
                  color: ACENTO,
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
                  borderBottom: `1px solid ${BORDER}`,
                }}
              >
                <div
                  style={{
                    width: '72px',
                    height: '90px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    background: BG,
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.nombre}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontFamily: "'Outfit',sans-serif",
                      fontSize: '.8rem',
                      fontWeight: 500,
                      color: DARK,
                    }}
                  >
                    {item.nombre}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Outfit',sans-serif",
                      fontSize: '.65rem',
                      color: MUTED,
                      marginTop: '2px',
                    }}
                  >
                    {item.cat}
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
                        border: `1px solid ${BORDER}`,
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      {[
                        {
                          l: '−',
                          a: () =>
                            item.qty > 1 ? onQty(item.id, item.qty - 1) : onRemove(item.id),
                        },
                        { l: String(item.qty), a: null },
                        { l: '+', a: () => onQty(item.id, item.qty + 1) },
                      ].map(({ l, a }, i) => (
                        <div
                          key={i}
                          onClick={a ?? undefined}
                          style={{
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: a ? 'pointer' : 'default',
                            color: i === 1 ? DARK : MUTED,
                            fontFamily: "'Outfit',sans-serif",
                            fontSize: '.85rem',
                            fontWeight: i === 1 ? 600 : 400,
                            borderLeft: i > 0 ? `1px solid ${BORDER}` : 'none',
                            background: i === 1 ? BG : 'transparent',
                          }}
                        >
                          {l}
                        </div>
                      ))}
                    </div>
                    <span
                      style={{
                        fontFamily: "'Bebas Neue',sans-serif",
                        fontSize: '1.15rem',
                        color: ACENTO,
                        letterSpacing: '.04em',
                      }}
                    >
                      ${(item.precio * item.qty).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    style={{
                      marginTop: '6px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: "'Outfit',sans-serif",
                      fontSize: '.62rem',
                      color: SUBTLE,
                      padding: 0,
                      transition: 'color .2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = SUBTLE)}
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
            style={{ padding: '1.25rem 1.5rem', borderTop: `1px solid ${BORDER}`, background: BG }}
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
                <span
                  style={{ fontFamily: "'Outfit',sans-serif", fontSize: '.75rem', color: MUTED }}
                >
                  {l}
                </span>
                <span
                  style={{
                    fontFamily: "'Outfit',sans-serif",
                    fontSize: '.75rem',
                    color: green ? '#16a34a' : SUBTLE,
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
            {ship > 0 && (
              <p
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: '.62rem',
                  color: SUBTLE,
                  marginBottom: '8px',
                }}
              >
                Envío gratis en pedidos desde $10.000
              </p>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '10px',
                borderTop: `1px solid ${BORDER}`,
                marginBottom: '1.1rem',
              }}
            >
              <span
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: '.88rem',
                  fontWeight: 600,
                  color: DARK,
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: '1.5rem',
                  color: DARK,
                  letterSpacing: '.04em',
                }}
              >
                ${total.toLocaleString()}
              </span>
            </div>
            <button
              style={{
                width: '100%',
                padding: '14px',
                background: DARK,
                color: BTN_TXT,
                border: 'none',
                borderRadius: '4px',
                fontFamily: "'Outfit',sans-serif",
                fontSize: '.75rem',
                fontWeight: 700,
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                marginBottom: '8px',
                transition: 'background .2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = ACENTO)}
              onMouseLeave={(e) => (e.currentTarget.style.background = DARK)}
            >
              Confirmar pedido
            </button>
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '11px',
                background: 'transparent',
                border: `1px solid ${BORDER}`,
                borderRadius: '4px',
                color: MUTED,
                fontFamily: "'Outfit',sans-serif",
                fontSize: '.72rem',
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

/* ═══════════════════════════════════════════════
   SOBRE NOSOTROS
═══════════════════════════════════════════════ */
function SobreNosotros({ tienda }: { tienda: any }) {
  if (!tienda?.descripcion) return null;

  return (
    <section style={{ padding: '6rem 2rem', background: BG, borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h2
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            color: DARK,
            letterSpacing: '.04em',
            marginBottom: '1.5rem',
            lineHeight: 1
          }}
        >
          SOBRE LA MARCA
        </h2>
        <p
          style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            fontWeight: 400,
            color: SUBTLE,
            lineHeight: 1.8,
            maxWidth: '600px',
            margin: '0 auto 2.5rem'
          }}
        >
          {tienda.descripcion}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
          {tienda?.ciudad && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>📍</span>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '.85rem', color: DARK, fontWeight: 500, letterSpacing: '.05em', textTransform: 'uppercase' }}>
                {tienda.ciudad}{tienda.provincia && `, ${tienda.provincia}`}
              </span>
            </div>
          )}
          {tienda?.instagram && (
            <a href={`https://instagram.com/${tienda.instagram}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>📷</span>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '.85rem', color: DARK, fontWeight: 500, letterSpacing: '.05em', textTransform: 'uppercase' }}>
                @{tienda.instagram}
              </span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════ */
function Footer({ tienda }: { tienda: any }) {
  const socials = [
    {
      label: 'IG',
      href: `https://instagram.com/${tienda.instagram}`,
      icon: (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: 'WA',
      href: `https://wa.me/${tienda.whatsapp}`,
      icon: (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
    },
  ];
  return (
    <footer style={{ background: 'var(--rop-footer-bg)', borderTop: '1px solid var(--rop-border)', padding: '0 2rem' }}>
      <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2.5rem',
            justifyContent: 'space-between',
            padding: '3rem 0 2.5rem',
            borderBottom: '0.5px solid rgba(247,245,242,0.1)',
          }}
        >
          <div style={{ minWidth: '180px' }}>
            <div
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: '2rem',
                color: BG,
                letterSpacing: '.08em',
                marginBottom: '4px',
              }}
            >
              {tienda.nombre}
            </div>
            <div
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: '.62rem',
                color: 'rgba(247,245,242,.3)',
                letterSpacing: '.16em',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              {tienda.tagline}
            </div>
            <p
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: '.72rem',
                fontWeight: 300,
                color: 'rgba(247,245,242,.45)',
                lineHeight: 1.8,
                maxWidth: '220px',
              }}
            >
              {tienda.descripcion}
            </p>
          </div>
          <div>
            <p
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: '.58rem',
                letterSpacing: '.2em',
                textTransform: 'uppercase',
                color: 'rgba(247,245,242,.25)',
                marginBottom: '.9rem',
                fontWeight: 600,
              }}
            >
              Contacto
            </p>
            <a
              href={`https://wa.me/${tienda.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block',
                fontFamily: "'Outfit',sans-serif",
                fontSize: '.72rem',
                color: 'rgba(247,245,242,.5)',
                textDecoration: 'none',
                marginBottom: '6px',
              }}
            >
              📱 {tienda.whatsapp}
            </a>
            <a
              href={`https://instagram.com/${tienda.instagram}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block',
                fontFamily: "'Outfit',sans-serif",
                fontSize: '.72rem',
                color: 'rgba(247,245,242,.5)',
                textDecoration: 'none',
              }}
            >
              📷 @{tienda.instagram}
            </a>
          </div>
          <div>
            <p
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: '.58rem',
                letterSpacing: '.2em',
                textTransform: 'uppercase',
                color: 'rgba(247,245,242,.25)',
                marginBottom: '.9rem',
                fontWeight: 600,
              }}
            >
              Ubicación
            </p>
            <p
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: '.72rem',
                color: 'rgba(247,245,242,.5)',
                lineHeight: 1.75,
              }}
            >
              {tienda.ciudad}
              <br />
              {tienda.pais}
            </p>
          </div>
          <div>
            <p
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: '.58rem',
                letterSpacing: '.2em',
                textTransform: 'uppercase',
                color: 'rgba(247,245,242,.25)',
                marginBottom: '.9rem',
                fontWeight: 600,
              }}
            >
              Seguinos
            </p>
            <div style={{ display: 'flex', gap: '6px' }}>
              {socials.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '4px',
                    border: '0.5px solid rgba(247,245,242,.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(247,245,242,.35)',
                    textDecoration: 'none',
                    transition: 'all .2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = ACENTO;
                    e.currentTarget.style.color = ACENTO;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(247,245,242,.12)';
                    e.currentTarget.style.color = 'rgba(247,245,242,.35)';
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

        </div>
        <p
          style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: '.62rem',
            color: 'rgba(247,245,242,.18)',
            textAlign: 'center',
            padding: '.9rem 0',
          }}
        >
          © {new Date().getFullYear()}{' '}
          <span style={{ color: ACENTO, opacity: 0.8 }}>{tienda.nombre}</span> — Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════ */
function Toast({ msg, visible }: { msg: string; visible: boolean }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0' : '12px'})`,
        background: DARK,
        border: `1.5px solid ${ACENTO}`,
        borderRadius: '4px',
        padding: '11px 22px',
        fontFamily: "'Outfit',sans-serif",
        fontSize: '.75rem',
        fontWeight: 500,
        color: BG,
        zIndex: 60,
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
        transition: 'all .3s ease',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ color: ACENTO, marginRight: '8px', fontWeight: 700 }}>✓</span>
      {msg}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════ */
export interface PlantillaRopaProps {
  tienda?: any;
  tema?: any;
  accent?: string;
  themeConfig?: any;
}

export default function PlantillaRopa({ tienda, accent, themeConfig }: PlantillaRopaProps) {
  const resolvedAccent = accent || themeConfig?.primary || '#e63946';

  const mergedTienda = useMemo(
    () => ({
      ...TIENDA,
      nombre: tienda?.nombre || tienda?.titulo || TIENDA.nombre,
      tagline: tienda?.tagline || TIENDA.tagline,
      descripcion: tienda?.descripcion || TIENDA.descripcion,
      whatsapp: tienda?.whatsapp || TIENDA.whatsapp,
      instagram: tienda?.instagram || TIENDA.instagram,
      ciudad: tienda?.ciudad || TIENDA.ciudad,
      pais: tienda?.pais || TIENDA.pais,
      metodosPago: tienda?.metodosPago || [],
      metodosEntrega: tienda?.metodosEntrega || [],
    }),
    [tienda]
  );

  useEffect(() => {
    ACENTO = 'var(--rop-acento)';
    TIENDA = { ...mergedTienda };
  }, [resolvedAccent, mergedTienda]);

  const isDark = themeConfig?.modoOscuro;

  // Variables inyectadas que responden mágicamente al tema Oscuro/Claro
  const cssVars = {
    '--rop-bg': isDark ? '#121212' : '#f7f5f2',
    '--rop-bg-alpha': isDark ? 'rgba(18,18,18,0.96)' : 'rgba(247,245,242,0.96)',
    '--rop-dark': isDark ? '#f5f0e8' : '#141414',
    '--rop-surface': isDark ? '#1e1e1e' : '#ffffff',
    '--rop-acento': resolvedAccent,
    '--rop-muted': isDark ? '#a8a29e' : '#888580',
    '--rop-subtle': isDark ? '#57534e' : '#b8b4af',
    '--rop-border': isDark ? 'rgba(255,255,255,0.08)' : 'rgba(20,20,20,0.09)',
    '--rop-btn-txt': isDark ? '#141414' : '#ffffff',
    '--rop-nav-link': isDark ? 'rgba(245,240,232,0.7)' : 'rgba(20,20,20,0.7)',
    '--rop-slider-text': isDark ? 'rgba(20,20,20,0.45)' : 'rgba(247,245,242,0.35)',
    '--rop-footer-bg': isDark ? '#000000' : '#141414',
  } as React.CSSProperties;

  //props que le pasamos a carrusel
  const carruselItems = tienda?.carrusel || [];
  const tiendaIdNum = Number(tienda?.id);
  const { data: destacadosData } = useStorefrontDestacados(tiendaIdNum);
  const destacadosProducts = destacadosData?.datos || [];

  console.log('carrusel en tienda ', tienda?.carrusel);
  const [cart, setCart] = useState<any[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ msg: '', visible: false });
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [view, setView] = useState<'home' | 'auth' | 'account'>('home');

  const { cliente, logout } = useAuthSessionStore();

  const addToCart = (p: any, qty: number = 1) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.id === p.id);
      return ex
        ? prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + qty } : i))
        : [...prev, { ...p, qty: qty }];
    });
    setToast({ msg: `${p.nombre} agregado`, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2200);
  };

  const cartCount = cart.reduce((a, i) => a + i.qty, 0);

  return (
    <div style={cssVars}>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        img { display: block; }
        .vt-scroll { overflow-y: auto; height: 100vh; scroll-behavior: smooth; }
        .vt-hide-mob { display: flex !important; }
        .vt-show-mob { display: none !important; }
        @media(max-width: 680px) {
          .vt-hide-mob { display: none !important; }
          .vt-show-mob { display: flex !important; }
        }
      `}</style>

      <div className="vt-scroll" style={{ background: BG }}>
        <Navbar 
          cartCount={cartCount} 
          onCart={() => setCartOpen(true)} 
          onIngresar={() => setView('auth')}
          onMiCuenta={() => setView('account')}
        />

        {view === 'home' && (
          selectedProduct ? (
            <ProductDetailView
              product={selectedProduct}
              onBack={() => setSelectedProduct(null)}
              onCart={addToCart}
              tienda={mergedTienda}
            />
          ) : (
            <>
              <Hero carrusel={carruselItems} />
              <Marquee />
              <Lookbook />
              <CarruselProductos onCart={(p) => addToCart(p, 1)} items={destacadosProducts} />
              <GridProductos onSelect={setSelectedProduct} tiendaId={tiendaIdNum} />
              <SobreNosotros tienda={mergedTienda} />
              <Banner />
              <Footer tienda={mergedTienda} />
            </>
          )
        )}

        {view === 'auth' && (
          <AuthView 
            onClose={() => setView('home')} 
            tienda={mergedTienda}
          />
        )}

        {view === 'account' && (
          <div style={{ padding: '6rem 2rem', minHeight: '80vh', display: 'flex', justifyContent: 'center', background: BG }}>
             <div style={{ maxWidth: '500px', width: '100%' }}>
                <button 
                  onClick={() => setView('home')}
                  style={{ background: 'none', border: 'none', color: ACENTO, cursor: 'pointer', marginBottom: '2rem', fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}
                >
                  ← VOLVER
                </button>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', color: DARK, marginBottom: '2rem', letterSpacing: '.05em' }}>MI CUENTA</h2>
                <div style={{ background: SURFACE, padding: '2rem', borderRadius: '8px', border: `1px solid ${BORDER}`, fontFamily: "'Outfit', sans-serif" }}>
                   <p style={{ color: DARK, marginBottom: '1rem', fontSize: '0.9rem' }}><strong>EMAIL:</strong> {cliente?.email}</p>
                   <p style={{ color: DARK, marginBottom: '1rem', fontSize: '0.9rem' }}><strong>NOMBRE:</strong> {cliente?.nombre} {cliente?.apellido}</p>
                   <p style={{ color: DARK, marginBottom: '2rem', fontSize: '0.9rem' }}><strong>TELÉFONO:</strong> {cliente?.telefono}</p>
                   <button 
                     onClick={() => { logout(); setView('home'); }}
                     style={{ padding: '12px 24px', background: DARK, color: BTN_TXT, border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontFamily: "'Outfit', sans-serif", letterSpacing: '.1em' }}
                   >
                     CERRAR SESIÓN
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>

      {cartOpen && (
        <CartDrawer
          items={cart}
          onClose={() => setCartOpen(false)}
          onQty={(id, q) => setCart((p) => p.map((i) => (i.id === id ? { ...i, qty: q } : i)))}
          onRemove={(id) => setCart((p) => p.filter((i) => i.id !== id))}
        />
      )}

      <Toast msg={toast.msg} visible={toast.visible} />
    </div>
  );
}
