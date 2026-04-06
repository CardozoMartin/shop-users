import type { AboutUsProps } from './Types';

export default function AboutUs({
  titulo,
  descripcion,
  imagenUrl,
  direccion,
  ciudad,
  provincia,
  instagram,
  acento = '#dc2626',
  bg = 'transparent',
  border = '#27272a',
  txt = '#ffffff',
  muted = '#a1a1aa',
}: AboutUsProps) {
  if (!descripcion && !titulo && !imagenUrl) return null;

  return (
    <section
      className="bg-black text-white py-32 px-6 min-h-screen"
      id="about-us"
      style={{ background: bg, borderTop: `1px solid ${border}` }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          {imagenUrl && (
            <div className="relative group overflow-hidden rounded-[2rem] shadow-2xl">
              <img
                src={imagenUrl}
                alt={titulo || 'Sobre Nosotros'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
          )}

          <div className={imagenUrl ? '' : 'md:col-span-2'}>
            <div className="mb-8">
              <h1 className="text-white text-7xl leading-none uppercase font-black font-bebas">
                {titulo || 'SOBRE NOSOTROS'}
              </h1>
              <div className="w-24 h-1 mt-6" style={{ backgroundColor: acento }} />
            </div>

            <p className="text-zinc-400 text-lg leading-relaxed uppercase tracking-widest font-black opacity-80 font-barlow">
              {descripcion ||
                'Aquí va la historia de la tienda, su inspiración y su estilo urbano único.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-10 border-t border-zinc-900">
              {(direccion || ciudad || provincia) && (
                <div className="space-y-3">
                  <h4 className="text-zinc-600 font-black uppercase text-[10px] tracking-[0.4em] font-syncopate">
                    LOCATION_BASE
                  </h4>
                  <p className="text-white font-black uppercase text-sm leading-tight tracking-widest">
                    {direccion
                      ? direccion
                      : `${ciudad || 'Ciudad'}${provincia ? `, ${provincia}` : ''}`}
                  </p>
                </div>
              )}

              {instagram && (
                <div className="space-y-3">
                  <h4 className="text-zinc-600 font-black uppercase text-[10px] tracking-[0.4em] font-syncopate">
                    SOCIAL_UPLINK
                  </h4>
                  <p className="text-white font-black uppercase text-sm leading-tight tracking-widest">
                    @{instagram}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-12">
              <p className="text-zinc-800 text-[10px] font-black uppercase tracking-[0.6em] leading-loose">
                CORE_V1 // EST_2026 // PREMIUM_GRADE // URBAN_ARCHIVE
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
