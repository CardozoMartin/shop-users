import { useEffect, useMemo, useState } from 'react';
import { useCarrito } from '../../../hooks/useCarrito';
import {
  useStorefrontCategorias,
  useStorefrontNormales,
} from '../../../hooks/useStorefrontProducts';
import { useAuthSessionStore } from '../../../store/useAuthSession';
import AuthView from './AuthView';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');`;

// ── COLORES FIJOS ─────────────────────────────────────────────
let ACENTO = 'var(--acc-acento)'; // bronce cálido
const BG = 'var(--acc-bg)'; // crema
const SURFACE = 'var(--acc-surface)';
const SURFACE2 = 'var(--acc-surface2)';
const TXT = 'var(--acc-txt)';
const MUTED = 'var(--acc-muted)';
const SUBTLE = 'var(--acc-subtle)';
const BORDER = 'var(--acc-border)';
const BTN_TXT = 'var(--acc-btn-txt)';
const ACENTO_BG = `${ACENTO}18`;
const ACENTO_BDR = `${ACENTO}40`;

let TIENDA = {
  nombre: 'Alma Dorada',
  descripcion:
    'Joyería y accesorios artesanales hechos a mano en Tucumán. Cada pieza cuenta una historia.',
  whatsapp: '5493812345678',
  instagram: 'almadorada.tuc',
  facebook: 'almadoradatucuman',
  ciudad: 'Tucumán',
  pais: 'Argentina',
};

const HERO_IMGS = [
  'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=900&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573408301185-9519f94815b0?w=900&h=900&fit=crop&q=80',
];

