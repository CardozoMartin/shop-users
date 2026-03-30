import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCarrito } from '../../../hooks/useCarrito';
import { useStorefrontProductos } from '../../../hooks/useStorefrontProducts';
import { useAuthSessionStore } from '../../../store/useAuthSession';
import { useTiendaIDStore } from '../../../store/useTiendaIDStore';

type ProductoUrbanTag = 'BEST SELLER' | 'NEW DROP' | 'LIMITED' | 'OFERTA';

interface ProductoUrban {
  id: number;
  nombre?: string;
  name?: string;
  precio?: number;
  price?: number;
  categoria?: string;
  category?: string;
  tag?: ProductoUrbanTag;
  imagenUrl?: string;
  img?: string;
  descripcion?: string;
  description?: string;
  talles?: string[];
  sizes?: string[];
  colores?: string[];
  colors?: string[];
}

interface CartItemUrban extends ProductoUrban {
  qty: number;
  selectedSize: string;
  selectedColor?: string;
}

interface ToastItem {
  id: number;
  name: string;
  price: number;
  img: string;
}

interface UrbanTiendziProps {
  tienda?: any;
  accent?: string;
  fontFamily?: string;
  themeConfig?: any;
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const PRODUCTS: ProductoUrban[] = [
  {
    id: 1,
    name: 'Oversized Hoodie Black',
    price: 75,
    category: 'Hoodies',
    tag: 'BEST SELLER',
    img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&q=80&w=600',
    description:
      'Hoodie oversized en algodón premium 400gsm. Corte relajado, bolsillo canguro y capucha ajustable. Icono de la colección Black Edition.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Negro', 'Grafito'],
  },
  {
    id: 2,
    name: 'Track Jacket Red Flame',
    price: 89,
    category: 'Jackets',
    tag: 'NEW DROP',
    img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600',
    description:
      'Jacket deportivo estilo retro con detalles en llama bordados. Tela técnica resistente al viento, cierre YKK y bolsillos laterales con velcro.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Rojo', 'Negro'],
  },
  {
    id: 3,
    name: 'Cargo Pants Urban Olive',
    price: 95,
    category: 'Pantalones',
    tag: 'LIMITED',
    img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600',
    description:
      'Cargo pants con 6 bolsillos funcionales. Tela ripstop 100% algodón, cintura ajustable y bajo con cordón. El esencial de temporada.',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Olive', 'Negro', 'Beige'],
  },
  {
    id: 4,
    name: 'Tee Graffiti White',
    price: 42,
    category: 'Remeras',
    tag: 'OFERTA',
    img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=600',
    description:
      'Remera de algodón peinado con estampado graffiti de edición limitada. Corte recto, cuello redondo reforzado y costuras francesas.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Blanco', 'Negro'],
  },
  {
    id: 5,
    name: 'Bucket Hat Black Logo',
    price: 35,
    category: 'Accesorios',
    tag: 'NEW DROP',
    img: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&q=80&w=600',
    description:
      'Bucket hat reversible con logo bordado. Tela de gabardina doble capa, ala ancha y ajuste interno con cinta.',
    sizes: ['Único'],
    colors: ['Negro', 'Blanco'],
  },
  {
    id: 6,
    name: 'Bomber Varsity Cream',
    price: 120,
    category: 'Jackets',
    tag: 'BEST SELLER',
    img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80&w=600',
    description:
      'Bomber varsity estilo universitario con mangas de cuero sintético. Parches bordados, forro satinado y botones metálicos dorados.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Crema', 'Negro'],
  },
  {
    id: 7,
    name: 'Jogger Tech Fleece Grey',
    price: 68,
    category: 'Pantalones',
    tag: 'OFERTA',
    img: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&q=80&w=600',
    description:
      'Jogger en tech fleece liviano con bolsillos de canguro y ajuste en puños. Ideal para streetwear relajado sin perder el estilo.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Gris', 'Negro'],
  },
  {
    id: 8,
    name: 'Snapback Urban Red',
    price: 28,
    category: 'Accesorios',
    tag: 'LIMITED',
    img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600',
    description:
      'Snapback estructurado con cierre ajustable. Bordado frontal con el logo Urban Tiendzi en hilo rojo reflex. Tela 6 paneles.',
    sizes: ['Único'],
    colors: ['Negro/Rojo', 'Blanco/Rojo'],
  },
];

