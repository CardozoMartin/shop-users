import { useMemo, useState } from 'react';

const LOOKBOOK_DEFAULT = [
  { img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop&q=80', span: '1/3' },
  { img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=400&fit=crop&q=80', span: '1/1' },
  { img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=400&fit=crop&q=80', span: '1/1' },
  { img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop&q=80', span: '1/3' },
  { img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80', span: '1/1' },
  { img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=400&fit=crop&q=80', span: '1/1' },
];

export default function Lookbook({ tienda }: { tienda: any }) {
  const [hov, setHov] = useState<number | null>(null);

  const images = useMemo(() => {
    if (tienda.lookbook?.length > 0) return tienda.lookbook;
    return LOOKBOOK_DEFAULT;
  }, [tienda.lookbook]);

  return (
    <section className="py-20 px-8" style={{ background: 'var(--rop-bg)' }}>
      <div className="max-w-[1060px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <span
              className="block text-[.62rem] tracking-[.24em] uppercase font-semibold mb-2"
              style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-acento)' }}
            >
              SS 2025
            </span>
            <h2
              className="text-[clamp(2.5rem,5vw,4rem)] tracking-[.04em] leading-[0.9]"
              style={{ fontFamily: "'Bebas Neue',sans-serif", color: 'var(--rop-dark)' }}
            >
              LOOKBOOK
            </h2>
          </div>
          <p
            className="text-[.8rem] font-light max-w-[280px] leading-[1.7]"
            style={{ fontFamily: "'Outfit',sans-serif", color: 'var(--rop-muted)' }}
          >
            {tienda.descripcion}
          </p>
        </div>

        {/* Masonry grid */}
        <div className="grid grid-cols-3 gap-2" style={{ gridTemplateRows: 'auto' }}>
          {images.map((item: any, i: number) => (
            <div
              key={i}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              className="rounded-lg overflow-hidden relative cursor-pointer"
              style={{
                gridRow: item.span,
                aspectRatio: item.span === '1/3' ? '3/4' : '1',
              }}
            >
              <img
                src={item.img}
                alt=""
                className="w-full h-full object-cover transition-transform duration-[550ms] ease-out"
                style={{ transform: hov === i ? 'scale(1.05)' : 'scale(1)' }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
                style={{
                  background: 'rgba(20,20,20,.4)',
                  opacity: hov === i ? 1 : 0,
                }}
              >
                <span
                  className="text-[1.1rem] tracking-[.18em] text-white"
                  style={{ fontFamily: "'Bebas Neue',sans-serif" }}
                >
                  VER MÁS
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