// ── NAVBAR ────────────────────────────────────────────────────
function Navbar({
  cartCount,
  onCart,
  onIngresar,
  onMiCuenta,
}: {
  cartCount: number;
  onCart: () => void;
  onIngresar: () => void;
  onMiCuenta: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Obtenemos el cliente del store de sesión
  const cliente = useAuthSessionStore((s) => s.cliente);

  useEffect(() => {
    const el = document.querySelector('.ac-scroll');
    const fn = () => setScrolled((el?.scrollTop ?? 0) > 60);
    el?.addEventListener('scroll', fn, { passive: true });
    return () => el?.removeEventListener('scroll', fn);
  }, []);

  const navBg = scrolled ? 'var(--acc-bg-alpha)' : 'transparent';

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: navBg,
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `0.5px solid ${BORDER}` : 'none',
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all .35s ease',
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
        <span
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: '1.4rem',
            fontWeight: 400,
            color: TXT,
            letterSpacing: '.04em',
          }}
        >
          {TIENDA.nombre}
        </span>
        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: ACENTO,
            display: 'inline-block',
            marginBottom: '3px',
          }}
        />
      </div>

      {/* Desktop */}
      <div className="ac-hide-mob" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {['Inicio', 'Colección', 'Nosotros', 'Contacto'].map((l) => (
          <a
            key={l}
            href="#"
            style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: '.75rem',
              color: `${TXT}88`,
              textDecoration: 'none',
              letterSpacing: '.08em',
              transition: 'color .2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = ACENTO)}
            onMouseLeave={(e) => (e.currentTarget.style.color = `${TXT}88`)}
          >
            {l}
          </a>
        ))}

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
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
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
                top: '-4px',
                right: '-6px',
                background: ACENTO,
                color: BTN_TXT,
                fontSize: '.52rem',
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

        {/* CTA Login / Mi Cuenta */}
        <button
          onClick={cliente ? onMiCuenta : onIngresar}
          style={{
            padding: '8px 20px',
            background: 'transparent',
            border: `0.5px solid ${ACENTO}`,
            borderRadius: '20px',
            color: ACENTO,
            fontFamily: "'Jost',sans-serif",
            fontSize: '.68rem',
            fontWeight: 500,
            letterSpacing: '.1em',
            cursor: 'pointer',
            transition: 'all .2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = ACENTO;
            (e.currentTarget as HTMLButtonElement).style.color = BTN_TXT;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = ACENTO;
          }}
        >
          {cliente ? 'Mi cuenta' : 'Ingresar'}
        </button>
      </div>

      {/* Hamburger */}
      <button
        className="ac-show-mob"
        onClick={() => setOpen(!open)}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
          <rect width="20" height="1.5" rx=".75" fill={TXT} />
          <rect x="5" y="6" width="15" height="1.5" rx=".75" fill={TXT} />
          <rect x="2" y="12" width="18" height="1.5" rx=".75" fill={TXT} />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '64px',
            left: 0,
            right: 0,
            background: SURFACE,
            borderBottom: `0.5px solid ${BORDER}`,
            padding: '1.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 50,
            boxShadow: '0 8px 24px rgba(42,31,20,.06)',
          }}
        >
          {['Inicio', 'Colección', 'Nosotros', 'Contacto'].map((l) => (
            <a
              key={l}
              href="#"
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: '.85rem',
                color: MUTED,
                textDecoration: 'none',
              }}
            >
              {l}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

// ── HERO PARALLAX ─────────────────────────────────────────────
function Hero({ titulo, descripcion, imagenes }: IHeroProps) {
  const [scrollY, setScrollY] = useState(0);
  console.log('imagenes de carrusel en hero', imagenes);
  useEffect(() => {
    const el = document.querySelector('.ac-scroll');
    const fn = () => setScrollY(el?.scrollTop ?? 0);
    el?.addEventListener('scroll', fn, { passive: true });
    return () => el?.removeEventListener('scroll', fn);
  }, []);

  return (
    <section
      style={{
        background: BG,
        overflow: 'hidden',
        padding: '4rem 2rem 5rem',
        position: 'relative',
      }}
    >
      {/* Dot grid decorativo */}
      <div
        style={{
          position: 'absolute',
          right: '4%',
          top: '10%',
          opacity: 0.1,
          pointerEvents: 'none',
        }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100">
          {[0, 1, 2, 3, 4].flatMap((r) =>
            [0, 1, 2, 3, 4].map((c) => (
              <circle key={`${r}-${c}`} cx={8 + c * 20} cy={8 + r * 20} r="2.8" fill={ACENTO} />
            ))
          )}
        </svg>
      </div>
      {/* Círculo decorativo fondo */}
      <div
        style={{
          position: 'absolute',
          right: '-5%',
          top: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `${ACENTO}08`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '1060px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
          gap: '3rem',
          alignItems: 'center',
        }}
      >
        {/* Text */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span
            style={{
              display: 'inline-block',
              fontFamily: "'Jost',sans-serif",
              fontSize: '.6rem',
              letterSpacing: '.26em',
              textTransform: 'uppercase',
              color: ACENTO,
              fontWeight: 500,
              marginBottom: '1.2rem',
              paddingBottom: '.5rem',
              borderBottom: `1px solid ${ACENTO_BDR}`,
            }}
          >
            {TIENDA.ciudad} · Artesanal
          </span>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 'clamp(2.8rem,5.5vw,4.5rem)',
              fontWeight: 300,
              color: TXT,
              lineHeight: 1.02,
              marginBottom: '1.1rem',
            }}
          >
            {titulo || TIENDA.nombre}
            <br />
          </h1>

          <p
            style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: '.84rem',
              fontWeight: 300,
              color: MUTED,
              lineHeight: 1.85,
              maxWidth: '360px',
              marginBottom: '1.75rem',
            }}
          >
            {descripcion || TIENDA.descripcion}
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              style={{
                padding: '12px 30px',
                background: ACENTO,
                color: BTN_TXT,
                border: 'none',
                borderRadius: '6px',
                fontFamily: "'Jost',sans-serif",
                fontSize: '.68rem',
                fontWeight: 600,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'opacity .2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Ver colección
            </button>
            <a
              href={`https://wa.me/${TIENDA.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              style={{
                padding: '12px 22px',
                background: 'transparent',
                border: `0.5px solid ${ACENTO_BDR}`,
                borderRadius: '6px',
                color: ACENTO,
                fontFamily: "'Jost',sans-serif",
                fontSize: '.68rem',
                fontWeight: 500,
                letterSpacing: '.1em',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all .2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = ACENTO;
                e.currentTarget.style.color = BTN_TXT;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = ACENTO;
              }}
            >
              WhatsApp
            </a>
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: '2rem',
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: `0.5px solid ${BORDER}`,
            }}
          >
            {[
              { n: '+200', l: 'piezas vendidas' },
              { n: '100%', l: 'artesanal' },
              { n: '5★', l: 'calificación' },
            ].map(({ n, l }) => (
              <div key={l}>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: '1.5rem',
                    fontWeight: 400,
                    color: ACENTO,
                    lineHeight: 1,
                  }}
                >
                  {n}
                </div>
                <div
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: '.62rem',
                    color: MUTED,
                    marginTop: '3px',
                    letterSpacing: '.06em',
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Parallax image stack */}
        <div style={{ position: 'relative', height: '480px' }}>
          {[
            {
              src: imagenes?.[0] || HERO_IMGS[0],
              w: '72%',
              h: '76%',
              top: '0',
              left: '0',
              z: 1,
              factor: 0.9,
            },
            {
              src: imagenes?.[1] || HERO_IMGS[1],
              w: '58%',
              h: '58%',
              top: '30%',
              left: '33%',
              z: 2,
              factor: 2.0,
            },
            {
              src: imagenes?.[2] || HERO_IMGS[2],
              w: '40%',
              h: '40%',
              top: '5%',
              left: '53%',
              z: 3,
              factor: 3.2,
            },
          ].map((l, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: l.w,
                height: l.h,
                top: l.top,
                left: l.left,
                zIndex: l.z,
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: `0 12px 40px ${ACENTO}20`,
                transform: `translateY(${scrollY * l.factor * 0.04}px)`,
                transition: 'transform .06s linear',
              }}
            >
              <img
                src={l.src}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
          {/* Label flotante */}
          <div
            style={{
              position: 'absolute',
              bottom: '4%',
              left: '2%',
              zIndex: 4,
              background: SURFACE,
              borderRadius: '12px',
              padding: '10px 16px',
              boxShadow: `0 4px 20px ${ACENTO}18`,
            }}
          >
            <div
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: '.58rem',
                color: MUTED,
                marginBottom: '2px',
                letterSpacing: '.08em',
              }}
            >
              Pieza destacada
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: '1rem',
                fontWeight: 400,
                color: TXT,
              }}
            >
              Ver Coleccion
            </div>
            <div
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: '.75rem',
                color: ACENTO,
                fontWeight: 500,
                marginTop: '2px',
              }}
            >
              Click Aqui →
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── MARQUEE ───────────────────────────────────────────────────
function Marquee() {
  const words = [
    'Alma Dorada',
    'Hecho a mano',
    'Tucumán',
    'Bijouterie',
    'Artesanal',
    'Con amor',
    'Piezas únicas',
  ];
  const items = [...words, ...words, ...words];
  return (
    <div style={{ background: ACENTO, overflow: 'hidden', padding: '9px 0' }}>
      <style>{`@keyframes acmq{from{transform:translateX(0)}to{transform:translateX(-33.33%)}} .ac-track{display:flex;width:max-content;animation:acmq 24s linear infinite} .ac-track:hover{animation-play-state:paused}`}</style>
      <div className="ac-track">
        {items.map((w, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: '.62rem',
              fontWeight: 500,
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.9)',
              padding: '0 1.8rem',
              whiteSpace: 'nowrap',
            }}
          >
            {w} <span style={{ opacity: 0.45 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── TRUST BADGES ──────────────────────────────────────────────
function TrustBadges() {
  return (
    <section style={{ background: SURFACE }}>
      <div
        style={{
          maxWidth: '1060px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
          borderTop: `0.5px solid ${BORDER}`,
          borderBottom: `0.5px solid ${BORDER}`,
        }}
      >
        {[
          { icon: '✦', title: '100% artesanal', sub: 'Cada pieza, única' },
          { icon: '🚚', title: 'Envío a domicilio', sub: 'Tucumán y alrededores' },
          { icon: '↩', title: 'Devolución fácil', sub: '15 días garantizados' },
          { icon: '💛', title: 'Hecho con amor', sub: 'Desde Tucumán al mundo' },
        ].map(({ icon, title, sub }) => (
          <div
            key={title}
            style={{
              padding: '1.4rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '.85rem',
              borderRight: `0.5px solid ${BORDER}`,
            }}
          >
            <span style={{ fontSize: '18px', color: ACENTO, flexShrink: 0 }}>{icon}</span>
            <div>
              <p
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: '.75rem',
                  fontWeight: 500,
                  color: TXT,
                  marginBottom: '2px',
                }}
              >
                {title}
              </p>
              <p style={{ fontFamily: "'Jost',sans-serif", fontSize: '.65rem', color: MUTED }}>
                {sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── PRODUCTOS ─────────────────────────────────────────────────
function Productos({
  onCart,
  onSelect,
  tiendaId,
}: {
  onCart: (p: any) => void;
  onSelect: (p: any) => void;
  tiendaId: number;
}) {
  const [cat, setCat] = useState<number | 'Todo'>('Todo');
  const [hov, setHov] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  //hook para obtener los productos desde la base de datos
  const tiendaIdNum = Number(tiendaId);
  const { data: categoriasData } = useStorefrontCategorias(tiendaIdNum);
  console.log('categoriasData', categoriasData);
  const categorias = categoriasData || [];

  const { data: productosData } = useStorefrontNormales(tiendaIdNum, {
    categoriaId: cat !== 'Todo' ? cat : undefined,
  });
  const allProductos = productosData?.datos || [];
  const productos = allProductos.slice(0, visibleCount);
  return (
    <section style={{ background: BG, padding: '4.5rem 2rem' }}>
      <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '.75rem',
                marginBottom: '.6rem',
              }}
            >
              <div style={{ width: '1.6rem', height: '1px', background: ACENTO }} />
              <span
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: '.58rem',
                  letterSpacing: '.26em',
                  textTransform: 'uppercase',
                  color: ACENTO,
                  fontWeight: 500,
                }}
              >
                Catálogo
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 'clamp(1.8rem,3.5vw,3rem)',
                fontWeight: 300,
                color: TXT,
                lineHeight: 1,
              }}
            >
              Nuestras <em style={{ fontStyle: 'italic', color: ACENTO }}>Piezas</em>
            </h2>
          </div>
          <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '.7rem', color: SUBTLE }}>
            {productos.length} productos
          </span>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <button
            onClick={() => {
              setCat('Todo');
              setVisibleCount(12);
            }}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: `0.5px solid ${cat === 'Todo' ? ACENTO : BORDER}`,
              background: cat === 'Todo' ? ACENTO_BG : 'transparent',
              color: cat === 'Todo' ? ACENTO : MUTED,
              fontFamily: "'Jost',sans-serif",
              fontSize: '.7rem',
              fontWeight: cat === 'Todo' ? 500 : 300,
              cursor: 'pointer',
              transition: 'all .18s',
            }}
          >
            Todo
          </button>
          {categorias.map((c: any) => (
            <button
              key={c.id}
              onClick={() => {
                setCat(c.id);
                setVisibleCount(12);
              }}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                border: `0.5px solid ${c.id === cat ? ACENTO : BORDER}`,
                background: c.id === cat ? ACENTO_BG : 'transparent',
                color: c.id === cat ? ACENTO : MUTED,
                fontFamily: "'Jost',sans-serif",
                fontSize: '.7rem',
                fontWeight: c.id === cat ? 500 : 300,
                cursor: 'pointer',
                transition: 'all .18s',
              }}
            >
              {c.nombre}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))',
            gap: '20px',
          }}
        >
          {productos.map((p: any, i: number) => (
            <div
              key={p.id}
              onClick={() => onSelect(p)}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
            >
              <div
                style={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  aspectRatio: '1',
                  background: SURFACE,
                  boxShadow: hov === i ? `0 8px 32px ${ACENTO}22` : `0 2px 8px ${ACENTO}08`,
                  transition: 'box-shadow .3s',
                }}
              >
                <img
                  src={p.imagenPrincipalUrl || 'https://via.placeholder.com/600'}
                  alt={p.nombre}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: hov === i ? 'scale(1.06)' : 'scale(1)',
                    transition: 'transform .5s ease',
                  }}
                />

                {/* Hover overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '10px',
                    background: `linear-gradient(to top, ${BG}cc 0%, transparent 55%)`,
                    opacity: hov === i ? 1 : 0,
                    transition: 'opacity .3s',
                  }}
                >
                  <button
                    onClick={() => onCart(p)}
                    style={{
                      width: '100%',
                      padding: '9px',
                      background: ACENTO,
                      color: BTN_TXT,
                      border: 'none',
                      borderRadius: '8px',
                      fontFamily: "'Jost',sans-serif",
                      fontSize: '.62rem',
                      fontWeight: 600,
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
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: ACENTO_BG,
                      border: `0.5px solid ${ACENTO}`,
                      borderRadius: '20px',
                      padding: '3px 10px',
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '.56rem',
                        color: ACENTO,
                        letterSpacing: '.12em',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                      }}
                    >
                      Destacado
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ marginTop: '10px', padding: '0 3px' }}>
                <p
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: '.78rem',
                    fontWeight: 300,
                    color: MUTED,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginBottom: '2px',
                  }}
                >
                  {p.nombre}
                </p>
                <p
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: '.62rem',
                    color: SUBTLE,
                    marginBottom: '4px',
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
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: '1.2rem',
                      fontWeight: 300,
                      color: ACENTO,
                    }}
                  >
                    ${Number(p.precioOferta || p.precio).toLocaleString()}
                  </span>
                  {p.precioOferta && Number(p.precioOferta) > 0 && (
                    <span
                      style={{
                        background: ACENTO_BG,
                        color: ACENTO,
                        fontSize: '.56rem',
                        fontWeight: 600,
                        padding: '2px 7px',
                        borderRadius: '20px',
                      }}
                    >
                      -{Math.round((1 - Number(p.precioOferta) / Number(p.precio)) * 100)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SECCIÓN SOBRE NOSOTROS ────────────────────────────────────
function SobreNosotros({ tienda }: { tienda: any }) {
  return (
    <section
      style={{ background: SURFACE, padding: '4rem 2rem', borderTop: `0.5px solid ${BORDER}` }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '.75rem',
            marginBottom: '1.2rem',
          }}
        >
          <div style={{ width: '2rem', height: '1px', background: ACENTO_BDR }} />
          <span
            style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: '.58rem',
              letterSpacing: '.24em',
              textTransform: 'uppercase',
              color: ACENTO,
            }}
          >
            {' '}
            Nuestra historia
          </span>
          <div style={{ width: '2rem', height: '1px', background: ACENTO_BDR }} />
        </div>
        <h3
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 'clamp(1.8rem,3vw,2.8rem)',
            fontWeight: 300,
            color: TXT,
            marginBottom: '1rem',
            lineHeight: 1.1,
          }}
        >
          Cada pieza nace de
          <br />
          <em style={{ color: ACENTO }}>manos tucumanas.</em>
        </h3>
        <p
          style={{
            fontFamily: "'Jost',sans-serif",
            fontSize: '.82rem',
            fontWeight: 300,
            color: MUTED,
            lineHeight: 1.9,
            maxWidth: '520px',
            margin: '0 auto 2rem',
          }}
        >
          {tienda?.descripcion ||
            'Somos un emprendimiento familiar del norte argentino. Diseñamos y fabricamos cada accesorio a mano, con materiales naturales y mucho amor.'}
        </p>
        <a
          href={`https://instagram.com/${tienda?.instagram || TIENDA.instagram}`}
          target="_blank"
          rel="noreferrer"
          style={{
            fontFamily: "'Jost',sans-serif",
            fontSize: '.7rem',
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            color: ACENTO,
            textDecoration: 'none',
            borderBottom: `0.5px solid ${ACENTO_BDR}`,
            paddingBottom: '2px',
          }}
        >
          Seguinos en Instagram →
        </a>
      </div>
    </section>
  );
}

// ── VISTA DE DETALLE ──────────────────────────────────────────
function ProductDetailView({
  product,
  onBack,
  onCart,
  tienda,
}: {
  product: any;
  onBack: () => void;
  onCart: (p: any, qty: number) => void;
  tienda?: any;
}) {
  const [qty, setQty] = useState(1);
  const tiendaNombre = tienda?.nombre || tienda?.titulo || 'Tienda';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) return null;

  const hasOffer =
    product.precioOferta &&
    Number(product.precioOferta) > 0 &&
    Number(product.precioOferta) < Number(product.precio);

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
            color: MUTED,
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
              background: SURFACE2,
              border: `1px solid ${BORDER}`,
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
                color: ACENTO,
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
                color: MUTED,
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
                color: TXT,
                marginBottom: '1.2rem',
                lineHeight: 1.1,
              }}
            >
              {product.nombre}
            </h1>

            <div
              style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2.5rem' }}
            >
              {hasOffer ? (
                <>
                  <span
                    style={{
                      fontFamily: "'Jost',sans-serif",
                      fontSize: '1.1rem',
                      color: SUBTLE,
                      textDecoration: 'line-through',
                      fontWeight: 300,
                    }}
                  >
                    ${Number(product.precio).toLocaleString()}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: '2.4rem',
                      fontWeight: 400,
                      color: TXT,
                    }}
                  >
                    ${Number(product.precioOferta).toLocaleString()}
                  </span>
                </>
              ) : (
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: '2.4rem',
                    fontWeight: 400,
                    color: TXT,
                  }}
                >
                  ${Number(product.precio).toLocaleString()}
                </span>
              )}
            </div>

            <p
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: '.9rem',
                color: MUTED,
                lineHeight: 1.8,
                marginBottom: '2.5rem',
                fontWeight: 300,
                whiteSpace: 'pre-wrap',
              }}
            >
              {product.descripcion ||
                'Una pieza única de diseño artesanal, pensada para resaltar la elegancia natural con materiales de primera calidad.'}
            </p>

            <div
              style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '2.5rem' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: `1px solid ${BORDER}`,
                  borderRadius: '0px',
                }}
              >
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{
                    padding: '10px 15px',
                    background: 'none',
                    border: 'none',
                    color: TXT,
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
                    color: TXT,
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
                    color: TXT,
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => onCart(product, qty)}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: TXT,
                  color: BG,
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

            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '1.5rem' }}>
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
                    color: MUTED,
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

