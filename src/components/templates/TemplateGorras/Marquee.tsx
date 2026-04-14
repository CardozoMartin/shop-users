import type { MarqueeItem } from '../../../types/types';

const COLORS = {
  background: 'var(--gor-acento)',
  text: 'var(--gor-btn-txt)',
} as const;

//Props por defectos
const DEFAULT_ITEMS: MarqueeItem[] = [
  { texto: 'Nueva Colección' },
  { texto: 'Envío a todo Tucumán' },
  { texto: 'Hecho Local' },
  { texto: 'Edición Limitada' },
  { texto: 'CapZone 2025' },
  { texto: 'Streetwear' },
];

// Para evitar saltos al repetir, el número de repeticiones debe ser al menos 3 (1 ciclo completo visible + 2 para continuidad)
const REPEAT_COUNT = 3;
const ANIMATION_NAME = 'marqueeShift';
const ANIMATION_DURATION = '25s';

interface MarqueeProps {
  items?: MarqueeItem[];
}

function repetirItems<T>(items: T[], veces: number): T[] {
  return Array.from({ length: veces }, () => items).flat();
}

export default function Marquee({ items }: MarqueeProps) {
  const marqueeItems = items?.length ? items : DEFAULT_ITEMS;
  const displayItems = repetirItems(marqueeItems, REPEAT_COUNT);

  return (
    <div className="overflow-hidden py-[9px]" style={{ background: COLORS.background }}>
      <style>{`
        @keyframes ${ANIMATION_NAME} {
          from { transform: translateX(0); }
          to { transform: translateX(-33.33%); }
        }

        .marquee-track {
          display: flex;
          width: max-content;
          animation: ${ANIMATION_NAME} ${ANIMATION_DURATION} linear infinite;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="marquee-track">
        {displayItems.map((item, index) => (
          <span
            key={`${item.texto}-${index}`}
            className="text-[.68rem] font-black tracking-[.25em] uppercase px-8 whitespace-nowrap"
            style={{
              color: COLORS.text,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            {item.texto}
            <span className="opacity-30 mx-2">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
