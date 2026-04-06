export default function Toast({ msg, visible }: { msg: string; visible: boolean }) {
  return (
    <div
      className="fixed bottom-6 left-1/2 rounded px-5 py-2.5 text-[.75rem] font-medium z-[60] whitespace-nowrap pointer-events-none transition-all duration-300"
      style={{
        transform: `translateX(-50%) translateY(${visible ? '0' : '12px'})`,
        background: 'var(--rop-dark)',
        border: '1.5px solid var(--rop-acento)',
        color: 'var(--rop-bg)',
        fontFamily: "'Outfit',sans-serif",
        opacity: visible ? 1 : 0,
      }}
    >
      <span className="mr-2 font-bold" style={{ color: 'var(--rop-acento)' }}>✓</span>
      {msg}
    </div>
  );
}
