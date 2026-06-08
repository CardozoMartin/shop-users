import type { IFooterProps } from './Types';

export const Footer = ({
  instagram,
  whatsapp,
  descripcion,
  ciudad,
  pais,
  acento = '#dc2626',
  nombreTienda,
  onNavigate,
}: IFooterProps) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t border-zinc-900 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          {/* Brand Column */}
          <div className="md:col-span-12 lg:col-span-5 space-y-8">
            <h3 className="text-5xl font-black uppercase text-white leading-none font-bebas">
              {nombreTienda || 'URBAN TIENDZI'}
            </h3>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] leading-loose max-w-sm">
              {descripcion || 'Guardamos el mejor streetwear y atención premium para tu negocio.'}
            </p>
            <div className="flex gap-4 pt-4">
              {instagram && (
                <a
                  href={`https://instagram.com/${instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-12 h-12 border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-all text-white group"
                >
                  <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-110">
                    public
                  </span>
                </a>
              )}
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-12 h-12 border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-all text-white group"
                >
                  <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-110">
                    chat
                  </span>
                </a>
              )}
            </div>
          </div>

          {/* Directory Column */}
          <div className="md:col-span-6 lg:col-span-3 space-y-8">
            <h4 className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] font-syncopate">
              DIRECTORY_LOG
            </h4>
            <nav className="flex flex-col gap-5">
              {[
                { label: 'INICIO', target: 'inicio' },
                { label: 'PRODUCTOS', target: 'producto' },
                { label: 'CONTACTO', target: 'contacto' },
                { label: 'SOBRE_NOSOTROS', target: 'sobrenosotros' },
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={() => onNavigate?.(link.target as any)}
                  className="text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Ops Column */}
          <div className="md:col-span-6 lg:col-span-4 space-y-8">
            <h4 className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] font-syncopate">
              OPERATIONS_BASE
            </h4>
            <div className="space-y-4">
              <div>
                <span className="text-zinc-800 text-[9px] font-black uppercase tracking-widest block mb-1">
                  LOCATION
                </span>
                <p className="text-xs font-black uppercase tracking-widest text-white leading-tight">
                  {ciudad || 'Ciudad no definida'}
                </p>
              </div>
              <div>
                <span className="text-zinc-800 text-[9px] font-black uppercase tracking-widest block mb-1">
                  REGION
                </span>
                <p className="text-xs font-black uppercase tracking-widest text-zinc-500 leading-tight">
                  {pais || 'Región no definida'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-zinc-900 gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">
              © {currentYear} {nombreTienda} // POWERED_BY: TIENDA_FREE
            </p>
            <div className="hidden md:flex gap-6">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-900">
                STREET_ARCHIVE_CORE_V1
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-900">
                EST_2026_TUC
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-1 bg-zinc-900" />
            <div className="w-12 h-1" style={{ backgroundColor: acento }} />
          </div>
        </div>
      </div>
    </footer>
  );
};
