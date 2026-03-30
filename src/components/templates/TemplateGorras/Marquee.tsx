// components/Marquee.tsx
const ACENTO = 'var(--gor-acento)';
const BTN_TXT = 'var(--gor-btn-txt)';

const WORDS = [
  'Nueva Colección',
  'Envío a todo Tucumán',
  'Hecho Local',
  'Edición Limitada',
  'CapZone 2025',
  'Streetwear',
];

export default function Marquee() {
  const items = [...WORDS, ...WORDS, ...WORDS];

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
          animation: czmq 20s linear infinite;
        }
        .cz-track:hover { animation-play-state: paused }
      `}</style>
      <div className="cz-track">
        {items.map((w, i) => (
          <span
            key={i}
            className="text-[.65rem] font-bold tracking-[.2em] uppercase px-7 whitespace-nowrap"
            style={{ color: BTN_TXT, fontFamily: "'DM Sans',sans-serif" }}
          >
            {w} <span className="opacity-45">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