const TAG_COLORS: Record<ProductoUrbanTag, string> = {
  'BEST SELLER': 'bg-yellow-400 text-black',
  'NEW DROP': 'bg-red-600 text-white',
  LIMITED: 'bg-purple-600 text-white',
  OFERTA: 'bg-green-600 text-white',
};

// ─── TOAST ───────────────────────────────────────────────────────────────────
function Toast({
  toasts,
  removeToast,
}: {
  toasts: ToastItem[];
  removeToast: (id: number) => void;
}) {
  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-3 bg-zinc-900 border border-zinc-700 text-white px-4 py-3 shadow-2xl"
          style={{
            animation: 'slideInRight 0.35s cubic-bezier(.22,1,.36,1) forwards',
            minWidth: 280,
          }}
        >
          <img src={t.img} alt={t.name} className="w-14 h-14 object-cover flex-shrink-0" />
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest text-red-500 font-bold">
              Añadido al carrito
            </p>
            <p className="font-bold text-sm leading-tight">{t.name}</p>
            <p className="text-zinc-400 text-xs mt-0.5">${t.price}.00</p>
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="text-zinc-500 hover:text-white ml-2 text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── CART SIDEBAR ─────────────────────────────────────────────────────────────
function CartSidebar({
  open,
  onClose,
  cart,
  removeFromCart,
}: {
  open: boolean;
  onClose: () => void;
  cart: CartItemUrban[];
  removeFromCart: (id: number) => void;
}) {
  const total = cart.reduce((s, i) => s + (i.precio ?? i.price ?? 0) * i.qty, 0);
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-[90]"
          onClick={onClose}
          style={{ backdropFilter: 'blur(2px)' }}
        />
      )}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 z-[100] flex flex-col border-l-4 border-red-600"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(.22,1,.36,1)',
        }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <span
            className="text-2xl text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2 }}
          >
            TU CARRITO ({cart.reduce((s, i) => s + i.qty, 0)})
          </span>
          <button onClick={onClose} className="text-white hover:text-red-500 text-2xl transition">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-4">
              <span className="text-6xl">🛒</span>
              <p className="uppercase tracking-widest text-sm">Tu carrito está vacío</p>
            </div>
          )}
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 bg-zinc-900 p-3 border border-zinc-800">
              <img
                src={item.img}
                alt={item.name}
                className="w-20 h-20 object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">{item.name}</p>
                <p className="text-zinc-400 text-xs">Talle: {item.selectedSize}</p>
                <p className="text-red-500 font-bold mt-1">
                  ${item.price} × {item.qty}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-zinc-600 hover:text-red-500 transition text-xl self-start"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-800 px-6 py-5 space-y-4">
          <div className="flex justify-between text-white">
            <span className="uppercase tracking-widest text-sm">Total</span>
            <span className="text-2xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              ${total.toFixed(2)}
            </span>
          </div>
          <button className="w-full bg-red-600 hover:bg-white hover:text-black text-white font-bold py-4 uppercase tracking-widest transition duration-300">
            Finalizar Compra
          </button>
        </div>
      </div>
    </>
  );
}

