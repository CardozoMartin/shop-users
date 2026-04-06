export default function SobreNosotros({ tienda }: { tienda: any }) {
  const descripcion = tienda?.aboutUs?.descripcion || tienda?.descripcion;
  if (!descripcion) return null;
  const titulo = tienda?.aboutUs?.titulo || 'SOBRE LA MARCA';
  const direccion = tienda?.aboutUs?.direccion;

  return (
    <section
      className="py-24 px-8"
      style={{ background: 'var(--rop-bg)', borderTop: '1px solid var(--rop-border)' }}
    >
      <div className="max-w-[800px] mx-auto text-center">
        <h2
          className="text-[clamp(2.5rem,5vw,4rem)] tracking-[.04em] mb-6 leading-none"
          style={{ fontFamily: "'Bebas Neue',sans-serif", color: 'var(--rop-dark)' }}
        >
          {titulo}
        </h2>
        <p
          className="text-[clamp(1rem,2vw,1.15rem)] font-normal leading-[1.8] max-w-[600px] mx-auto mb-10"
          style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-subtle)' }}
        >
          {descripcion}
        </p>

        {tienda?.aboutUs?.imagenUrl && (
          <img
            src={tienda.aboutUs.imagenUrl}
            alt="Nosotros"
            className="w-full max-w-[400px] mx-auto mb-10 rounded-lg object-cover"
          />
        )}

        <div className="flex flex-wrap justify-center gap-8">
          {(direccion || tienda?.ciudad) && (
            <div className="flex items-center gap-2">
              <span className="text-xl">📍</span>
              <span
                className="text-[.85rem] font-medium tracking-[.05em] uppercase"
                style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-dark)' }}
              >
                {direccion || `${tienda?.ciudad || ''}${tienda?.provincia ? `, ${tienda.provincia}` : ''}`}
              </span>
            </div>
          )}
          {tienda?.instagram && (
            <a
              href={`https://instagram.com/${tienda.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="no-underline flex items-center gap-2"
            >
              <span className="text-xl">📷</span>
              <span
                className="text-[.85rem] font-medium tracking-[.05em] uppercase"
                style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-dark)' }}
              >
                @{tienda.instagram}
              </span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
