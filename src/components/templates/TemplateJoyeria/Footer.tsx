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
    {
      label: 'FB',
      href: `https://facebook.com/${tienda?.facebook}`,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
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
              {tienda?.nombre || 'Tienda'}
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
              {tienda?.descripcion}
            </p>
          </div>

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
              href={`https://wa.me/${tienda?.whatsapp}`}
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
              📱 {tienda?.whatsapp}
            </a>
            <a
              href={`https://instagram.com/${tienda?.instagram}`}
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
              📷 @{tienda?.instagram}
            </a>
          </div>

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
              {tienda?.ciudad || 'Tucumán'}
              <br />
              {tienda?.pais || 'Argentina'}
            </p>
          </div>

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
                    e.currentTarget.style.borderColor = 'var(--acc-acento)';
                    e.currentTarget.style.color = 'var(--acc-acento)';
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
          <span style={{ color: 'var(--acc-acento)', opacity: 0.75 }}>{tienda?.nombre}</span> — Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
