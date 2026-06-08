export default function Contact({ tienda }: { tienda: any }) {
  // A dedicated Contact component if needed, else we can reuse the Footer's contact parts.
  return (
    <section style={{ background: 'var(--acc-bg)', padding: '4rem 2rem' }}>
       <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.5rem', color: 'var(--acc-txt)', fontWeight: 300, marginBottom: '1.5rem' }}>
             Trabajemos <em style={{ color: 'var(--acc-acento)' }}>Juntos</em>
          </h2>
          <p style={{ fontFamily: "'Jost',sans-serif", fontSize: '.85rem', color: 'var(--acc-muted)', marginBottom: '2rem' }}>
             ¿Tenés alguna consulta o necesitas una pieza a medida? Escribinos y lo hacemos realidad.
          </p>
          <a
            href={`https://wa.me/${tienda.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-block',
              padding: '12px 30px',
              background: 'var(--acc-acento)',
              color: 'var(--acc-btn-txt)',
              border: 'none',
              borderRadius: '6px',
              fontFamily: "'Jost',sans-serif",
              fontSize: '.7rem',
              fontWeight: 600,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Escribir por WhatsApp
          </a>
       </div>
    </section>
  );
}
