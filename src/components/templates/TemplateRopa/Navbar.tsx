import { useEffect, useState } from 'react';
import { useAuthSessionStore } from '../../../store/useAuthSession';

export default function Navbar({
  cartCount,
  onCart,
  onIngresar,
  onMiCuenta,
  tienda,
  onNavigate,
}: {
  cartCount: number;
  onCart: () => void;
  onIngresar: () => void;
  onMiCuenta: () => void;
  tienda: any;
  onNavigate?: (path: string) => void;
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
      className="sticky top-0 z-50 h-[68px] flex items-center justify-between px-8 transition-all duration-300"
      style={{
        background: scrolled ? 'var(--rop-bg-alpha)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--rop-border)' : 'none',
      }}
    >
      {/* Brand */}
      <div
        className="flex flex-col leading-none cursor-pointer"
        onClick={() => onNavigate?.('')}
      >
        <span
          className="text-[1.8rem] tracking-[.08em] leading-[0.9]"
          style={{ fontFamily: "'Bebas Neue',sans-serif", color: 'var(--rop-dark)' }}
        >
          {tienda.nombre}
        </span>
        <span
          className="text-[.52rem] tracking-[.18em] uppercase mt-px"
          style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-muted)' }}
        >
          {tienda.tagline}
        </span>
      </div>

      {/* Desktop links */}
      <div className="vt-hide-mob flex items-center gap-8">
        {[
          { l: 'Colección', t: 'productos' },
          { l: 'Lookbook', t: 'lookbook' },
          { l: 'Nosotros', t: 'nosotros' },
          { l: 'Contacto', t: 'contacto' },
        ].map(({ l, t }) => (
          <a
            key={l}
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate?.(t); }}
            className="text-[.78rem] font-medium tracking-[.04em] no-underline transition-colors duration-200"
            style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-nav-link)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--rop-acento)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--rop-nav-link)')}
          >
            {l}
          </a>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-5">
        {/* Search icon */}
        <button
          className="vt-hide-mob bg-transparent border-none cursor-pointer p-1"
          onClick={() => onNavigate?.('productos')}
          style={{ color: 'var(--rop-muted)' }}
        >
          <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
            <path d="M10.836 10.615 15 14.695" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path clipRule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </button>

        {/* Cart */}
        <button onClick={onCart} className="relative bg-transparent border-none cursor-pointer p-1">
          <svg width="19" height="19" viewBox="0 0 14 14" fill="none">
            <path
              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
              stroke="var(--rop-acento)"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {cartCount > 0 && (
            <span
              className="absolute -top-[3px] -right-[5px] text-[.5rem] font-bold w-[15px] h-[15px] rounded-full flex items-center justify-center"
              style={{ background: 'var(--rop-acento)', color: 'var(--rop-btn-txt)' }}
            >
              {cartCount}
            </span>
          )}
        </button>

        {/* Auth button (desktop) */}
        <button
          onClick={cliente ? onMiCuenta : onIngresar}
          className="vt-hide-mob py-2 px-5 border-none rounded cursor-pointer text-[.72rem] font-semibold tracking-[.06em] transition-colors duration-200"
          style={{
            background: 'var(--rop-dark)',
            color: 'var(--rop-btn-txt)',
            fontFamily: "'Outfit',sans-serif",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--rop-acento)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--rop-dark)')}
        >
          {cliente ? 'Mi cuenta' : 'Ingresar'}
        </button>

        {/* Hamburger (mobile) */}
        <button
          className="vt-show-mob bg-transparent border-none cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
            <rect width="22" height="1.5" rx=".75" fill="var(--rop-dark)" />
            <rect x="5" y="6.25" width="17" height="1.5" rx=".75" fill="var(--rop-dark)" />
            <rect x="2" y="12.5" width="20" height="1.5" rx=".75" fill="var(--rop-dark)" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="absolute top-[68px] left-0 right-0 z-50 flex flex-col gap-4 px-8 py-6 shadow-[0_8px_24px_rgba(0,0,0,.06)]"
          style={{
            background: 'var(--rop-surface)',
            borderBottom: '1px solid var(--rop-border)',
          }}
        >
          {[
            { l: 'Colección', t: 'productos' },
            { l: 'Lookbook', t: 'lookbook' },
            { l: 'Nosotros', t: 'nosotros' },
            { l: 'Contacto', t: 'contacto' },
          ].map(({ l, t }) => (
            <a
              key={l}
              href="#"
              onClick={(e) => { e.preventDefault(); setOpen(false); onNavigate?.(t); }}
              className="text-[.9rem] font-medium no-underline"
              style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-muted)' }}
            >
              {l}
            </a>
          ))}
          <button
            onClick={() => { setOpen(false); cliente ? onMiCuenta() : onIngresar(); }}
            className="self-start mt-2 py-2.5 px-6 border-none rounded cursor-pointer text-[.78rem] font-semibold"
            style={{
              background: 'var(--rop-dark)',
              color: 'var(--rop-btn-txt)',
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            {cliente ? 'Mi cuenta' : 'Ingresar'}
          </button>
        </div>
      )}
    </nav>
  );
}