// ── CART DRAWER ───────────────────────────────────────────────
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
          background: SURFACE,
          borderLeft: `0.5px solid ${BORDER}`,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-16px 0 48px rgba(42,31,20,.08)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: `0.5px solid ${BORDER}`,
          }}
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: '1.25rem',
              fontWeight: 300,
              color: TXT,
            }}
          >
            Carrito{' '}
            {items.length > 0 && (
              <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '.72rem', color: ACENTO }}>
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
              <p style={{ fontFamily: "'Jost',sans-serif", fontSize: '.82rem', color: MUTED }}>
                Tu carrito está vacío
              </p>
              <button
                onClick={onClose}
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: '.75rem',
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
                  borderBottom: `0.5px solid ${BORDER}`,
                }}
              >
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    background: SURFACE2,
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
                      color: TXT,
                    }}
                  >
                    {item.producto?.nombre}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Jost',sans-serif",
                      fontSize: '.65rem',
                      color: MUTED,
                      marginTop: '2px',
                    }}
                  >
                    {item.producto?.categoria?.nombre || 'General'}
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
                        border: `0.5px solid ${BORDER}`,
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
                            color: i === 1 ? TXT : MUTED,
                            fontSize: '.82rem',
                            borderLeft: i > 0 ? `0.5px solid ${BORDER}` : 'none',
                            background: i === 1 ? BG : 'transparent',
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
                        color: ACENTO,
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
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: `0.5px solid ${BORDER}`,
              background: BG,
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
                <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '.75rem', color: MUTED }}>
                  {l}
                </span>
                <span
                  style={{
                    fontFamily: "'Jost',sans-serif",
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
                  fontFamily: "'Jost',sans-serif",
                  fontSize: '.62rem',
                  color: SUBTLE,
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
                borderTop: `0.5px solid ${BORDER}`,
                marginBottom: '1.1rem',
              }}
            >
              <span
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: '.85rem',
                  fontWeight: 400,
                  color: TXT,
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: '1.35rem',
                  fontWeight: 300,
                  color: ACENTO,
                }}
              >
                ${total.toLocaleString()}
              </span>
            </div>
            <button
              style={{
                width: '100%',
                padding: '13px',
                background: ACENTO,
                color: BTN_TXT,
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
                border: `0.5px solid ${BORDER}`,
                borderRadius: '8px',
                color: MUTED,
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

// ── FOOTER ────────────────────────────────────────────────────
function Footer({ tienda }: { tienda: any }) {
  const socials = [
    {
      label: 'IG',
      href: `https://instagram.com/${tienda?.instagram || TIENDA.instagram}`,
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
      href: `https://wa.me/${tienda?.whatsapp || TIENDA.whatsapp}`,
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
    {
      label: 'FB',
      href: `https://facebook.com/${tienda?.facebook || TIENDA.facebook}`,
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
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      style={{
        background: 'var(--acc-footer-bg)',
        borderTop: '1px solid var(--acc-border)',
        padding: '0 2rem',
      }}
    >
      <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2.5rem',
            justifyContent: 'space-between',
            padding: '3rem 0 2.5rem',
            borderBottom: '0.5px solid rgba(245,241,235,0.1)',
          }}
        >
          {/* Brand */}
          <div style={{ minWidth: '160px' }}>
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: '1.4rem',
                fontWeight: 400,
                color: '#f5f1eb',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'baseline',
                gap: '4px',
              }}
            >
              {TIENDA.nombre}
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: ACENTO,
                  display: 'inline-block',
                  marginBottom: '3px',
                }}
              />
            </div>
            <p
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: '.72rem',
                fontWeight: 300,
                color: 'rgba(245,241,235,0.45)',
                lineHeight: 1.8,
                maxWidth: '200px',
              }}
            >
              {tienda?.descripcion || TIENDA.descripcion}
            </p>
          </div>

          {/* Contacto */}
          <div>
            <p
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: '.58rem',
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color: 'rgba(245,241,235,0.3)',
                marginBottom: '.9rem',
              }}
            >
              Contacto
            </p>
            <a
              href={`https://wa.me/${TIENDA.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block',
                fontFamily: "'Jost',sans-serif",
                fontSize: '.72rem',
                color: 'rgba(245,241,235,0.55)',
                textDecoration: 'none',
                marginBottom: '6px',
              }}
            >
              📱 {TIENDA.whatsapp}
            </a>
            <a
              href={`https://instagram.com/${TIENDA.instagram}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block',
                fontFamily: "'Jost',sans-serif",
                fontSize: '.72rem',
                color: 'rgba(245,241,235,0.55)',
                textDecoration: 'none',
              }}
            >
              📷 @{TIENDA.instagram}
            </a>
          </div>

          {/* Ubicación */}
          <div>
            <p
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: '.58rem',
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color: 'rgba(245,241,235,0.3)',
                marginBottom: '.9rem',
              }}
            >
              Ubicación
            </p>
            <p
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: '.72rem',
                color: 'rgba(245,241,235,0.55)',
                lineHeight: 1.75,
              }}
            >
              {tienda?.ciudad || TIENDA.ciudad}
              <br />
              {tienda?.pais || TIENDA.pais}
            </p>
          </div>

          {/* Redes */}
          <div>
            <p
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: '.58rem',
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color: 'rgba(245,241,235,0.3)',
                marginBottom: '.9rem',
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
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    border: '0.5px solid rgba(245,241,235,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(245,241,235,0.4)',
                    textDecoration: 'none',
                    transition: 'all .2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = ACENTO;
                    e.currentTarget.style.color = ACENTO;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(245,241,235,0.12)';
                    e.currentTarget.style.color = 'rgba(245,241,235,0.4)';
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
            fontFamily: "'Jost',sans-serif",
            fontSize: '.62rem',
            color: 'rgba(245,241,235,0.2)',
            textAlign: 'center',
            padding: '.9rem 0',
          }}
        >
          © {new Date().getFullYear()}{' '}
          <span style={{ color: ACENTO, opacity: 0.75 }}>{TIENDA.nombre}</span> — Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}

