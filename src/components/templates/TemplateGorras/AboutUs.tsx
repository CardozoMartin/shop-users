import type { AboutUsProps } from "./Types";


const AboutUs = ({
  titulo,
  descripcion,
  imagenUrl,
  direccion,
  ciudad,
  provincia,
  instagram,
  acento = 'var(--gor-acento)',
  bg = 'var(--gor-bg)',
  border = 'var(--gor-border)',
  txt = 'var(--gor-txt)',
  muted = 'var(--gor-muted)',
}: AboutUsProps) => {
  if (!descripcion && !titulo && !imagenUrl) return null;

  return (
    <section className="px-6 py-24" style={{ background: bg, borderTop: `1px solid ${border}` }}>
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Imagen Izquierda (o derecha si querés variar) */}
        {imagenUrl && (
          <div className="relative group overflow-hidden rounded-3xl aspect-[1/1] shadow-2xl">
            <img 
              src={imagenUrl} 
              alt={titulo || "Sobre Nosotros"} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        <div className={!imagenUrl ? 'md:col-span-2 max-w-[800px] mx-auto' : ''}>
          <h2
            className="font-extrabold tracking-[-0.03em] mb-4"
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              color: txt,
            }}
          >
            {titulo || "Quiénes Somos."}
          </h2>

          <div className="w-[80px] h-1.5 mb-8" style={{ background: acento }} />

          <p
            className="leading-[1.8] mb-12 whitespace-pre-wrap"
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 'clamp(1rem, 2vw, 1.1rem)',
              color: muted,
            }}
          >
            {descripcion || "Gracias por visitarnos. Somos un emprendimiento dedicado a brindarte lo mejor en calidad y estilo."}
          </p>

          <div className="flex flex-wrap gap-8">
            {(direccion || ciudad) && (
              <div className="flex flex-col gap-2">
                <span
                  className="text-[.7rem] font-black uppercase tracking-[.2em] opacity-60"
                  style={{ color: acento, fontFamily: "'DM Sans',sans-serif" }}
                >
                  Ubicación
                </span>
                <span
                  className="text-base font-medium"
                  style={{ color: txt, fontFamily: "'DM Sans',sans-serif" }}
                >
                  {direccion ? direccion : `${ciudad}${provincia ? `, ${provincia}` : ''}`}
                </span>
              </div>
            )}

            {instagram && (
              <div className="flex flex-col gap-2">
                <span
                  className="text-[.7rem] font-black uppercase tracking-[.2em] opacity-60"
                  style={{ color: acento, fontFamily: "'DM Sans',sans-serif" }}
                >
                  Seguinos
                </span>
                <a
                  href={`https://instagram.com/${instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-base font-bold no-underline hover:opacity-70 transition-opacity border-b-2"
                  style={{ color: txt, borderBottomColor: acento, fontFamily: "'DM Sans',sans-serif" }}
                >
                  @{instagram}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
