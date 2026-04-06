import { useAuthSessionStore } from '../../../store/useAuthSession';

export default function AccountView({
  onBack,
  onLogout,
}: {
  onBack: () => void;
  onLogout: () => void;
}) {
  const { cliente } = useAuthSessionStore();

  return (
    <div
      style={{
        padding: '6rem 2rem',
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        background: 'var(--acc-bg)',
      }}
    >
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--acc-acento)',
            cursor: 'pointer',
            marginBottom: '2rem',
            fontFamily: "'Jost', sans-serif",
          }}
        >
          ← Volver al inicio
        </button>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2.4rem',
            color: 'var(--acc-txt)',
            marginBottom: '2rem',
            fontWeight: 300,
          }}
        >
          Mi Cuenta
        </h2>
        <div
          style={{
            background: 'var(--acc-surface2)',
            padding: '2rem',
            borderRadius: '12px',
            border: `1px solid var(--acc-border)`,
            fontFamily: "'Jost', sans-serif",
          }}
        >
          <p style={{ color: 'var(--acc-txt)', marginBottom: '1rem' }}>
            <strong>Email:</strong> {cliente?.email}
          </p>
          <p style={{ color: 'var(--acc-txt)', marginBottom: '1rem' }}>
            <strong>Nombre:</strong> {cliente?.nombre} {cliente?.apellido}
          </p>
          <p style={{ color: 'var(--acc-txt)', marginBottom: '2rem' }}>
            <strong>Teléfono:</strong> {cliente?.telefono}
          </p>
          <button
            onClick={onLogout}
            style={{
              padding: '10px 20px',
              background: 'var(--acc-acento)',
              color: 'var(--acc-btn-txt)',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
