import { useEffect, useState } from 'react';
import { useAuthSessionStore } from '../../../store/useAuthSession';
import type { NavbarProps } from './Types';

export const Navbar = ({
  cartCount,
  onCart,
  logo,
  titulo,
  onIngresar,
  onMiCuenta,
  onNavigate,
}: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cliente = useAuthSessionStore((s) => s.cliente);

  useEffect(() => {
    const el = document.querySelector('.cz-scroll');
    const fn = () => setScrolled((el?.scrollTop ?? 0) > 50);
    el?.addEventListener('scroll', fn, { passive: true });
    return () => el?.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 h-16 flex items-center justify-between px-8 transition-all duration-300"
      style={{
        // ← dinámico: cambia con scroll y tema, no se puede con Tailwind puro
        background: scrolled ? 'var(--gor-bg-alpha)' : 'var(--gor-bg)',
        borderBottom: scrolled ? '1px solid var(--gor-border)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2">
        <span
          className="text-2xl font-bold font-['Playfair_Display',serif]"
          style={{ color: 'var(--gor-txt)' }}
        >
          {logo ? (
            <img src={logo} alt={titulo || 'Logo'} className="h-8 object-contain" />
          ) : (
            titulo || 'CapZone'
          )}
        </span>

        {/* Badge NEW */}
        <span
          className="text-[.52rem] font-bold px-2 py-0.5 rounded-full tracking-widest uppercase"
          style={{ background: 'var(--gor-acento)', color: 'var(--gor-btn-txt)' }}
        >
          NEW
        </span>
      </div>

      {/* Desktop links */}
      <div className="cz-hide-mob flex items-center gap-8">
        {/* Links */}
        {(
          [
            { label: 'Inicio', target: 'inicio' },
            { label: 'Producto', target: 'producto' },
            { label: 'Contacto', target: 'contacto' },
            { label: 'Sobre Nosotros', target: 'sobrenosotros' },
          ] as Array<{ label: string; target: import('./Types').NavbarTarget }>
        ).map((item) => (
          <a
            key={item.target}
            href="#"
            className="text-[.78rem] font-medium tracking-wide no-underline transition-colors duration-200"
            style={{ color: 'var(--gor-muted)', fontFamily: "'DM Sans',sans-serif" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gor-acento)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gor-muted)')}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(item.target);
            }}
          >
            {item.label}
          </a>
        ))}

        {/* Search */}
        <div
          className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5"
          style={{
            border: '1px solid var(--gor-border)',
            background: 'var(--gor-surface)',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path
              d="M10.836 10.615 15 14.695"
              stroke="var(--gor-muted)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              clipRule="evenodd"
              d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
              stroke="var(--gor-muted)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <input
            placeholder="Buscar gorras..."
            className="bg-transparent border-none outline-none text-[.72rem] w-28"
            style={{ color: 'var(--gor-txt)', fontFamily: "'DM Sans',sans-serif" }}
          />
        </div>

        {/* Cart */}
        <button onClick={onCart} className="relative bg-transparent border-none cursor-pointer p-1">
          <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
            <path
              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
              stroke="var(--gor-acento)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="0.9"
            />
          </svg>

          {cartCount > 0 && (
            <span
              className="absolute -top-1 -right-1.5 text-[.52rem] font-bold w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: 'var(--gor-acento)', color: 'var(--gor-btn-txt)' }}
            >
              {cartCount}
            </span>
          )}
        </button>

        {/* Ingresar / Mi cuenta */}
        <button
          className="px-5 py-2 rounded-full text-[.72rem] font-semibold cursor-pointer border-none transition-opacity duration-200 hover:opacity-85"
          style={{
            background: 'var(--gor-acento)',
            color: 'var(--gor-btn-txt)',
            fontFamily: "'DM Sans',sans-serif",
          }}
          onClick={cliente ? onMiCuenta : onIngresar}
        >
          {cliente ? 'Mi cuenta' : 'Ingresar'}
        </button>
      </div>

      {/* Hamburger */}
      <button
        className="cz-show-mob bg-transparent border-none cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <svg width="22" height="15" viewBox="0 0 22 15" fill="none">
          <rect width="22" height="1.5" rx=".75" fill="var(--gor-txt)" />
          <rect x="6" y="6.5" width="16" height="1.5" rx=".75" fill="var(--gor-txt)" />
          <rect x="3" y="13" width="19" height="1.5" rx=".75" fill="var(--gor-txt)" />
        </svg>
      </button>

      {/* Mobile menu */}
      {open && (
        <div
          className="absolute top-16 left-0 right-0 z-50 flex flex-col gap-4 px-8 py-6"
          style={{
            background: 'var(--gor-bg)',
            borderBottom: '1px solid var(--gor-border)',
            boxShadow: '0 8px 24px rgba(0,0,0,.06)',
          }}
        >
          {(
            [
              { label: 'Inicio', target: 'inicio' },
              { label: 'Producto', target: 'producto' },
              { label: 'Contacto', target: 'contacto' },
              { label: 'Sobre Nosotros', target: 'sobrenosotros' },
            ] as Array<{ label: string; target: import('./Types').NavbarTarget }>
          ).map((item) => (
            <a
              key={item.target}
              href="#"
              className="text-[.85rem] font-medium no-underline"
              style={{ color: 'var(--gor-muted)', fontFamily: "'DM Sans',sans-serif" }}
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                onNavigate(item.target);
              }}
            >
              {item.label}
            </a>
          ))}

          <button
            onClick={cliente ? onMiCuenta : onIngresar}
            className="self-start mt-2 px-6 py-2.5 rounded-full text-[.75rem] font-semibold cursor-pointer border-none"
            style={{
              background: 'var(--gor-acento)',
              color: 'var(--gor-btn-txt)',
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            {cliente ? 'Mi cuenta' : 'Ingresar'}
          </button>
        </div>
      )}
    </nav>
  );
};
