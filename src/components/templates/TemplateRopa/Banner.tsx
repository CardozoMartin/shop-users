export default function Banner({ tienda }: { tienda: any }) {
  return (
    <section className="py-14 px-8" style={{ background: 'var(--rop-acento)' }}>
      <div className="max-w-[1060px] mx-auto flex items-center justify-between flex-wrap gap-6">
        <div>
          <h3
            className="text-[clamp(2rem,4vw,3rem)] tracking-[.04em] leading-[0.9] mb-2"
            style={{ fontFamily: "'Bebas Neue',sans-serif", color: 'var(--rop-btn-txt)' }}
          >
            ENVÍO GRATIS
            <br />
            EN PEDIDOS +$10.000
          </h3>
          <p
            className="text-[.8rem] font-light"
            style={{ fontFamily: "'Outfit',sans-serif", color: 'rgba(255,255,255,.75)' }}
          >
            A todo {tienda.ciudad || 'Tucumán'} y alrededores.
          </p>
        </div>
        <div className="flex gap-8">
          {[
            { n: '+300', l: 'prendas vendidas' },
            { n: '100%', l: 'diseño local' },
            { n: '4.9★', l: 'calificación' },
          ].map(({ n, l }) => (
            <div key={l} className="text-center">
              <div
                className="text-[1.8rem] tracking-[.06em] leading-none"
                style={{ fontFamily: "'Bebas Neue',sans-serif", color: 'var(--rop-btn-txt)' }}
              >
                {n}
              </div>
              <div
                className="text-[.62rem] mt-[3px] tracking-[.06em]"
                style={{ fontFamily: "'Outfit',sans-serif", color: 'rgba(255,255,255,.65)' }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>
        <a
          href={`https://wa.me/${tienda.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="py-3 px-7 rounded no-underline text-[.75rem] font-semibold tracking-[.1em] uppercase"
          style={{
            background: 'var(--rop-dark)',
            color: 'var(--rop-btn-txt)',
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Consultanos →
        </a>
      </div>
    </section>
  );
}
