import { useState } from 'react';
import { useStorefrontCategorias, useStorefrontNormales } from '../../../hooks/useStorefrontProducts';

export default function FullProductCatalog({
  onCart,
  onSelect,
  tiendaId,
}: {
  onCart: (p: any, qty?: number, varianteId?: number) => void;
  onSelect: (p: any) => void;
  tiendaId: number;
}) {
  const [cat, setCat] = useState<number | 'Todo'>('Todo');
  const [hov, setHov] = useState<number | null>(null);

  const tiendaIdNum = Number(tiendaId);
  const { data: categoriasData } = useStorefrontCategorias(tiendaIdNum);
  const categorias = categoriasData || [];

  const { data: productosData } = useStorefrontNormales(tiendaIdNum, {
    categoriaId: cat !== 'Todo' ? cat : undefined,
  });
  
  const productos = productosData?.datos || [];

  return (
    <div style={{ maxWidth: '1060px', margin: '0 auto', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '.75rem',
              marginBottom: '.6rem',
            }}
          >
            <div style={{ width: '1.6rem', height: '1px', background: 'var(--acc-acento)' }} />
            <span
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: '.58rem',
                letterSpacing: '.26em',
                textTransform: 'uppercase',
                color: 'var(--acc-acento)',
                fontWeight: 500,
              }}
            >
              Colección Completa
            </span>
          </div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 'clamp(1.8rem,3.5vw,3rem)',
              fontWeight: 300,
              color: 'var(--acc-txt)',
              lineHeight: 1,
            }}
          >
             Nuestras <em style={{ fontStyle: 'italic', color: 'var(--acc-acento)' }}>Piezas</em>
          </h2>
        </div>
        <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '.7rem', color: 'var(--acc-subtle)' }}>
          {productosData?.total || 0} disponibles
        </span>
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <button
          onClick={() => setCat('Todo')}
          style={{
            padding: '6px 16px',
            borderRadius: '20px',
            border: `0.5px solid ${cat === 'Todo' ? 'var(--acc-acento)' : 'var(--acc-border)'}`,
            background: cat === 'Todo' ? 'rgba(181, 131, 90, 0.1)' : 'transparent',
            color: cat === 'Todo' ? 'var(--acc-acento)' : 'var(--acc-muted)',
            fontFamily: "'Jost',sans-serif",
            fontSize: '.7rem',
            fontWeight: cat === 'Todo' ? 500 : 300,
            cursor: 'pointer',
            transition: 'all .18s',
          }}
        >
          Todo
        </button>
        {categorias.map((c: any) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: `0.5px solid ${c.id === cat ? 'var(--acc-acento)' : 'var(--acc-border)'}`,
              background: c.id === cat ? 'rgba(181, 131, 90, 0.1)' : 'transparent',
              color: c.id === cat ? 'var(--acc-acento)' : 'var(--acc-muted)',
              fontFamily: "'Jost',sans-serif",
              fontSize: '.7rem',
              fontWeight: c.id === cat ? 500 : 300,
              cursor: 'pointer',
              transition: 'all .18s',
            }}
          >
            {c.nombre}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))',
          gap: '20px',
        }}
      >
        {productos.map((p: any, i: number) => (
          <div
            key={p.id}
            onClick={() => onSelect(p)}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
          >
            <div
              style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                aspectRatio: '1',
                background: 'var(--acc-surface)',
                boxShadow: hov === i ? `0 8px 32px rgba(181, 131, 90, 0.15)` : `0 2px 8px rgba(0,0,0,0.05)`,
                transition: 'box-shadow .3s',
              }}
            >
              <img
                src={p.imagenPrincipalUrl || 'https://via.placeholder.com/600'}
                alt={p.nombre}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: hov === i ? 'scale(1.06)' : 'scale(1)',
                  transition: 'transform .5s ease',
                }}
              />
              
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '10px',
                  background: `linear-gradient(to top, var(--acc-bg) 0%, transparent 55%)`,
                  opacity: hov === i ? 1 : 0,
                  transition: 'opacity .3s',
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCart(p, 1);
                  }}
                  style={{
                    width: '100%',
                    padding: '9px',
                    background: 'var(--acc-acento)',
                    color: 'var(--acc-btn-txt)',
                    border: 'none',
                    borderRadius: '8px',
                    fontFamily: "'Jost',sans-serif",
                    fontSize: '.62rem',
                    fontWeight: 600,
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Agregar al carrito
                </button>
              </div>
              
              {p.destacado && (
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(181, 131, 90, 0.1)',
                    border: `0.5px solid var(--acc-acento)`,
                    borderRadius: '20px',
                    padding: '3px 10px',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '.56rem',
                      color: 'var(--acc-acento)',
                      letterSpacing: '.12em',
                      textTransform: 'uppercase',
                      fontWeight: 500,
                    }}
                  >
                    Destacado
                  </span>
                </div>
              )}
            </div>

            <div style={{ marginTop: '10px', padding: '0 3px' }}>
              <p
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: '.78rem',
                  fontWeight: 300,
                  color: 'var(--acc-muted)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: '2px',
                }}
              >
                {p.nombre}
              </p>
              <p
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: '.62rem',
                  color: 'var(--acc-subtle)',
                  marginBottom: '4px',
                }}
              >
                {p.categoria?.nombre || 'General'}
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                {p.precioOferta && Number(p.precioOferta) > 0 && Number(p.precioOferta) < Number(p.precio) && (
                  <span
                    style={{ fontSize: '.68rem', color: 'var(--acc-subtle)', textDecoration: 'line-through' }}
                  >
                    ${Number(p.precio).toLocaleString()}
                  </span>
                )}
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: '1.2rem',
                    fontWeight: 300,
                    color: 'var(--acc-acento)',
                  }}
                >
                  ${Number(p.precioOferta && Number(p.precioOferta)>0 ? p.precioOferta : p.precio).toLocaleString()}
                </span>
                {p.precioOferta && Number(p.precioOferta) > 0 && Number(p.precioOferta) < Number(p.precio) && (
                  <span
                    style={{
                      background: 'rgba(181, 131, 90, 0.1)',
                      color: 'var(--acc-acento)',
                      fontSize: '.56rem',
                      fontWeight: 600,
                      padding: '2px 7px',
                      borderRadius: '20px',
                    }}
                  >
                    -{Math.round((1 - Number(p.precioOferta) / Number(p.precio)) * 100)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
