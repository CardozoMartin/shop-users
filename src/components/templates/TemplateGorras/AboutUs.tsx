import type { AboutUsProps } from "./Types";


const AboutUs = ({
  descripcion,
  ciudad,
  provincia,
  instagram,
  acento = 'var(--gor-acento)',
  bg = 'var(--gor-bg)',
  border = 'var(--gor-border)',
  txt = 'var(--gor-txt)',
  muted = 'var(--gor-muted)',
}: AboutUsProps) => {
  if (!descripcion) return null;

  return (
    <section className="px-6 py-24" style={{ background: bg, borderTop: `1px solid ${border}` }}>
      <div className="max-w-[900px] mx-auto">
        <h2
          className="font-extrabold tracking-[-0.03em] mb-4"
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: txt,
          }}
        >
          Quiénes Somos.
        </h2>

        <div className="w-[60px] h-1 mb-8" style={{ background: acento }} />

        <p
          className="leading-[1.7] mb-12 max-w-[700px]"
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: muted,
          }}
        >
          {descripcion}
        </p>

        <div className="flex flex-wrap gap-8">
          {ciudad && (
            <div className="flex flex-col gap-1">
              <span
                className="text-[.75rem] font-bold uppercase tracking-[.1em]"
                style={{ color: acento, fontFamily: "'DM Sans',sans-serif" }}
              >
                Ubicación
              </span>
              <span
                className="text-base font-medium"
                style={{ color: txt, fontFamily: "'DM Sans',sans-serif" }}
              >
                {ciudad}
                {provincia ? `, ${provincia}` : ''}
              </span>
            </div>
          )}

          {instagram && (
            <div className="flex flex-col gap-1">
              <span
                className="text-[.75rem] font-bold uppercase tracking-[.1em]"
                style={{ color: acento, fontFamily: "'DM Sans',sans-serif" }}
              >
                Instagram
              </span>
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noreferrer"
                className="text-base font-medium no-underline hover:opacity-70 transition-opacity"
                style={{ color: txt, fontFamily: "'DM Sans',sans-serif" }}
              >
                @{instagram}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
