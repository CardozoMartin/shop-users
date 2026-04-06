import { useState } from 'react';
import {
  useCrearResenaTienda,
  useEstadisticasResenaTienda,
  useResenasTienda,
} from '../../../hooks/useResenas';
import { useAuthSessionStore } from '../../../store/useAuthSession';

interface StoreReviewSectionProps {
  tiendaId: number;
  onLogin: () => void;
  acento?: string;
}

const StarRating = ({
  value,
  onChange,
  acento = '#dc2626',
  readOnly = false,
  size = 20,
}: {
  value: number;
  onChange?: (v: number) => void;
  acento?: string;
  readOnly?: boolean;
  size?: number;
}) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ cursor: readOnly ? 'default' : 'pointer', lineHeight: 1 }}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={(hovered || value) >= star ? acento : 'none'}
            stroke={(hovered || value) >= star ? acento : '#3f3f46'}
            strokeWidth="2"
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        </span>
      ))}
    </div>
  );
};

export default function StoreReviewSection({
  tiendaId,
  onLogin,
  acento = '#dc2626',
}: StoreReviewSectionProps) {
  const cliente = useAuthSessionStore((s) => s.cliente);
  const isLoggedIn = !!cliente;

  const { data: resenasData, isLoading, isError } = useResenasTienda(tiendaId);
  const { data: stats } = useEstadisticasResenaTienda(tiendaId);
  const { mutate: crearResena, isPending } = useCrearResenaTienda(tiendaId);

  const resenas = resenasData ?? [];
  const totalReviews = stats?.total ?? 0;

  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState('');

  const handleSubmit = () => {
    if (rating === 0) return;
    crearResena(
      { calificacion: rating, comentario: comentario || undefined },
      {
        onSuccess: () => {
          setRating(0);
          setComentario('');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center bg-black border-t border-zinc-900">
        <p className="animate-pulse text-zinc-500 uppercase tracking-[0.3em] text-[10px] font-black">
          Sincronizando Reseñas...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center bg-black border-t border-zinc-900">
        <p className="text-red-600 uppercase tracking-[0.3em] text-[10px] font-black">
          No se pudieron cargar las reseñas. Volvé a intentarlo en unos minutos.
        </p>
      </div>
    );
  }

  return (
    <section className="bg-black py-24 px-6 border-t border-zinc-900" id="resenas">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <h2
              className="text-white text-5xl leading-none uppercase"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              FEEDBACK_CLIENTES
            </h2>
            <div className="w-12 h-1 bg-red-600 mt-2" />
          </div>

          {totalReviews > 0 ? (
            <div className="flex items-center gap-6 bg-zinc-950 p-4 border border-zinc-900">
              <div
                className="text-5xl font-black text-white leading-none"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {stats?.promedio.toFixed(1)}
              </div>
              <div className="flex flex-col gap-1">
                <StarRating value={Math.round(stats?.promedio ?? 0)} acento={acento} readOnly />
                <span className="text-zinc-600 uppercase text-[9px] font-black tracking-widest">
                  BASADO EN {totalReviews} {totalReviews === 1 ? 'RESEÑA' : 'RESEÑAS'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-6 bg-zinc-950 p-4 border border-zinc-900">
              <div className="text-zinc-400 uppercase text-[10px] tracking-[0.3em] font-black">
                Aún no hay reseñas disponibles. Sé el primero en dejar tu opinión.
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {resenas.map((r: any) => (
            <div
              key={r.id}
              className="bg-zinc-950 border border-zinc-900 p-8 flex flex-col gap-4 relative group hover:border-zinc-700 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="uppercase font-black text-white text-[11px] tracking-widest">
                  {r.autorNombre || r.usuario?.nombre || 'ANONYMOUS_USER'}
                </div>
                <div className="text-zinc-700 text-[9px] font-bold">
                  {new Date(r.creadoEn).toLocaleDateString()}
                </div>
              </div>
              <StarRating value={r.calificacion} acento={acento} readOnly size={16} />
              {r.comentario && (
                <p className="text-zinc-400 text-xs italic leading-relaxed">"{r.comentario}"</p>
              )}
              <div className="absolute top-0 right-0 w-1 h-0 bg-red-600 group-hover:h-full transition-all duration-300" />
            </div>
          ))}

          {resenas.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-zinc-900">
              <p className="text-zinc-700 uppercase tracking-widest text-xs font-black">
                Sin reseñas por el momento. Rompé el hielo.
              </p>
            </div>
          )}
        </div>

        <div className="max-w-2xl mx-auto">
          {isLoggedIn ? (
            <div className="bg-zinc-950 border-4 border-white p-10">
              <h3
                className="text-white text-3xl font-black uppercase mb-8 text-center"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                DEJANOS TU OPINIÓN
              </h3>

              <div className="flex justify-center mb-8">
                <StarRating value={rating} onChange={setRating} acento={acento} size={32} />
              </div>

              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="ESCRIBÍ TU COMENTARIO AQUÍ..."
                rows={4}
                className="w-full bg-black border border-zinc-800 text-white p-5 text-xs font-bold focus:border-white focus:outline-none placeholder-zinc-800 tracking-widest uppercase transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              />

              <button
                onClick={handleSubmit}
                disabled={rating === 0 || isPending}
                className={`w-full mt-8 py-5 font-black uppercase tracking-widest transition-all duration-300 ${
                  rating === 0 || isPending
                    ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-red-600 hover:text-white'
                }`}
              >
                {isPending ? 'ENVIANDO...' : 'PUBLICAR_RESEÑA'}
              </button>
            </div>
          ) : (
            <div className="bg-red-600 p-12 text-center text-white">
              <p
                className="font-black uppercase tracking-[0.2em] text-sm mb-6"
                style={{ fontFamily: "'Syncopate', sans-serif" }}
              >
                ¿TENÉS ALGO QUE DECIR?
              </p>
              <button
                onClick={onLogin}
                className="bg-black text-white font-black py-4 px-12 transition hover:bg-white hover:text-black uppercase tracking-widest text-xs border-none cursor-pointer"
              >
                INICIAR SESIÓN PARA COMENTAR
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
