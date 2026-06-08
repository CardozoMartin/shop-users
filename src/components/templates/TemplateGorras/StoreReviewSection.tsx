import { useState } from 'react';
import { useAuthSessionStore } from '../../../store/useAuthSession';
import { useResenasTienda, useEstadisticasResenaTienda, useCrearResenaTienda } from '../../../hooks/useResenas';
import type { ThemeProps } from './Types';

interface StoreReviewSectionProps {
  tiendaId: number;
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

const StoreReviewSection = ({ tiendaId, onLogin, theme = {} }: StoreReviewSectionProps) => {
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

  const { data: resenas = [], isLoading } = useResenasTienda(tiendaId);
  const { data: stats } = useEstadisticasResenaTienda(tiendaId);
  const { mutate: crearResena, isPending } = useCrearResenaTienda(tiendaId);

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

  const sectionBg = {
    background: 'var(--gor-bg)',
    padding: '4rem 1.5rem',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: 860,
    margin: '0 auto',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
    color: txt,
    marginBottom: '2rem',
    fontWeight: 700,
    textAlign: 'center',
  };

  return (
    <section id="resenas-tienda" style={sectionBg}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>Lo que dicen nuestros clientes</h2>

        {/* Stats resumen */}
        {stats && stats.total > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.5rem',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: acento, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
                {stats.promedio}
              </div>
              <div style={{ marginTop: 6 }}>
                <StarRating value={Math.round(stats.promedio)} acento={acento} readOnly size={20} />
              </div>
              <div style={{ fontSize: '0.82rem', color: muted, marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}>
                Basado en {stats.total} {stats.total === 1 ? 'reseña' : 'reseñas'}
              </div>
            </div>
          </div>
        )}

        {/* Grid de reseñas */}
        {isLoading ? (
          <p style={{ textAlign: 'center', color: muted, fontFamily: "'DM Sans', sans-serif" }}>Cargando reseñas...</p>
        ) : resenas.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}>
            {resenas.map((r: any) => {
              const fecha = new Date(r.creadoEn).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
              const nombre = r.autorNombre || r.usuario?.nombre || 'Cliente';
              return (
                <div key={r.id} style={{
                  background: surface2,
                  border: `1px solid ${border}`,
                  borderRadius: 18,
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                    <span style={{ fontWeight: 600, color: txt, fontSize: '0.95rem', fontFamily: "'DM Sans', sans-serif" }}>
                      {nombre}
                    </span>
                    <span style={{ color: muted, fontSize: '0.75rem', fontFamily: "'DM Sans', sans-serif" }}>{fecha}</span>
                  </div>
                  <StarRating value={r.calificacion} acento={acento} readOnly size={15} />
                  {r.comentario && (
                    <p style={{ color: txt, fontSize: '0.88rem', lineHeight: 1.6, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                      "{r.comentario}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: muted, fontFamily: "'DM Sans', sans-serif", marginBottom: '2.5rem' }}>
            Todavía no hay reseñas. ¡Sé el primero en compartir tu experiencia!
          </p>
        )}

        {/* Formulario o CTA login */}
        {isLoggedIn ? (
          <div style={{
            background: surface,
            border: `1.5px solid ${border}`,
            borderRadius: 20,
            padding: '1.75rem',
            maxWidth: 520,
            margin: '0 auto',
          }}>
            <p style={{ fontWeight: 600, color: txt, marginBottom: '1rem', fontFamily: "'DM Sans', sans-serif", textAlign: 'center' }}>
              Compartí tu experiencia con la tienda
            </p>

            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
              <StarRating value={rating} onChange={setRating} acento={acento} size={26} />
            </div>

            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="¿Cómo fue tu experiencia? (opcional)..."
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

            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <button
                onClick={handleSubmit}
                disabled={rating === 0 || isPending}
                style={{
                  background: rating === 0 ? `${acento}60` : acento,
                  color: btnTxt,
                  border: 'none',
                  borderRadius: 999,
                  padding: '0.65rem 2rem',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: rating === 0 || isPending ? 'not-allowed' : 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {isPending ? 'Enviando...' : 'Publicar reseña'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            background: `${acento}10`,
            border: `1.5px dashed ${acento}40`,
            borderRadius: 16,
            padding: '1.5rem',
            maxWidth: 400,
            margin: '0 auto',
          }}>
            <p style={{ color: txt, marginBottom: '0.75rem', fontFamily: "'DM Sans', sans-serif" }}>
              ¿Querés dejar tu opinión sobre la tienda?
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
              Iniciá sesión para opinar
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default StoreReviewSection;
