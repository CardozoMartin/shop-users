export default function Footer({ tienda }: { tienda: any }) {
  const socials = [
    {
      label: 'IG',
      href: `https://instagram.com/${tienda?.instagram}`,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: 'WA',
      href: `https://wa.me/${tienda?.whatsapp}`,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="px-8" style={{ background: 'var(--rop-footer-bg)', borderTop: '1px solid var(--rop-border)' }}>
      <div className="max-w-[1060px] mx-auto">
        {/* Main grid */}
        <div className="flex flex-wrap gap-10 justify-between py-12" style={{ borderBottom: '0.5px solid rgba(247,245,242,0.1)' }}>
          {/* Brand column */}
          <div className="min-w-[180px]">
            <div
              className="text-[2rem] tracking-[.08em] mb-1"
              style={{ fontFamily: "'Bebas Neue',sans-serif", color: 'var(--rop-bg)' }}
            >
              {tienda?.nombre || 'Tienda'}
            </div>
            <div
              className="text-[.62rem] tracking-[.16em] uppercase mb-3"
              style={{ fontFamily: "'Outfit',sans-serif", color: 'rgba(247,245,242,.3)' }}
            >
              {tienda?.tagline || ''}
            </div>
            <p
              className="text-[.8rem] font-light max-w-[280px] leading-[1.7]"
              style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-muted)' }}
            >
              {tienda?.descripcion}
            </p>
          </div>

          {/* Contact column */}
          <div>
            <p
              className="text-[.58rem] tracking-[.2em] uppercase mb-3.5 font-semibold"
              style={{ fontFamily: "'Outfit',sans-serif", color: 'rgba(247,245,242,.25)' }}
            >
              Contacto
            </p>
            <a
              href={`https://wa.me/${tienda?.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="block no-underline text-[.72rem] mb-1.5"
              style={{ fontFamily: "'Outfit',sans-serif", color: 'rgba(247,245,242,.5)' }}
            >
              📱 {tienda?.whatsapp}
            </a>
            <a
              href={`https://instagram.com/${tienda?.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="block no-underline text-[.72rem]"
              style={{ fontFamily: "'Outfit',sans-serif", color: 'rgba(247,245,242,.5)' }}
            >
              📷 @{tienda?.instagram}
            </a>
          </div>

          {/* Location column */}
          <div>
            <p
              className="text-[.58rem] tracking-[.2em] uppercase mb-3.5 font-semibold"
              style={{ fontFamily: "'Outfit',sans-serif", color: 'rgba(247,245,242,.25)' }}
            >
              Ubicación
            </p>
            <p
              className="text-[.72rem] leading-[1.75]"
              style={{ fontFamily: "'Outfit',sans-serif", color: 'rgba(247,245,242,.5)' }}
            >
              {tienda?.ciudad || 'Tucumán'}
              <br />
              {tienda?.pais || 'Argentina'}
            </p>
          </div>

          {/* Social column */}
          <div>
            <p
              className="text-[.58rem] tracking-[.2em] uppercase mb-3.5 font-semibold"
              style={{ fontFamily: "'Outfit',sans-serif", color: 'rgba(247,245,242,.25)' }}
            >
              Seguinos
            </p>
            <div className="flex gap-1.5">
              {socials.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded flex items-center justify-center no-underline transition-all duration-200"
                  style={{
                    border: '0.5px solid rgba(247,245,242,.12)',
                    color: 'rgba(247,245,242,.35)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--rop-acento)';
                    e.currentTarget.style.color = 'var(--rop-acento)';
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

        {/* Copyright */}
        <p
          className="text-[.62rem] text-center py-3.5"
          style={{ fontFamily: "'Outfit',sans-serif", color: 'rgba(247,245,242,.18)' }}
        >
          © {new Date().getFullYear()}{' '}
          <span style={{ color: 'var(--rop-acento)', opacity: 0.8 }}>{tienda?.nombre}</span> — Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
