import { useEffect, useState } from 'react';
import { useAuthSessionStore } from '../../../store/useAuthSession';

interface NavbarProps {
  cartCount: number;
  onCart: () => void;
  onIngresar: () => void;
  onMiCuenta: () => void;
  logo?: string;
  titulo: string;
  theme: any;
  onNavigate?: (path: string) => void;
}

export default function Navbar({ cartCount, onCart, onIngresar, onMiCuenta, logo, titulo, theme, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
        borderBottom: scrolled ? `0.5px solid var(--acc-border)` : 'none',
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all .35s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', cursor: 'pointer' }} onClick={() => onNavigate?.('')}>
        {logo ? (
          <img src={logo} alt={titulo} style={{ height: '32px', objectFit: 'contain' }} />
        ) : (
          <span
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: '1.4rem',
              fontWeight: 400,
              color: 'var(--acc-txt)',
              letterSpacing: '.04em',
            }}
          >
            {titulo}
          </span>
        )}
        {!logo && (
          <span
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: 'var(--acc-acento)',
              display: 'inline-block',
              marginBottom: '3px',
            }}
          />
        )}
      </div>

      <div className="ac-hide-mob" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {[
          { l: 'Inicio', t: 'inicio' },
          { l: 'Colección', t: 'catalog' },
          { l: 'Nosotros', t: 'about' },
          { l: 'Contacto', t: 'contacto' },
        ].map(({ l, t }) => (
          <a
            key={l}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.(t);
            }}
            style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: '.75rem',
              color: `var(--acc-subtle)`,
              textDecoration: 'none',
              letterSpacing: '.08em',
              transition: 'color .2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--acc-acento)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = `var(--acc-subtle)`)}
          >
            {l}
          </a>
        ))}

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
              stroke="var(--acc-acento)"
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
                background: 'var(--acc-acento)',
                color: 'var(--acc-btn-txt)',
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

        <button
          onClick={cliente ? onMiCuenta : onIngresar}
          style={{
            padding: '8px 20px',
            background: 'transparent',
            border: `0.5px solid var(--acc-acento)`,
            borderRadius: '20px',
            color: 'var(--acc-acento)',
            fontFamily: "'Jost',sans-serif",
            fontSize: '.68rem',
            fontWeight: 500,
            letterSpacing: '.1em',
            cursor: 'pointer',
            transition: 'all .2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--acc-acento)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--acc-btn-txt)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--acc-acento)';
          }}
        >
          {cliente ? 'Mi cuenta' : 'Ingresar'}
        </button>
      </div>

      <button
        className="ac-show-mob"
        onClick={() => setOpen(!open)}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
          <rect width="20" height="1.5" rx=".75" fill="var(--acc-txt)" />
          <rect x="5" y="6" width="15" height="1.5" rx=".75" fill="var(--acc-txt)" />
          <rect x="2" y="12" width="18" height="1.5" rx=".75" fill="var(--acc-txt)" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '64px',
            left: 0,
            right: 0,
            background: 'var(--acc-surface)',
            borderBottom: `0.5px solid var(--acc-border)`,
            padding: '1.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 50,
            boxShadow: '0 8px 24px rgba(42,31,20,.06)',
          }}
        >
          {[
            { l: 'Inicio', t: 'inicio' },
            { l: 'Colección', t: 'catalog' },
            { l: 'Nosotros', t: 'about' },
            { l: 'Contacto', t: 'contacto' },
          ].map(({ l, t }) => (
            <a
              key={l}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                onNavigate?.(t);
              }}
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: '.85rem',
                color: 'var(--acc-muted)',
                textDecoration: 'none',
              }}
            >
              {l}
            </a>
          ))}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '0.5px solid var(--acc-border)', paddingTop: '1rem' }}>
            <button
               onClick={() => {
                 setOpen(false);
                 onCart();
               }}
               style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--acc-border)', borderRadius: '8px', color: 'var(--acc-txt)', fontFamily: "'Jost', sans-serif" }}
            >
              Carrito ({cartCount})
            </button>
            <button
               onClick={() => {
                 setOpen(false);
                 cliente ? onMiCuenta() : onIngresar();
               }}
               style={{ flex: 1, padding: '10px', background: 'var(--acc-acento)', border: 'none', borderRadius: '8px', color: 'var(--acc-btn-txt)', fontFamily: "'Jost', sans-serif" }}
            >
              {cliente ? 'Cuenta' : 'Login'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
