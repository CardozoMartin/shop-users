import type { IFooterProps } from "./Types";

export const Footer = ({
  instagram,
  facebook,
  whatsapp,
  descripcion,
  ciudad,
  pais,
  acento = "var(--gor-acento)",
  nombreTienda,
  onNavigate,
}: IFooterProps) => {
  const socials = [
    {
      label: "Instagram",
      href: `https://instagram.com/${instagram}`,
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: "Facebook",
      href: `https://facebook.com/${facebook}`,
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/${whatsapp}`,
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full"
      style={{
        background: "var(--gor-footer-bg)",
        color: "rgba(255,255,255,0.5)",
      }}
    >
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-white/10 pb-6">
        {/* Brand + descripción */}
        <div className="md:max-w-72">
          <div className="text-[1.4rem] font-bold text-white font-['Playfair_Display',serif]">
            {(nombreTienda || "").slice(0, -4)}
            <span style={{ color: acento }}>
              {(nombreTienda || "").slice(-4)}
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/45">
            {descripcion}
          </p>

          {/* Redes sociales */}
          <div className="flex gap-2 mt-5">
            {socials.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-[34px] h-[34px] rounded-lg border border-white/10 flex items-center justify-center text-white/40 transition-all duration-200"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = acento;
                  e.currentTarget.style.color = acento;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Columnas derecha */}
        <div className="flex-1 flex items-start md:justify-end gap-16 md:gap-20">
          {/* Navegación */}
          <div className="hidden sm:block">
            <h2 className="font-semibold mb-4 text-white text-sm tracking-widest uppercase">
              Navegación
            </h2>
            <ul className="text-sm space-y-2 list-none p-0 m-0">
              <li>
                <button
                  onClick={() => onNavigate?.("inicio")}
                  className="bg-transparent border-none p-0 text-white/50 hover:text-white/80 cursor-pointer transition-colors text-[.85rem]"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.("producto")}
                  className="bg-transparent border-none p-0 text-white/50 hover:text-white/80 cursor-pointer transition-colors text-[.85rem]"
                >
                  Catálogo
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.("sobrenosotros")}
                  className="bg-transparent border-none p-0 text-white/50 hover:text-white/80 cursor-pointer transition-colors text-[.85rem]"
                >
                  Sobre Nosotros
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.("contacto")}
                  className="bg-transparent border-none p-0 text-white/50 hover:text-white/80 cursor-pointer transition-colors text-[.85rem]"
                >
                  Contacto
                </button>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h2 className="font-semibold mb-4 text-white text-sm tracking-widest uppercase">
              Contacto
            </h2>
            <div className="text-sm space-y-2">
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="block text-white/50 hover:text-white/80 transition-colors no-underline"
              >
                📱 {whatsapp}
              </a>
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noreferrer"
                className="block text-white/50 hover:text-white/80 transition-colors no-underline"
              >
                📷 @{instagram}
              </a>
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <h2 className="font-semibold mb-4 text-white text-sm tracking-widest uppercase">
              Ubicación
            </h2>
            <div className="text-sm space-y-2 text-white/50">
              <p>{ciudad}</p>
              <p>{pais}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <p className="pt-4 text-center text-xs pb-5 text-white/20">
        © {new Date().getFullYear()}{" "}
        <span style={{ color: acento }} className="opacity-80">
          {nombreTienda}
        </span>{" "}
        — Todos los derechos reservados.
      </p>
    </footer>
  );
};
