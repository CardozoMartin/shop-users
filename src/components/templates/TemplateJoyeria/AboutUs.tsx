export default function SobreNosotros({ tienda }: { tienda: any }) {
  const titulo = tienda?.aboutUs?.titulo || (
    <>
      Cada pieza nace de
      <br />
      <em style={{ color: 'var(--acc-acento)' }}>manos tucumanas.</em>
    </>
  );
  const descripcion =
    tienda?.aboutUs?.descripcion ||
    tienda?.descripcion ||
    'Somos un emprendimiento familiar del norte argentino. Diseñamos y fabricamos cada accesorio a mano, con materiales naturales y mucho amor.';
  
  const instagram = tienda?.instagram;
  const direccion = tienda?.aboutUs?.direccion;
  const ubicacion = direccion || `${tienda?.ciudad || 'Tucumán'}${tienda?.pais ? `, ${tienda.pais}` : ''}`;

  return (
    <section
      style={{ background: 'var(--acc-surface)', padding: '4rem 2rem', borderTop: `0.5px solid var(--acc-border)` }}
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
          <div style={{ width: '2rem', height: '1px', background: 'var(--acc-acento)' }} opacity={0.4} />
          <span
            style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: '.58rem',
              letterSpacing: '.24em',
              textTransform: 'uppercase',
              color: 'var(--acc-acento)',
            }}
          >
            Nuestra historia
          </span>
          <div style={{ width: '2rem', height: '1px', background: 'var(--acc-acento)' }} opacity={0.4} />
        </div>
        <h3
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 'clamp(1.8rem,3vw,2.8rem)',
            fontWeight: 300,
            color: 'var(--acc-txt)',
            marginBottom: '1rem',
            lineHeight: 1.1,
          }}
        >
          {titulo}
        </h3>
        <p
          style={{
            fontFamily: "'Jost',sans-serif",
            fontSize: '.82rem',
            fontWeight: 300,
            color: 'var(--acc-muted)',
            lineHeight: 1.9,
            maxWidth: '520px',
            margin: '0 auto 2rem',
          }}
        >
          {descripcion}
        </p>
        
        {tienda?.aboutUs?.imagenUrl && (
          <img src={tienda.aboutUs.imagenUrl} alt="Nosotros" style={{ width: '100%', maxWidth: '400px', margin: '0 auto 2rem', borderRadius: '8px', objectFit: 'cover' }} />
        )}

        {ubicacion && (
          <p
            style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: '.82rem',
              fontWeight: 300,
              color: 'var(--acc-muted)',
              lineHeight: 1.9,
              maxWidth: '520px',
              margin: '0 auto 1rem',
            }}
          >
            {ubicacion}
          </p>
        )}
        
        {instagram && (
          <a
            href={`https://instagram.com/${instagram}`}
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: '.7rem',
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              color: 'var(--acc-acento)',
              textDecoration: 'none',
              borderBottom: `0.5px solid var(--acc-acento)`,
              paddingBottom: '2px',
              opacity: 0.8
            }}
          >
            Seguinos en Instagram →
          </a>
        )}
      </div>
    </section>
  );
}
