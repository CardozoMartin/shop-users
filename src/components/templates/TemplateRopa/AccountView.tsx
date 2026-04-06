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
      className="pt-24 pb-24 px-8 min-h-[80vh] flex justify-center"
      style={{ background: 'var(--rop-bg)' }}
    >
      <div className="max-w-[500px] w-full">
        <button
          onClick={onBack}
          className="bg-transparent border-none cursor-pointer mb-8 font-medium"
          style={{ color: 'var(--rop-acento)', fontFamily: "'Outfit', sans-serif" }}
        >
          ← Volver al inicio
        </button>
        <h2
          className="text-[2.4rem] mb-8 tracking-[.04em]"
          style={{ fontFamily: "'Bebas Neue', serif", color: 'var(--rop-dark)' }}
        >
          MI CUENTA
        </h2>
        <div
          className="p-8 rounded"
          style={{
            background: 'var(--rop-surface)',
            border: '1px solid var(--rop-border)',
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          <p className="mb-4" style={{ color: 'var(--rop-dark)' }}>
            <strong>Email:</strong> {cliente?.email}
          </p>
          <p className="mb-4" style={{ color: 'var(--rop-dark)' }}>
            <strong>Nombre:</strong> {cliente?.nombre} {cliente?.apellido}
          </p>
          <p className="mb-8" style={{ color: 'var(--rop-dark)' }}>
            <strong>Teléfono:</strong> {cliente?.telefono}
          </p>
          <button
            onClick={onLogout}
            className="px-5 py-2.5 border-none rounded cursor-pointer font-semibold uppercase"
            style={{ background: 'var(--rop-acento)', color: 'var(--rop-btn-txt)' }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
