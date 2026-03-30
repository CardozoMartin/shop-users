import { useCallback, useEffect, useRef, useState } from 'react';
import type { HeroSlide, IHeroProps } from './Types';



const DEFAULT_SLIDES: HeroSlide[] = [
  {
    url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=700&h=700&fit=crop&q=80',
    label: 'Nueva temporada',
    subtitulo: 'Colección',
  },
  {
    url: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=700&h=700&fit=crop&q=80',
    label: 'Edición limitada',
    subtitulo: 'Exclusivo',
  },
  {
    url: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=700&h=700&fit=crop&q=80',
    label: 'Streetwear local',
    subtitulo: 'Urbano',
  },
  {
    url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=700&h=700&fit=crop&q=80',
    label: 'Últimos modelos',
    subtitulo: 'Top ventas',
  },
];

const Hero = ({
  titulo = 'CapZone',
  descripcion = '',
  imagenCarrusel = [],
  tituloDos,
  acento = 'var(--gor-acento)',
  txtColor = 'var(--gor-txt)',
  btnTextColor = 'var(--gor-btn-txt)',
  bgColor = 'var(--gor-bg)',
  mutedColor = 'var(--gor-muted)',
  whatsapp = '5493812345678',
}: IHeroProps) => {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slides = imagenCarrusel && imagenCarrusel.length > 0 ? imagenCarrusel : DEFAULT_SLIDES;

  const colorPalette = [
    { accent: acento, bg: `${acento}18` },
    { accent: '#4a90d9', bg: '#0e2849' },
    { accent: '#3aab6d', bg: '#f0fff4' },
    { accent: '#e5973a', bg: '#fff8f0' },
  ];

  const currentColorScheme = colorPalette[active % colorPalette.length];

  const go = useCallback(
    (i: number) => {
      setActive(i);
      clearInterval(timerRef.current!);
      timerRef.current = setInterval(() => setActive((a) => (a + 1) % slides.length), 4500);
    },
    [slides.length]
  );

  useEffect(() => {
    timerRef.current = setInterval(() => setActive((a) => (a + 1) % slides.length), 4500);
    return () => clearInterval(timerRef.current!);
  }, [slides.length]);

  const cur = slides[active];

  return (
    <section
      className="px-6 pt-14 pb-16 transition-all duration-700"
      style={{ background: currentColorScheme.bg }} // ← dinámico, obligatorio inline
    >
      <div
        className="max-w-[1060px] mx-auto grid gap-12 items-center"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}
      >
        {/* Columna texto */}
        <div>
          {/* Badge colección */}
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 mb-4"
            style={{ background: `${currentColorScheme.accent}22` }} // ← dinámico
          >
            <span
              className="text-[.62rem] font-bold tracking-[.16em] uppercase"
              style={{ color: currentColorScheme.accent, fontFamily: "'DM Sans',sans-serif" }}
            >
              {cur.subtitulo || cur.label || 'Colección'}
            </span>
          </div>

          {/* Título */}
          <h1
            className="font-bold leading-[1.05] mb-3.5"
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
              color: txtColor,
            }}
          >
            {tituloDos?.primera || titulo}
            <br />
            <span
              className="italic font-normal"
              style={{ color: currentColorScheme.accent }} // ← dinámico
            >
              {tituloDos?.segunda || descripcion}
            </span>
          </h1>

          {/* CTAs + dots */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Ver colección */}
            <button
              className="px-7 py-3 rounded-full text-[.75rem] font-semibold tracking-wide cursor-pointer border-none transition-opacity duration-200 hover:opacity-85"
              style={{
                background: acento,
                color: btnTextColor,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Ver colección →
            </button>

            {/* WhatsApp — color fijo, puede ir todo en Tailwind */}
            <a
              href={`https://wa.me/${whatsapp}`}
              className="px-5 py-3 rounded-full text-[.72rem] font-semibold no-underline text-white"
              style={{ background: '#25d366', fontFamily: "'DM Sans',sans-serif" }}
            >
              WhatsApp
            </a>

            {/* Dots */}
            <div className="flex gap-1.5 ml-2">
              {slides.map((_, i) => (
                <div
                  key={i}
                  onClick={() => go(i)}
                  className="h-[7px] rounded-[4px] cursor-pointer transition-all duration-300"
                  style={{
                    // ancho y color cambian dinámicamente → inline obligatorio
                    width: i === active ? '22px' : '7px',
                    background:
                      i === active ? currentColorScheme.accent : `${currentColorScheme.accent}40`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Columna imagen circular */}
        <div className="relative flex justify-center items-center">
          {/* Círculo de fondo exterior */}
          <div
            className="absolute w-[88%] aspect-square rounded-full transition-all duration-700"
            style={{ background: `${currentColorScheme.accent}12` }}
          />

          {/* Imagen circular */}
          <div
            className="relative w-[78%] aspect-square rounded-full overflow-hidden z-10 transition-all duration-700"
            style={{ border: `4px solid ${currentColorScheme.accent}30` }}
          >
            <img
              src={cur.url || cur.img}
              alt={cur.titulo || ''}
              className="w-full h-full object-cover transition-opacity duration-400"
            />
          </div>

          {/* Floating badge */}
          <div
            className="absolute bottom-[8%] right-[3%] z-20 rounded-[14px] px-3.5 py-2.5 min-w-[110px]"
            style={{
              background: bgColor,
              boxShadow: `0 4px 20px ${currentColorScheme.accent}22`,
            }}
          >
            <p
              className="text-[.58rem] mb-0.5"
              style={{ color: mutedColor, fontFamily: "'DM Sans',sans-serif" }}
            >
              Más vendido
            </p>
            <p
              className="text-[.92rem] font-bold"
              style={{ color: txtColor, fontFamily: "'Playfair Display',serif" }}
            >
              Edición {new Date().getFullYear()}
            </p>
            <p
              className="text-[.75rem] font-semibold mt-0.5"
              style={{ color: currentColorScheme.accent, fontFamily: "'DM Sans',sans-serif" }}
            >
              Ver →
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
