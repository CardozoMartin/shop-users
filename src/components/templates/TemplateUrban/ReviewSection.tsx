import { useState, useRef } from 'react';
import { useAuthSessionStore } from '../../../store/useAuthSession';
import { useResenasProducto, useEstadisticasResenaProducto, useCrearResenaProducto } from '../../../hooks/useResenas';
import type { ThemeProps } from './Types';

interface ReviewSectionProps {
  productoId: number;
  onLogin: () => void;
  theme?: ThemeProps;
}

const StarRating = ({
  value,
  onChange,
  acento = '#ff0000',
  readOnly = false,
  size = 18,
}: {
  value: number;
  onChange?: (v: number) => void;
  acento?: string;
  readOnly?: boolean;
  size?: number;
}) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${readOnly ? 'cursor-default' : 'cursor-pointer'} transition-transform hover:scale-110`}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
        >
          <svg width={size} height={size} viewBox="0 0 24 24"
            fill={(hovered || value) >= star ? acento : 'none'}
            stroke={(hovered || value) >= star ? acento : '#444'}
            strokeWidth="2">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        </span>
      ))}
    </div>
  );
};

const ReviewCard = ({ resena }: { resena: any }) => {
  const fecha = new Date(resena.creadoEn).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
  const nombre = resena.autorNombre || resena.usuario?.nombre || 'USER_ANON';

  return (
    <div className="bg-zinc-950 border border-zinc-900 p-6 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="text-white text-[10px] font-black uppercase tracking-widest font-syncopate">
            {nombre}
          </span>
          <StarRating value={resena.calificacion} readOnly size={12} />
        </div>
        <span className="text-zinc-600 text-[9px] font-black uppercase tracking-tighter">{fecha}</span>
      </div>

      {resena.comentario && (
        <p className="text-zinc-400 text-xs leading-relaxed uppercase font-barlow">
          {resena.comentario}
        </p>
      )}

      {resena.imagenUrl && (
        <div className="mt-2 border border-zinc-800 p-1 inline-block">
          <img
            src={resena.imagenUrl}
            alt="Review visual"
            className="max-w-[200px] grayscale hover:grayscale-0 transition-all duration-500"
          />
        </div>
      )}
    </div>
  );
};

const ReviewSection = ({ productoId, onLogin }: ReviewSectionProps) => {
  const cliente = useAuthSessionStore((s) => s.cliente);
  const isLoggedIn = !!cliente;

  const { data: resenas = [], isLoading } = useResenasProducto(productoId);
  const { data: stats } = useEstadisticasResenaProducto(productoId);
  const { mutate: crearResena, isPending } = useCrearResenaProducto(productoId);

  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImagen(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    crearResena(
      { calificacion: rating, comentario: comentario || undefined, imagen },
      {
        onSuccess: () => {
          setRating(0);
          setComentario('');
          setImagen(null);
          setPreviewUrl(null);
          if (fileRef.current) fileRef.current.value = '';
        },
      }
    );
  };

  return (
    <section className="mt-20 pt-16 border-t border-zinc-900" id="resenas-producto">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h3 className="text-white text-5xl uppercase leading-none mb-2 font-bebas">FEEDBACK_LOOP</h3>
          <div className="w-16 h-1 bg-red-600" />
        </div>
        
        {stats && stats.total > 0 && (
          <div className="text-right">
            <div className="text-red-600 text-4xl font-black font-bebas leading-none">
              {stats.promedio} / 5.0
            </div>
            <div className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
              BASE_ON_{stats.total}_SAMPLES
            </div>
          </div>
        )}
      </div>

      {/* Grid: Form + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
        {/* Stats Column */}
        <div className="bg-zinc-950 border border-zinc-900 p-8">
           <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6 font-syncopate">METRICS</h4>
           <div className="space-y-4">
            {[5, 4, 3, 2, 1].map((star) => {
              const entry = stats?.distribucion?.find((d: any) => d.calificacion === star);
              const cantidad = entry?.cantidad ?? 0;
              const pct = (stats?.total ?? 0) > 0 ? (cantidad / stats.total) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-4 group">
                  <span className="text-[10px] text-zinc-600 font-black w-2">{star}</span>
                  <div className="flex-1 h-1 bg-zinc-900 overflow-hidden">
                    <div 
                        className="h-full bg-red-600 transition-all duration-1000" 
                        style={{ width: `${pct}%` }} 
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-black w-4 text-right">{cantidad}</span>
                </div>
              );
            })}
           </div>
        </div>

        {/* Input Column */}
        <div className="lg:col-span-2">
            {isLoggedIn ? (
                <div className="bg-zinc-950 border border-zinc-900 p-8 space-y-8">
                   <div className="flex items-center justify-between">
                     <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] font-syncopate">LOG_YOUR_EXPERIENCE</h4>
                     <StarRating value={rating} onChange={setRating} size={20} />
                   </div>

                   <textarea
                     value={comentario}
                     onChange={(e) => setComentario(e.target.value)}
                     placeholder="DATA_INPUT: ESCRIBÍ TU RESEÑA AQUÍ..."
                     rows={4}
                     className="w-full bg-black border border-zinc-900 text-white p-5 text-sm uppercase font-barlow focus:outline-none focus:border-red-600 transition-all resize-none"
                   />

                   <div className="flex flex-wrap items-center justify-between gap-6">
                      <div className="relative">
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <button className="bg-transparent border border-zinc-800 text-zinc-500 hover:text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all">
                          {previewUrl ? 'PHOTO_ATTACHED' : 'UPLOAD_VISUAL_PROOF'}
                        </button>
                      </div>

                      <button
                        onClick={handleSubmit}
                        disabled={rating === 0 || isPending}
                        className="bg-red-600 hover:bg-white hover:text-black text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {isPending ? 'TRANSMITTING...' : 'POST_LOG'}
                      </button>
                   </div>

                   {previewUrl && (
                     <div className="mt-4 p-2 border border-zinc-900 inline-block relative group">
                        <img src={previewUrl} alt="Preview" className="max-w-[150px] grayscale" />
                        <button
                          onClick={() => { setImagen(null); setPreviewUrl(null); if (fileRef.current) fileRef.current.value = ''; }}
                          className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 flex items-center justify-center text-xs font-black rounded-none border-none cursor-pointer"
                        >×</button>
                     </div>
                   )}
                </div>
            ) : (
                <div className="bg-zinc-950 border-2 border-dashed border-zinc-900 p-12 text-center flex flex-col items-center justify-center h-full">
                   <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-6">REVIEWS_ARE_LOCKED_FOR_GUESTS</p>
                   <button
                     onClick={onLogin}
                     className="bg-white text-black hover:bg-red-600 hover:text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
                   >
                     AUTH_REQUIRED.EXE
                   </button>
                </div>
            )}
        </div>
      </div>

      {/* List of Reviews */}
      <h4 className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8 font-syncopate">ARCHIVED_REPORTS</h4>
      
      {isLoading ? (
        <div className="animate-pulse space-y-4">
            <div className="h-32 bg-zinc-950 w-full" />
            <div className="h-32 bg-zinc-950 w-full" />
        </div>
      ) : resenas.length === 0 ? (
        <div className="py-20 border border-zinc-900 text-center uppercase text-zinc-700 text-[10px] font-black tracking-[0.5em]">
          NO_DATA_AVAILABLE_IN_THIS_SECTOR
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resenas.map((r: any) => (
            <ReviewCard key={r.id} resena={r} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewSection;
