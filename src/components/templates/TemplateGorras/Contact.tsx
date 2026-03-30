import type { ContactProps } from "./Types";



const Contact = ({ tienda, theme }: ContactProps) => {
  const {
    surface = 'var(--gor-surface)',
    border = 'var(--gor-border)',
    txt = 'var(--gor-txt)',
    muted = 'var(--gor-muted)',
    acento = 'var(--gor-acento)',
  } = theme || {};

  const whatsapp = tienda?.whatsapp || '5493812345678';
  const instagram = tienda?.instagram || 'capzone.tuc';

  return (
    <section
      className="px-6 py-16"
      style={{ background: surface, borderTop: `1px solid ${border}` }}
    >
      <div className="max-w-xl mx-auto text-center">
        <h3
          className="font-bold mb-3"
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(1.6rem,3vw,2.4rem)',
            color: txt,
          }}
        >
          ¿Querés hacer un
          <br />
          <em className="font-normal" style={{ color: acento }}>
            pedido especial?
          </em>
        </h3>

        <p
          className="text-[.85rem] leading-[1.8] text-center text-[var(--gor-muted)] max-w-[420px] mx-auto mb-8"
          style={{ color: muted, fontFamily: "'DM Sans',sans-serif" }}
        >
          Personalizamos gorras con logos, bordados y diseños exclusivos. Escribinos por WhatsApp o
          redes.
        </p>

        <div className="flex gap-2.5 justify-center flex-wrap">
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-7 py-3 rounded-full text-[.78rem] font-semibold text-white transition-opacity duration-200 hover:opacity-90"
            style={{ background: '#25d366', fontFamily: "'DM Sans',sans-serif" }}
          >
            WhatsApp
          </a>

          <a
            href={`https://instagram.com/${instagram}`}
            target="_blank"
            rel="noreferrer"
            className="px-7 py-3 rounded-full text-[.78rem] font-semibold transition-opacity duration-200 hover:opacity-80"
            style={{
              background: `${acento}14`,
              border: `1.5px solid ${acento}`,
              color: acento,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            @{instagram}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
