import { useState } from 'react';
import type { Producto } from './Types';

const TAG_COLORS: Record<string, string> = {
  'BEST SELLER': 'bg-yellow-400 text-black',
  'NEW DROP': 'bg-red-600 text-white',
  LIMITED: 'bg-purple-600 text-white',
  OFERTA: 'bg-green-600 text-white',
};

export default function ProductCard({
  product,
  onAddToCart,
  onDetail,
}: {
  product: Producto;
  onAddToCart: (p: Producto, size: string) => void;
  onDetail: (p: Producto) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [btnAnim, setBtnAnim] = useState(false);

  const productName = product.nombre || product.name || 'Producto';
  const productPrice = product.precio ?? product.price ?? 0;
  const productCategory = (product.categoria as any)?.nombre || product.category || 'General';
  const productImage = product.imagenPrincipalUrl || product.imagenUrl || product.img || 'https://via.placeholder.com/600';
  const productTag = product.tag || 'NEW DROP';
  const productSizes = product.talles || product.sizes || ['Único'];
  const productColors = product.colores || product.colors || ['Negro'];

  const handleAdd = () => {
    onAddToCart(product, productSizes[0]);
    setBtnAnim(true);
    setTimeout(() => setBtnAnim(false), 600);
  };

  return (
    <div className="group flex flex-col h-full bg-zinc-950 border border-zinc-900 overflow-hidden">
      <div
        className="relative overflow-hidden bg-zinc-900 h-80 cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onDetail(product)}
      >
        <img
          src={productImage}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
        />
        <span
          className={`absolute top-3 left-3 text-[10px] font-black px-3 py-1 uppercase tracking-widest z-10 ${TAG_COLORS[productTag] || 'bg-zinc-700 text-white'}`}
        >
          {productTag}
        </span>

        <div
          className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 pointer-events-none"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <span className="bg-white text-black font-black px-5 py-2 text-[10px] uppercase tracking-widest transition duration-200">
            Ver detalles
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-auto">
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">{productCategory}</p>
          <h4 className="font-black text-white text-sm uppercase tracking-tight leading-tight mt-1">
            {productName}
          </h4>
          <p className="text-zinc-500 text-[10px] mt-1 uppercase font-bold">
            {productColors.length > 0 ? `Colores: ${productColors.join(', ')}` : ''}
          </p>
        </div>

        <div className="mt-4">
          <p className="text-red-600 font-black text-2xl mb-3 font-bebas">
            ${productPrice}.00
          </p>

          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); handleAdd(); }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition duration-300 border-none cursor-pointer ${
                btnAnim
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 hover:bg-white hover:text-black text-white'
              }`}
              style={{ transform: btnAnim ? 'scale(0.95)' : 'scale(1)' }}
            >
              {btnAnim ? '✓ Añadido' : '+ Carrito'}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDetail(product); }}
              className="bg-transparent border border-zinc-700 text-zinc-500 hover:border-white hover:text-white px-3 transition cursor-pointer"
              title="Ver detalles"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
