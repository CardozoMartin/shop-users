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
  acento,
  readOnly = false,
  size = 22,
}: {
  value: number;
  onChange?: (v: number) => void;
  acento: string;
  readOnly?: boolean;
  size?: number;
}) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ cursor: readOnly ? 'default' : 'pointer', lineHeight: 1 }}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
        >
          <svg width={size} height={size} viewBox="0 0 24 24"
            fill={(hovered || value) >= star ? acento : 'none'}
            stroke={(hovered || value) >= star ? acento : '#b0b0b0'}
            strokeWidth="1.5">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        </span>
      ))}
    </div>
  );
};

const ReviewCard = ({ resena, theme }: { resena: any; theme: ThemeProps }) => {
  const { surface2, border, txt, muted, acento = '#6366f1' } = theme;
  const fecha = new Date(resena.creadoEn).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
  const nombre = resena.autorNombre || resena.usuario?.nombre || 'Cliente';

  return (
    <div style={{
      background: surface2,
      border: `1px solid ${border}`,
      borderRadius: 16,
      padding: '1.25rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontWeight: 600, color: txt, fontSize: '0.95rem', fontFamily: "'DM Sans', sans-serif" }}>
            {nombre}
          </span>
          <StarRating value={resena.calificacion} acento={acento} readOnly size={16} />
        </div>
        <span style={{ color: muted, fontSize: '0.78rem', fontFamily: "'DM Sans', sans-serif" }}>{fecha}</span>
      </div>

      {resena.comentario && (
        <p style={{ color: txt, fontSize: '0.9rem', lineHeight: 1.6, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
          {resena.comentario}
        </p>
      )}

      {resena.imagenUrl && (
        <img
          src={resena.imagenUrl}
          alt="Imagen de reseña"
          style={{ maxWidth: 220, borderRadius: 10, objectFit: 'cover', border: `1px solid ${border}` }}
        />
      )}
    </div>
  );
};

const ReviewSection = ({ productoId, onLogin, theme = {} }: ReviewSectionProps) => {
  const {
    surface = 'var(--gor-surface)',
    surface2 = 'var(--gor-surface2)',
    txt = 'var(--gor-txt)',
    muted = 'var(--gor-muted)',
    border = 'var(--gor-border)',
    acento = 'var(--gor-acento)',
    btnTxt = 'var(--gor-btn-txt)',
  } = theme;

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

  const sectionStyle: React.CSSProperties = {
    marginTop: '3.5rem',
    paddingTop: '2.5rem',
    borderTop: `1.5px solid ${border}`,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(1.4rem, 2vw, 1.8rem)',
    color: txt,
    marginBottom: '1.5rem',
    fontWeight: 700,
  };

  return (
    <section style={sectionStyle} id="resenas-producto">
      <h3 style={titleStyle}>Reseñas del producto</h3>

      {/* Stats */}
      {stats && stats.total > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          marginBottom: '2rem',
          background: surface2,
          borderRadius: 16,
          padding: '1rem 1.5rem',
          border: `1px solid ${border}`,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: acento, fontFamily: "'Playfair Display', serif", lineHeight: 1.1 }}>
              {stats.promedio}
            </div>
            <StarRating value={Math.round(stats.promedio)} acento={acento} readOnly size={18} />
            <div style={{ fontSize: '0.8rem', color: muted, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>
              {stats.total} {stats.total === 1 ? 'reseña' : 'reseñas'}
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[5, 4, 3, 2, 1].map((star) => {
              const entry = stats.distribucion?.find((d: any) => d.calificacion === star);
              const cantidad = entry?.cantidad ?? 0;
              const pct = stats.total > 0 ? (cantidad / stats.total) * 100 : 0;
              return (
                <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: muted, fontSize: '0.78rem', width: 12, fontFamily: "'DM Sans', sans-serif" }}>{star}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={acento} stroke="none">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                  <div style={{ flex: 1, height: 6, borderRadius: 99, background: `${acento}20`, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: acento, borderRadius: 99, transition: 'width 0.4s' }} />
                  </div>
                  <span style={{ color: muted, fontSize: '0.75rem', width: 18, textAlign: 'right', fontFamily: "'DM Sans', sans-serif" }}>{cantidad}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Formulario */}
      {isLoggedIn ? (
        <div style={{
          background: surface,
          border: `1.5px solid ${border}`,
          borderRadius: 20,
          padding: '1.5rem',
          marginBottom: '2rem',
        }}>
          <p style={{ fontWeight: 600, color: txt, marginBottom: '1rem', fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem' }}>
            Dejá tu reseña
          </p>

          {/* Estrellas */}
          <div style={{ marginBottom: '1rem' }}>
            <StarRating value={rating} onChange={setRating} acento={acento} />
            {rating === 0 && (
              <span style={{ fontSize: '0.78rem', color: muted, marginTop: 4, display: 'block', fontFamily: "'DM Sans', sans-serif" }}>
                Seleccioná una calificación
              </span>
            )}
          </div>

          {/* Comentario */}
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Contá tu experiencia con este producto (opcional)..."
            rows={3}
            style={{
              width: '100%',
              borderRadius: 12,
              border: `1.5px solid ${border}`,
              background: surface2,
              color: txt,
              padding: '0.75rem 1rem',
              fontSize: '0.9rem',
              fontFamily: "'DM Sans', sans-serif",
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          {/* Imagen */}
          <div style={{ marginTop: '1rem' }}>
            <label style={{ fontSize: '0.85rem', color: muted, fontFamily: "'DM Sans', sans-serif", display: 'block', marginBottom: 6 }}>
              📷 Adjuntá una foto (opcional)
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ fontSize: '0.85rem', color: txt, fontFamily: "'DM Sans', sans-serif" }}
            />
            {previewUrl && (
              <div style={{ marginTop: 10, position: 'relative', display: 'inline-block' }}>
                <img src={previewUrl} alt="Vista previa" style={{ maxWidth: 180, borderRadius: 10, border: `1px solid ${border}` }} />
                <button
                  onClick={() => { setImagen(null); setPreviewUrl(null); if (fileRef.current) fileRef.current.value = ''; }}
                  style={{
                    position: 'absolute', top: -8, right: -8,
                    background: '#ff4d4f', border: 'none', borderRadius: '50%',
                    width: 22, height: 22, color: '#fff', cursor: 'pointer', fontSize: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >×</button>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={rating === 0 || isPending}
            style={{
              marginTop: '1.25rem',
              background: rating === 0 ? `${acento}60` : acento,
              color: btnTxt,
              border: 'none',
              borderRadius: 999,
              padding: '0.65rem 1.75rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: rating === 0 || isPending ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'opacity 0.2s',
            }}
          >
            {isPending ? 'Enviando...' : 'Enviar reseña'}
          </button>
        </div>
      ) : (
        <div style={{
          background: `${acento}10`,
          border: `1.5px dashed ${acento}50`,
          borderRadius: 16,
          padding: '1.5rem',
          textAlign: 'center',
          marginBottom: '2rem',
        }}>
          <p style={{ color: txt, marginBottom: '0.75rem', fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem' }}>
            ✍️ ¿Querés dejar tu reseña?
          </p>
          <button
            onClick={onLogin}
            style={{
              background: acento,
              color: btnTxt,
              border: 'none',
              borderRadius: 999,
              padding: '0.6rem 1.5rem',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Iniciá sesión para comentar
          </button>
        </div>
      )}

      {/* Lista de reseñas */}
      {isLoading ? (
        <p style={{ color: muted, fontFamily: "'DM Sans', sans-serif", textAlign: 'center' }}>Cargando reseñas...</p>
      ) : resenas.length === 0 ? (
        <p style={{ color: muted, fontFamily: "'DM Sans', sans-serif", textAlign: 'center', padding: '1.5rem 0' }}>
          Todavía no hay reseñas para este producto. ¡Sé el primero en comentar!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {resenas.map((r: any) => (
            <ReviewCard key={r.id} resena={r} theme={theme} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewSection;