// ─── PRODUCT DETAIL MODAL ─────────────────────────────────────────────────────
function DetailModal({
  product,
  onClose,
  onAddToCart,
}: {
  product: ProductoUrban | null;
  onClose: () => void;
  onAddToCart: (product: ProductoUrban, selectedSize: string) => void;
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(null);
      setSelectedColor(null);
      setAdded(false);
    }
  }, [product]);

  if (!product) return null;

  const productName = product.nombre || product.name || 'Producto';
  const productPrice = product.precio ?? product.price ?? 0;
  const productCategory = product.categoria || product.category || 'General';
  const productImage = product.imagenUrl || product.img || 'https://via.placeholder.com/600';
  const productTag = (product.tag as ProductoUrbanTag) || 'NEW DROP';
  const productDescription = product.descripcion || product.description || '';
  const productSizes = product.talles || product.sizes || ['Único'];
  const productColors = product.colores || product.colors || ['Negro'];

  const handleAdd = () => {
    if (!selectedSize) return;
    onAddToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/80 z-[110]"
        onClick={onClose}
        style={{ backdropFilter: 'blur(4px)' }}
      />
      <div
        className="fixed inset-0 z-[120] flex items-center justify-center p-4"
        style={{ pointerEvents: 'none' }}
      >
        <div
          className="bg-zinc-950 border border-zinc-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
          style={{
            pointerEvents: 'all',
            animation: 'scaleIn 0.3s cubic-bezier(.22,1,.36,1) forwards',
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-zinc-500 hover:text-white text-3xl leading-none transition"
          >
            ×
          </button>

          <div className="grid md:grid-cols-2">
            <div className="relative overflow-hidden bg-zinc-900 h-80 md:h-full min-h-[320px]">
              <img src={productImage} alt={productName} className="w-full h-full object-cover" />
              <span
                className={`absolute top-4 left-4 text-[10px] font-black px-3 py-1 uppercase tracking-widest ${TAG_COLORS[productTag] || 'bg-zinc-700 text-white'}`}
              >
                {productTag}
              </span>
            </div>

            <div className="p-8 flex flex-col gap-5">
              <div>
                <p className="text-red-500 text-xs uppercase tracking-widest font-bold mb-1">
                  {productCategory}
                </p>
                <h2
                  className="text-white text-3xl leading-tight"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {productName}
                </h2>
                <p
                  className="text-red-600 text-3xl mt-2"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  ${productPrice}.00
                </p>
              </div>

              <p className="text-zinc-400 text-sm leading-relaxed">{productDescription}</p>

              <div>
                <p className="text-zinc-400 text-xs uppercase tracking-widest mb-2">Color</p>
                <div className="flex flex-wrap gap-2">
                  {(productColors || []).map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-4 py-1.5 text-xs font-bold uppercase border transition ${
                        selectedColor === c
                          ? 'border-red-600 bg-red-600 text-white'
                          : 'border-zinc-700 text-zinc-400 hover:border-zinc-400'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-zinc-400 text-xs uppercase tracking-widest mb-2">
                  Talle{' '}
                  {!selectedSize && <span className="text-red-500 ml-1">— elegí un talle</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(productSizes || []).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-12 h-10 text-xs font-bold border transition ${
                        selectedSize === s
                          ? 'border-red-600 bg-red-600 text-white'
                          : 'border-zinc-700 text-zinc-400 hover:border-zinc-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAdd}
                disabled={!selectedSize}
                className={`mt-auto py-4 font-black uppercase tracking-widest transition duration-300 text-sm ${
                  added
                    ? 'bg-green-600 text-white'
                    : selectedSize
                      ? 'bg-red-600 hover:bg-white hover:text-black text-white'
                      : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                }`}
              >
                {added ? '✓ AÑADIDO AL CARRITO' : 'AÑADIR AL CARRITO'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── AUTH MODAL ───────────────────────────────────────────────────────────────
function AuthModal({ onClose, onLogin }: { onClose: () => void; onLogin: (name: string) => void }) {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!form.email || !form.password) {
      setError('Completá todos los campos.');
      return;
    }
    if (view === 'register' && !form.name) {
      setError('Ingresá tu nombre.');
      return;
    }
    onLogin(form.name || form.email.split('@')[0]);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/80 z-[110]"
        onClick={onClose}
        style={{ backdropFilter: 'blur(4px)' }}
      />
      <div
        className="fixed inset-0 z-[120] flex items-center justify-center p-4"
        style={{ pointerEvents: 'none' }}
      >
        <div
          className="bg-zinc-950 border border-zinc-800 w-full max-w-sm p-8"
          style={{
            pointerEvents: 'all',
            animation: 'scaleIn 0.3s cubic-bezier(.22,1,.36,1) forwards',
          }}
        >
          <div className="flex justify-between items-center mb-8">
            <span
              className="text-white text-3xl"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {view === 'login' ? 'INGRESAR' : 'REGISTRARSE'}
            </span>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white text-2xl transition"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {view === 'register' && (
              <div>
                <label className="text-zinc-400 text-xs uppercase tracking-widest block mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3 focus:outline-none focus:border-red-600 text-sm transition"
                />
              </div>
            )}
            <div>
              <label className="text-zinc-400 text-xs uppercase tracking-widest block mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3 focus:outline-none focus:border-red-600 text-sm transition"
              />
            </div>
            <div>
              <label className="text-zinc-400 text-xs uppercase tracking-widest block mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3 focus:outline-none focus:border-red-600 text-sm transition"
              />
            </div>

            {error && <p className="text-red-500 text-xs uppercase tracking-wide">{error}</p>}

            <button
              onClick={handleSubmit}
              className="w-full bg-red-600 hover:bg-white hover:text-black text-white font-black py-4 uppercase tracking-widest transition duration-300 text-sm mt-2"
            >
              {view === 'login' ? 'Entrar' : 'Crear Cuenta'}
            </button>

            <p className="text-center text-zinc-500 text-xs mt-4">
              {view === 'login' ? (
                <>
                  ¿No tenés cuenta?{' '}
                  <button
                    onClick={() => {
                      setView('register');
                      setError('');
                    }}
                    className="text-red-500 hover:text-white transition font-bold"
                  >
                    Registrate
                  </button>
                </>
              ) : (
                <>
                  ¿Ya tenés cuenta?{' '}
                  <button
                    onClick={() => {
                      setView('login');
                      setError('');
                    }}
                    className="text-red-500 hover:text-white transition font-bold"
                  >
                    Ingresá
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({
  product,
  onAddToCart,
  onDetail,
}: {
  product: ProductoUrban;
  onAddToCart: (product: ProductoUrban, selectedSize: string) => void;
  onDetail: (product: ProductoUrban) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [btnAnim, setBtnAnim] = useState(false);

  const productName = product.nombre || product.name || 'Producto';
  const productPrice = product.precio ?? product.price ?? 0;
  const productCategory = product.categoria || product.category || 'General';
  const productImage = product.imagenUrl || product.img || 'https://via.placeholder.com/600';
  const productTag = product.tag || 'NEW DROP';
  const productSizes = product.talles || product.sizes || ['Único'];
  const productColors = product.colores || product.colors || ['Negro'];

  const handleAdd = () => {
    onAddToCart(product, productSizes[0]);
    setBtnAnim(true);
    setTimeout(() => setBtnAnim(false), 600);
  };

  return (
    <div className="group flex flex-col">
      <div
        className="relative overflow-hidden bg-zinc-900 h-72 cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={productImage}
          alt={productName}
          className="w-full h-full object-cover transition duration-500"
          style={{
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
          }}
        />
        <span
          className={`absolute top-3 left-3 text-[10px] font-black px-3 py-1 uppercase tracking-widest z-10 ${TAG_COLORS[productTag] || 'bg-zinc-700 text-white'}`}
        >
          {productTag}
        </span>

        {/* overlay */}
        <div
          className="absolute inset-0 bg-black/50 flex items-center justify-center transition duration-300"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <button
            onClick={() => onDetail(product)}
            className="bg-white/90 hover:bg-red-600 hover:text-white text-black font-bold px-5 py-2 text-xs uppercase tracking-widest transition duration-200"
          >
            Ver detalles
          </button>
        </div>
      </div>

      <div className="mt-3 flex-1 flex flex-col">
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest">{productCategory}</p>
        <h4 className="font-black text-white text-sm uppercase tracking-tight leading-tight mt-0.5">
          {productName}
        </h4>
        <p className="text-zinc-400 text-[10px] mt-1">Colores: {productColors.join(', ')}</p>
        <p
          className="text-red-600 font-black text-lg mt-1"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          ${productPrice}.00
        </p>

        {/* action buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleAdd}
            className={`flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest transition duration-300 border ${
              btnAnim
                ? 'bg-green-600 border-green-600 text-white'
                : 'bg-red-600 border-red-600 hover:bg-white hover:text-black text-white'
            }`}
            style={{
              transform: btnAnim ? 'scale(0.95)' : 'scale(1)',
            }}
          >
            {btnAnim ? '✓ Añadido' : '+ Carrito'}
          </button>
          <button
            onClick={() => onDetail(product)}
            className="border border-zinc-700 text-zinc-400 hover:border-white hover:text-white px-3 transition"
            title="Ver detalles"
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── COUNTDOWN ────────────────────────────────────────────────────────────────
function Countdown() {
  const [time, setTime] = useState({ h: 47, m: 58, s: 42 });

  useEffect(() => {
    const id = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) {
          s = 59;
          m--;
        }
        if (m < 0) {
          m = 59;
          h--;
        }
        if (h < 0) {
          h = 47;
          m = 59;
          s = 59;
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex gap-2 items-center">
      {[pad(time.h), pad(time.m), pad(time.s)].map((val, i) => (
        <span key={i} className="flex items-center gap-2">
          <span
            className="bg-black text-white px-4 py-2 tabular-nums"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28 }}
          >
            {val}
          </span>
          {i < 2 && <span className="text-black font-black text-xl">:</span>}
        </span>
      ))}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function UrbanTiendzi({
  tienda,
  accent,
  fontFamily,
  themeConfig,
}: UrbanTiendziProps) {
  const [cart, setCart] = useState<CartItemUrban[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [detail, setDetail] = useState<ProductoUrban | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [filter, setFilter] = useState('Todos');

  const { agregarAlCarrito, eliminarItem } = useCarrito(tienda?.id || 0);
  const setTiendaId = useTiendaIDStore((s) => s.setTiendaId);
  const logout = useAuthSessionStore((s) => s.logout);

  useEffect(() => {
    if (tienda?.id) {
      setTiendaId(tienda.id);
    }
  }, [tienda?.id, setTiendaId]);

  const {
    data: productos,
    isLoading: productosLoading,
    isError: productosError,
  } = useStorefrontProductos(tienda?.id || 0);

  const allProducts: ProductoUrban[] = productos?.length ? productos : PRODUCTS;

  const categories = useMemo(
    () => ['Todos', ...new Set(allProducts.map((p) => p.category || p.categoria || 'Otros'))],
    [allProducts]
  );

  const filtered = useMemo(() => {
    if (!allProducts?.length) return [];
    if (filter === 'Todos') return allProducts;
    return allProducts.filter((p) => (p.category || p.categoria) === filter);
  }, [allProducts, filter]);

  const addToCart = useCallback(
    (product: ProductoUrban, selectedSize: string) => {
      setCart((prev) => {
        const idx = prev.findIndex((i) => i.id === product.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
          return next;
        }
        return [...prev, { ...product, qty: 1, selectedSize }];
      });

      if (tienda?.id) {
        agregarAlCarrito({ productoId: product.id, cantidad: 1, varianteId: null }).catch((error) =>
          console.error('Error al agregar al carrito', error)
        );
      }

      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 600);

      const id = Date.now();
      setToasts((prev) => [
        ...prev,
        {
          id,
          name: product.nombre || product.name || 'Producto',
          price: product.precio ?? product.price ?? 0,
          img: product.imagenUrl || product.img || 'https://via.placeholder.com/80',
        },
      ]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    },
    [tienda?.id, agregarAlCarrito]
  );

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
    if (tienda?.id) {
      eliminarItem(id).catch((error) => console.error('Error al eliminar item del carrito', error));
    }
  };

  const cartTotal = cart.reduce((s, i) => s + i.qty, 0);

  const resolvedAccent = accent || themeConfig?.primary || '#dc2626';

  return (
    <div style={{ '--urban-acento': resolvedAccent } as React.CSSProperties}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;700;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000; font-family: ${fontFamily ? `'${fontFamily}', sans-serif` : "'Barlow Condensed', sans-serif"}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #dc2626; }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes cartBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-8px) scale(1.15); }
          60% { transform: translateY(-3px) scale(1.05); }
        }
      `}</style>

      <Toast toasts={toasts} removeToast={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        removeFromCart={removeFromCart}
      />
      <DetailModal product={detail} onClose={() => setDetail(null)} onAddToCart={addToCart} />
      {authOpen && (
        <AuthModal onClose={() => setAuthOpen(false)} onLogin={(name) => setUser(name)} />
      )}

      {/* ── NAV ── */}
      <nav className="bg-black text-white sticky top-0 z-50 border-b-4 border-red-600">
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="flex items-center justify-between h-20">
            <span
              className="text-red-600"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 2 }}
            >
              URBAN <span style={{ color: '#fff' }}>TIENDZI</span>
            </span>

            <div className="hidden md:flex items-center gap-8">
              {['Productos', 'Nosotros', 'Contacto'].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="text-zinc-300 hover:text-red-500 transition text-xs uppercase font-black tracking-widest"
                >
                  {l}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 hover:text-red-500 transition"
                style={{ animation: cartBounce ? 'cartBounce 0.5s ease' : 'none' }}
              >
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {cartTotal > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {cartTotal}
                  </span>
                )}
              </button>

              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 text-xs uppercase tracking-wider hidden sm:block">
                    Hola, <span className="text-white font-black">{user}</span>
                  </span>
                  <button
                    onClick={() => {
                      setUser(null);
                      logout();
                    }}
                    className="border border-zinc-700 text-zinc-400 hover:text-white text-xs px-3 py-1.5 transition"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="bg-red-600 hover:bg-white hover:text-black text-white font-black py-2 px-6 transition duration-300 uppercase text-xs tracking-widest"
                >
                  Ingresar
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <header
        className="relative flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ height: '80vh', background: '#0a0a0a' }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=1600)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            opacity: 0.3,
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 40%, #000 100%)' }}
        />

        <div className="relative z-10 px-4">
          <p
            className="text-red-600 tracking-[0.4em] mb-3 text-sm font-black"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            NEW DROP 2026
          </p>
          <h1
            className="text-white leading-none mb-6"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(60px, 14vw, 160px)' }}
          >
            ESTILO SIN
            <br />
            <span className="text-red-600">LÍMITES</span>
          </h1>
          <button
            onClick={() => {
              const element = document.getElementById('products');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="border-2 border-white text-white hover:bg-white hover:text-black font-black py-3 px-12 transition duration-500 uppercase tracking-widest text-sm"
          >
            Comprar Ahora
          </button>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          <div className="w-10 h-1 bg-red-600" />
          <div className="w-10 h-1 bg-zinc-700" />
          <div className="w-10 h-1 bg-zinc-700" />
        </div>
      </header>

      {/* ── BANNER ── */}
      <section className="py-10 bg-red-600 text-white">
        <div
          style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}
          className="flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, lineHeight: 1 }}>
              OFERTAS DE TEMPORADA
            </p>
            <p className="text-red-200 text-xs uppercase tracking-widest mt-1">
              Hasta 40% OFF — Black Edition
            </p>
          </div>
          <Countdown />
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <main id="products" style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px' }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <h2
              className="text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, lineHeight: 1 }}
            >
              PRODUCTOS DESTACADOS
            </h2>
            <div className="w-16 h-1 bg-red-600 mt-2" />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest border transition ${
                  filter === c
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'border-zinc-700 text-zinc-500 hover:border-zinc-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {productosLoading && !allProducts.length ? (
          <div className="text-center text-white py-20">Cargando productos…</div>
        ) : productosError ? (
          <div className="text-center text-red-500 py-20">No se pueden cargar los productos.</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-white py-20">No hay productos disponibles aún.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} onDetail={setDetail} />
            ))}
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-zinc-950 text-white pt-20 pb-10 border-t-4 border-red-600">
        <div
          style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          <div className="md:col-span-1">
            <span
              className="text-red-600 block mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32 }}
            >
              URBAN TIENDZI
            </span>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              La marca definitiva para quienes no siguen reglas. Diseños exclusivos y el espíritu de
              la calle en cada prenda.
            </p>
            <div className="flex gap-5 mt-6">
              {['instagram', 'tiktok', 'facebook'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-zinc-500 hover:text-red-500 transition text-lg capitalize font-black text-xs uppercase tracking-widest"
                >
                  {s.slice(0, 2).toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-black uppercase mb-6 tracking-widest text-xs">Navegación</h5>
            <ul className="space-y-3 text-zinc-500 text-sm">
              {['Productos', 'Sobre Nosotros', 'Preguntas Frecuentes', 'Envíos'].map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-white transition">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-black uppercase mb-6 tracking-widest text-xs">Newsletter</h5>
            <div className="flex">
              <input
                type="text"
                placeholder="Tu email"
                className="bg-zinc-900 border border-zinc-700 px-4 py-2 w-full focus:outline-none focus:border-red-600 text-sm transition text-white"
              />
              <button className="bg-red-600 px-4 hover:bg-white hover:text-black transition text-sm font-black">
                →
              </button>
            </div>
            <p className="text-zinc-600 text-xs mt-3">Sin spam. Solo drops exclusivos.</p>
          </div>
        </div>

        <div
          className="text-center mt-16 text-zinc-700 text-xs border-t border-zinc-900 pt-8"
          style={{ maxWidth: 1280, margin: '64px auto 0', padding: '32px 24px 0' }}
        >
          © 2026 URBAN TIENDZI. TODOS LOS DERECHOS RESERVADOS.
        </div>
      </footer>
    </div>
  );
}
