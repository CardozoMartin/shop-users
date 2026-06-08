import { useAuthSessionStore } from '../../../store/useAuthSession';
import type { NavbarProps } from './Types';

export const Navbar = ({
  cartCount,
  onCart,
  logo,
  titulo,
  onIngresar,
  onMiCuenta,
  onNavigate,
}: NavbarProps) => {
  const cliente = useAuthSessionStore((s) => s.cliente);
  const logout = useAuthSessionStore((s) => s.logout);

  return (
    <nav className="bg-black text-white sticky top-0 z-50 border-b-4 border-red-600">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div
            className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
            onClick={() => onNavigate('inicio')}
          >
            <span className="text-red-600 font-bebas text-[28px] tracking-wide">
              {logo ? (
                <img src={logo} alt={titulo || 'Logo'} className="h-10 object-contain" />
              ) : (
                <>
                  URBAN <span className="text-white">{titulo?.split(' ')[1] || 'TIENDZI'}</span>
                </>
              )}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {(
              [
                { label: 'Productos', target: 'producto' },
                { label: 'Nosotros', target: 'sobrenosotros' },
                { label: 'Contacto', target: 'contacto' },
              ] as Array<{ label: string; target: import('./Types').NavbarTarget }>
            ).map((item) => (
              <a
                key={item.target}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.target);
                }}
                className="text-zinc-300 hover:text-red-500 transition text-xs uppercase font-black tracking-widest no-underline"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onCart}
              className="relative p-2 hover:text-red-500 transition bg-transparent border-none cursor-pointer"
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {cliente ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onMiCuenta}
                  className="bg-transparent border border-zinc-700 text-zinc-400 hover:text-white text-xs px-3 py-1.5 transition uppercase tracking-wider font-black cursor-pointer"
                >
                  Mi Cuenta
                </button>
                <button
                  onClick={logout}
                  className="bg-zinc-900 border border-zinc-700 text-zinc-500 hover:text-red-500 text-xs px-3 py-1.5 transition uppercase tracking-wider font-black cursor-pointer"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={onIngresar}
                className="bg-red-600 hover:bg-white hover:text-black text-white font-black py-2.5 px-6 transition duration-300 uppercase text-xs tracking-widest border-none cursor-pointer"
              >
                Ingresar
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
