export default function Marquee({ tienda }: { tienda: any }) {
  const words = [
    tienda.nombre,
    'Nueva colección',
    'Ropa de autor',
    tienda.ciudad || 'Tucumán',
    'SS 2025',
    'Diseño local',
    'Tendencia',
  ];
  const items = [...words, ...words, ...words];
  return (
    <div className="overflow-hidden py-2.5" style={{ background: 'var(--rop-dark)' }}>
      <style>{`@keyframes vtmq{from{transform:translateX(0)}to{transform:translateX(-33.33%)}} .vt-mq{display:flex;width:max-content;animation:vtmq 22s linear infinite} .vt-mq:hover{animation-play-state:paused}`}</style>
      <div className="vt-mq">
        {items.map((w, i) => (
          <span
            key={i}
            className="px-6 whitespace-nowrap text-base tracking-[.18em]"
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              color: i % 3 === 1 ? 'var(--rop-acento)' : 'var(--rop-slider-text)',
            }}
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}
