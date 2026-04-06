export default function Marquee() {
  const words = [
    'Hecho a mano',
    'Con amor',
    'Bijouterie',
    'Artesanal',
    'Piezas únicas',
  ];
  const items = [...words, ...words, ...words, ...words];
  return (
    <div style={{ background: 'var(--acc-acento)', overflow: 'hidden', padding: '9px 0' }}>
      <style>{`@keyframes acmq{from{transform:translateX(0)}to{transform:translateX(-33.33%)}} .ac-track{display:flex;width:max-content;animation:acmq 24s linear infinite} .ac-track:hover{animation-play-state:paused}`}</style>
      <div className="ac-track">
        {items.map((w, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: '.62rem',
              fontWeight: 500,
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.9)',
              padding: '0 1.8rem',
              whiteSpace: 'nowrap',
            }}
          >
            {w} <span style={{ opacity: 0.45 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
