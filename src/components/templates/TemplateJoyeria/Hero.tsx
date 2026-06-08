import { useEffect, useState } from 'react';

export interface IHeroProps {
  titulo?: string;
  descripcion?: string;
  imagenes?: string[];
  ciudad?: string;
  whatsapp?: string;
  onNavigate?: (target: string) => void;
}

const HERO_IMGS = [
  'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=900&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573408301185-9519f94815b0?w=900&h=900&fit=crop&q=80',
];

export default function Hero({ titulo, descripcion, imagenes, ciudad, whatsapp, onNavigate }: IHeroProps) {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const el = document.querySelector('.ac-scroll');
    const fn = () => setScrollY(el?.scrollTop ?? 0);
    el?.addEventListener('scroll', fn, { passive: true });
    return () => el?.removeEventListener('scroll', fn);
  }, []);

  return (
    <section
      style={{
        background: 'var(--acc-bg)',
        overflow: 'hidden',
        padding: '4rem 2rem 5rem',
        position: 'relative',
      }}
    >
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
              <circle key={`${r}-${c}`} cx={8 + c * 20} cy={8 + r * 20} r="2.8" fill="var(--acc-acento)" />
            ))
          )}
        </svg>
      </div>
      <div
        style={{
          position: 'absolute',
          right: '-5%',
          top: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `var(--acc-acento)08`,
          opacity: 0.08,
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
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span
            style={{
              display: 'inline-block',
              fontFamily: "'Jost',sans-serif",
              fontSize: '.6rem',
              letterSpacing: '.26em',
              textTransform: 'uppercase',
              color: 'var(--acc-acento)',
              fontWeight: 500,
              marginBottom: '1.2rem',
              paddingBottom: '.5rem',
              borderBottom: `1px solid var(--acc-acento)40`,
            }}
          >
            {ciudad || 'Tucumán'} · Artesanal
          </span>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 'clamp(2.8rem,5.5vw,4.5rem)',
              fontWeight: 300,
              color: 'var(--acc-txt)',
              lineHeight: 1.02,
              marginBottom: '1.1rem',
            }}
          >
            {titulo || 'Tienda'}
            <br />
          </h1>

          <p
            style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: '.84rem',
              fontWeight: 300,
              color: 'var(--acc-muted)',
              lineHeight: 1.85,
              maxWidth: '360px',
              marginBottom: '1.75rem',
            }}
          >
            {descripcion || 'Joyería y accesorios artesanales. Cada pieza cuenta una historia.'}
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
               onClick={() => onNavigate?.('catalog')}
              style={{
                padding: '12px 30px',
                background: 'var(--acc-acento)',
                color: 'var(--acc-btn-txt)',
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
              href={`https://wa.me/${whatsapp || ''}`}
              target="_blank"
              rel="noreferrer"
              style={{
                padding: '12px 22px',
                background: 'transparent',
                border: `0.5px solid var(--acc-border)`,
                borderRadius: '6px',
                color: 'var(--acc-acento)',
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
                e.currentTarget.style.background = 'var(--acc-acento)';
                e.currentTarget.style.color = 'var(--acc-btn-txt)';
                e.currentTarget.style.borderColor = 'var(--acc-acento)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--acc-acento)';
                e.currentTarget.style.borderColor = 'var(--acc-border)';
              }}
            >
              WhatsApp
            </a>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '2rem',
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: `0.5px solid var(--acc-border)`,
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
                    color: 'var(--acc-acento)',
                    lineHeight: 1,
                  }}
                >
                  {n}
                </div>
                <div
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: '.62rem',
                    color: 'var(--acc-muted)',
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
                boxShadow: `0 12px 40px rgba(0,0,0,0.1)`,
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
          <div
             onClick={() => onNavigate?.('catalog')}
            style={{
              position: 'absolute',
              bottom: '4%',
              left: '2%',
              zIndex: 4,
              background: 'var(--acc-surface)',
              borderRadius: '12px',
              padding: '10px 16px',
              boxShadow: `0 4px 20px rgba(0,0,0,0.1)`,
              cursor: 'pointer'
            }}
          >
            <div
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: '.58rem',
                color: 'var(--acc-muted)',
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
                color: 'var(--acc-txt)',
              }}
            >
              Ver Coleccion
            </div>
            <div
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: '.75rem',
                color: 'var(--acc-acento)',
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
