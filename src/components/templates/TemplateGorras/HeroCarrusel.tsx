import { useCallback, useEffect, useRef, useState } from 'react';
import type { HeroSlide, IHeroProps } from './Types';

// Carrusel a pantalla completa: imagen de fondo + texto encima + navegación
const HeroCarrusel = ({
  titulo = '',
  descripcion = '',
  ctaTexto = 'Ver colección',
  imagenCarrusel = [],
  intervaloCarrusel = 5000,
  acento = 'var(--gor-acento)',
  whatsapp,
  onNavigate,
}: IHeroProps) => {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const intervalo = Math.max(1000, intervaloCarrusel);

  const slides: HeroSlide[] = imagenCarrusel.length > 0 ? imagenCarrusel : [
    {
      url: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=1400&h=700&fit=crop&q=80',
      titulo: titulo,
      subtitulo: descripcion,
      label: 'Colección',
    },
  ];

  const start = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setActive((a) => (a + 1) % slides.length),
      intervalo
    );
  }, [slides.length, intervalo]);

  useEffect(() => {
    start();
    return () => clearInterval(timerRef.current!);
  }, [start]);

  const go = (i: number) => {
    setActive(i);
    start();
  };

  const prev = () => go((active - 1 + slides.length) % slides.length);
  const next = () => go((active + 1) % slides.length);

  const cur = slides[active];

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'clamp(420px, 65vh, 720px)' }}>
      {/* Slides con transición fade */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === active ? 1 : 0 }}
        >
          <img
            src={slide.url || slide.img || ''}
            alt={slide.titulo || ''}
            className="w-full h-full object-cover"
          />
          {/* Overlay gradiente */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.05) 100%)',
            }}
          />
        </div>
      ))}

      {/* Contenido sobre el slide activo */}
      <div className="relative z-10 h-full flex items-center px-6 md:px-16">
        <div className="max-w-xl">
          {/* Etiqueta */}
          {(cur.subtitulo || cur.label) && (
            <span
              className="inline-block text-[.65rem] font-bold tracking-[.18em] uppercase px-3 py-1 rounded-full mb-4"
              style={{ background: `${acento}cc`, color: '#fff', fontFamily: "'DM Sans',sans-serif" }}
            >
              {cur.subtitulo || cur.label}
            </span>
          )}

          {/* Título del slide o de la tienda */}
          <h1
            className="font-bold leading-[1.08] mb-4 text-white"
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 'clamp(2rem, 4.5vw, 3.6rem)',
              textShadow: '0 2px 12px rgba(0,0,0,0.4)',
            }}
          >
            {cur.titulo || titulo}
          </h1>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => onNavigate?.('producto')}
              className="px-6 py-3 rounded-full text-[.75rem] font-semibold tracking-wide cursor-pointer border-none transition-all duration-200 hover:scale-105"
              style={{ background: acento, color: '#fff', fontFamily: "'DM Sans',sans-serif" }}
            >
              {ctaTexto} →
            </button>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                className="px-5 py-3 rounded-full text-[.72rem] font-semibold no-underline text-white transition-all duration-200 hover:scale-105"
                style={{ background: '#25d366', fontFamily: "'DM Sans',sans-serif" }}
              >
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Flechas (solo si hay más de 1 slide) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="rounded-full transition-all duration-300 cursor-pointer border-none"
              style={{
                width: i === active ? '24px' : '8px',
                height: '8px',
                background: i === active ? acento : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroCarrusel;
