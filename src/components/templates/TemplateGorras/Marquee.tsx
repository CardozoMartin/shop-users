// components/Marquee.tsx
const ACENTO = 'var(--gor-acento)';
const BTN_TXT = 'var(--gor-btn-txt)';

const DEFAULT_WORDS = [
  'Nueva Colección',
  'Envío a todo Tucumán',
  'Hecho Local',
  'Edición Limitada',
  'CapZone 2025',
  'Streetwear',
];

interface MarqueeProps {
  items?: Array<{ texto: string }>;
}

export default function Marquee({ items: dynamicItems }: MarqueeProps) {
  const words = dynamicItems && dynamicItems.length > 0 
    ? dynamicItems.map(it => it.texto) 
    : DEFAULT_WORDS;

  // Triplicamos para el loop infinito
  const displayItems = [...words, ...words, ...words];

  return (
    <div className="overflow-hidden py-[9px]" style={{ background: ACENTO }}>
      <style>{`
        @keyframes czmq {
          from { transform: translateX(0) }
          to   { transform: translateX(-33.33%) }
        }
        .cz-track {
          display: flex;
          width: max-content;
          animation: czmq 25s linear infinite;
        }
        .cz-track:hover { animation-play-state: paused }
      `}</style>
      <div className="cz-track">
        {displayItems.map((w, i) => (
          <span
            key={i}
            className="text-[.68rem] font-black tracking-[.25em] uppercase px-8 whitespace-nowrap"
            style={{ color: BTN_TXT, fontFamily: "'DM Sans',sans-serif" }}
          >
            {w} <span className="opacity-30 mx-2">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