// ── TOAST ────────────────────────────────────────────────────
function Toast({ msg, visible }: { msg: string; visible: boolean }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0' : '12px'})`,
        background: SURFACE,
        border: `0.5px solid ${ACENTO}`,
        borderRadius: '10px',
        padding: '10px 20px',
        fontFamily: "'Jost',sans-serif",
        fontSize: '.74rem',
        color: TXT,
        zIndex: 60,
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
        transition: 'all .3s ease',
        whiteSpace: 'nowrap',
        boxShadow: `0 4px 20px ${ACENTO}20`,
      }}
    >
      <span style={{ color: ACENTO, marginRight: '6px' }}>✓</span>
      {msg}
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────
export interface PlantillaAccesoriosProps {
  tienda?: any;
  tema?: any;
  accent?: string;
  themeConfig?: any;
}
interface IHeroProps {
  titulo?: string;
  descripcion?: string;
  imagenes?: string[];
}

export default function PlantillaAccesorios({
  tienda,
  accent,
  themeConfig,
}: PlantillaAccesoriosProps) {
  const mergedTienda = useMemo(
    () => ({
      ...TIENDA,
      nombre: tienda?.nombre || tienda?.titulo || TIENDA.nombre,
      descripcion: tienda?.descripcion || TIENDA.descripcion,
      whatsapp: tienda?.whatsapp || TIENDA.whatsapp,
      instagram: tienda?.instagram || TIENDA.instagram,
      facebook: tienda?.facebook || TIENDA.facebook,
      ciudad: tienda?.ciudad || TIENDA.ciudad,
      pais: tienda?.pais || TIENDA.pais,
    }),
    [tienda]
  );
  const tiendaId = tienda.id;
  const resolvedAccent = accent || themeConfig?.primary || '#b5835a';

  useEffect(() => {
    ACENTO = 'var(--acc-acento)';
    TIENDA = { ...mergedTienda };
  }, [resolvedAccent, mergedTienda]);

  const isDark = themeConfig?.modoOscuro;
  const cssVars = {
    '--acc-bg': isDark ? '#121212' : '#f5f1eb',
    '--acc-bg-alpha': isDark ? 'rgba(18,18,18,0.97)' : 'rgba(245,241,235,0.97)',
    '--acc-surface': isDark ? '#1e1e1e' : '#ffffff',
    '--acc-surface2': isDark ? '#262626' : '#ede9e2',
    '--acc-txt': isDark ? '#ede9e2' : '#2a1f14',
    '--acc-muted': isDark ? '#a89e94' : '#7a6e62',
    '--acc-subtle': isDark ? '#7a6e62' : '#a89e94',
    '--acc-border': isDark ? 'rgba(255,255,255,0.08)' : 'rgba(42,31,20,0.1)',
    '--acc-btn-txt': isDark ? '#2a1f14' : '#ffffff',
    '--acc-footer-bg': isDark ? '#000000' : '#2a1f14',
    '--acc-acento': resolvedAccent,
  } as React.CSSProperties;

  const { carrito, agregarAlCarrito, actualizarCantidad, eliminarItem } = useCarrito(tiendaId);

  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ msg: '', visible: false });
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [view, setView] = useState<'home' | 'auth' | 'account'>('home');

  const { cliente, logout } = useAuthSessionStore();

  const heroProps: IHeroProps = {
    titulo: mergedTienda.nombre,
    descripcion: mergedTienda.descripcion,
    imagenes: tienda?.carrusel?.length ? tienda.carrusel.map((img: any) => img.url) : HERO_IMGS,
  };

  const addToCart = async (p: any, qty: number = 1) => {
    try {
      await agregarAlCarrito({
        productoId: p.id,
        cantidad: qty,
        varianteId: null,
      });
      setToast({ msg: `${p.nombre} agregado`, visible: true });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2200);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  };

  const cartCount = carrito?.cantidad || 0;

  return (
    <div style={cssVars}>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        img { display: block; }
        .ac-scroll { overflow-y: auto; height: 100vh; scroll-behavior: smooth; }
        .ac-hide-mob { display: flex !important; }
        .ac-show-mob { display: none !important; }
        @media(max-width: 640px) {
          .ac-hide-mob { display: none !important; }
          .ac-show-mob { display: flex !important; }
        }
      `}</style>

      <div className="ac-scroll" style={{ background: BG }}>
        <Navbar
          cartCount={cartCount}
          onCart={() => setCartOpen(true)}
          onIngresar={() => setView('auth')}
          onMiCuenta={() => setView('account')}
        />

        {view === 'home' &&
          (selectedProduct ? (
            <ProductDetailView
              product={selectedProduct}
              onBack={() => setSelectedProduct(null)}
              onCart={addToCart}
              tienda={mergedTienda}
            />
          ) : (
            <>
              <Hero {...heroProps} />
              <Marquee />
              <Productos
                onSelect={setSelectedProduct}
                onCart={(p) => addToCart(p, 1)}
                tiendaId={tiendaId}
              />
              <SobreNosotros tienda={mergedTienda} />
              <TrustBadges />
              <Footer tienda={mergedTienda} />
            </>
          ))}

        {view === 'auth' && <AuthView onClose={() => setView('home')} tienda={mergedTienda} />}

        {view === 'account' && (
          <div
            style={{
              padding: '6rem 2rem',
              minHeight: '80vh',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div style={{ maxWidth: '500px', width: '100%' }}>
              <button
                onClick={() => setView('home')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: ACENTO,
                  cursor: 'pointer',
                  marginBottom: '2rem',
                  fontFamily: "'Jost', sans-serif",
                }}
              >
                ← Volver al inicio
              </button>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '2.4rem',
                  color: TXT,
                  marginBottom: '2rem',
                  fontWeight: 300,
                }}
              >
                Mi Cuenta
              </h2>
              <div
                style={{
                  background: SURFACE2,
                  padding: '2rem',
                  borderRadius: '12px',
                  border: `1px solid ${BORDER}`,
                  fontFamily: "'Jost', sans-serif",
                }}
              >
                <p style={{ color: TXT, marginBottom: '1rem' }}>
                  <strong>Email:</strong> {cliente?.email}
                </p>
                <p style={{ color: TXT, marginBottom: '1rem' }}>
                  <strong>Nombre:</strong> {cliente?.nombre} {cliente?.apellido}
                </p>
                <p style={{ color: TXT, marginBottom: '2rem' }}>
                  <strong>Teléfono:</strong> {cliente?.telefono}
                </p>
                <button
                  onClick={() => {
                    logout();
                    setView('home');
                  }}
                  style={{
                    padding: '10px 20px',
                    background: ACENTO,
                    color: BTN_TXT,
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {cartOpen && (
        <CartDrawer
          items={carrito?.items || []}
          onClose={() => setCartOpen(false)}
          onQty={(id, q) => actualizarCantidad({ itemId: id, cantidad: q })}
          onRemove={(id) => eliminarItem(id)}
        />
      )}

      <Toast msg={toast.msg} visible={toast.visible} />
    </div>
  );
}
