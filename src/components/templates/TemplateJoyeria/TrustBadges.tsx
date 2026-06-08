export default function TrustBadges() {
  return (
    <section style={{ background: 'var(--acc-surface)' }}>
      <div
        style={{
          maxWidth: '1060px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
          borderTop: `0.5px solid var(--acc-border)`,
          borderBottom: `0.5px solid var(--acc-border)`,
        }}
      >
        {[
          { icon: '✦', title: '100% artesanal', sub: 'Cada pieza, única' },
          { icon: '🚚', title: 'Envío a domicilio', sub: 'A todo el país' },
          { icon: '↩', title: 'Devolución fácil', sub: '15 días garantizados' },
          { icon: '💛', title: 'Hecho con amor', sub: 'Calidad superior' },
        ].map(({ icon, title, sub }) => (
          <div
            key={title}
            style={{
              padding: '1.4rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '.85rem',
              borderRight: `0.5px solid var(--acc-border)`,
            }}
          >
            <span style={{ fontSize: '18px', color: 'var(--acc-acento)', flexShrink: 0 }}>{icon}</span>
            <div>
              <p
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: '.75rem',
                  fontWeight: 500,
                  color: 'var(--acc-txt)',
                  marginBottom: '2px',
                }}
              >
                {title}
              </p>
              <p style={{ fontFamily: "'Jost',sans-serif", fontSize: '.65rem', color: 'var(--acc-muted)' }}>
                {sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
