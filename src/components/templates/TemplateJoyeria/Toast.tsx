export default function Toast({ msg, visible }: { msg: string; visible: boolean }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0' : '12px'})`,
        background: 'var(--acc-surface)',
        border: `0.5px solid var(--acc-acento)`,
        borderRadius: '10px',
        padding: '10px 20px',
        fontFamily: "'Jost',sans-serif",
        fontSize: '.74rem',
        color: 'var(--acc-txt)',
        zIndex: 60,
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
        transition: 'all .3s ease',
        whiteSpace: 'nowrap',
        boxShadow: `0 4px 20px rgba(0,0,0,0.1)`,
      }}
    >
      <span style={{ color: 'var(--acc-acento)', marginRight: '6px' }}>✓</span>
      {msg}
    </div>
  );
}
