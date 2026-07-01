import type { IHeroProps } from './Types';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=1400&h=700&fit=crop&q=80';

const Hero = ({
  titulo = 'Nueva colección',
  descripcion = '',
  ctaTexto = 'Ver colección',
  imagenCarrusel = [],
  acento = 'var(--gor-acento)',
  btnTextColor = 'var(--gor-btn-txt)',
  whatsapp,
  onNavigate,
}: IHeroProps) => {
  const slide = imagenCarrusel[0] ?? null;
  const imagenUrl = slide?.url || slide?.img || DEFAULT_IMAGE;

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: 'clamp(320px, 55vw, 600px)' }}>
      {/* Imagen de fondo */}
      <img
        src={imagenUrl}
        alt={titulo}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'center' }}
      />

      {/* Overlay degradado izquierda → transparente */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.32) 50%, rgba(0,0,0,0.05) 100%)',
        }}
      />

      {/* Contenido */}
      <div className="relative z-10 h-full flex items-center px-8 md:px-16 py-14"
        style={{ minHeight: 'clamp(320px, 55vw, 600px)' }}
      >
        <div className="max-w-xl">
          {/* Badge superior */}
          {(slide?.subtitulo || slide?.label || descripcion) && (
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 mb-4"
              style={{ background: `${acento}33`, border: `1px solid ${acento}66` }}
            >
              <span
                className="text-[.65rem] font-bold tracking-[.18em] uppercase text-white"
                style={{ fontFamily: "'DM Sans',sans-serif" }}
              >
                {slide?.subtitulo || slide?.label || descripcion}
              </span>
            </div>
          )}

          {/* Título principal */}
          <h1
            className="font-bold leading-[1.08] mb-5 text-white"
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              textShadow: '0 2px 12px rgba(0,0,0,0.3)',
            }}
          >
            {titulo}
          </h1>

          {/* Botones */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => onNavigate?.('producto')}
              className="px-7 py-3 rounded-full text-[.8rem] font-semibold tracking-wide cursor-pointer border-none transition-all duration-200 hover:scale-105 hover:opacity-90"
              style={{
                background: acento,
                color: btnTextColor || '#fff',
                fontFamily: "'DM Sans',sans-serif",
                boxShadow: `0 4px 20px ${acento}55`,
              }}
            >
              {ctaTexto} →
            </button>

            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full text-[.78rem] font-semibold no-underline text-white transition-all duration-200 hover:scale-105"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.35)',
                  fontFamily: "'DM Sans',sans-serif",
                  backdropFilter: 'blur(4px)',
                }}
              >
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
