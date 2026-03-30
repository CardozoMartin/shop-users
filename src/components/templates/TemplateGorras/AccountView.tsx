import { useMemo } from 'react';
import { useAuthSessionStore } from '../../../store/useAuthSession';

interface AccountViewProps {
  onBack: () => void;
  onLogout: () => void;
}

export default function AccountView({ onBack, onLogout }: AccountViewProps) {
  const cliente = useAuthSessionStore((state) => state.cliente);

  const datosMostrar = useMemo(
    () => ({
      email: cliente?.email || 'No registrado',
      nombre: cliente?.nombre || 'N/A',
      apellido: cliente?.apellido || 'N/A',
      telefono: cliente?.telefono || '--',
    }),
    [cliente]
  );

  return (
    <div className="px-6 py-10 min-h-[80vh] flex flex-col items-center justify-center">
      <div className="max-w-lg w-full bg-white/90 dark:bg-slate-900/80 shadow-lg rounded-2xl p-8">
        <button
          onClick={onBack}
          className="mb-4 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white"
        >
          ← Volver a la tienda
        </button>

        <h1
          className="text-2xl font-bold mb-6"
          style={{ color: 'var(--gor-txt)', fontFamily: "'DM Sans',sans-serif" }}
        >
          Mi cuenta
        </h1>

        <div
          className="space-y-3 text-sm text-slate-700 dark:text-slate-200"
          style={{ fontFamily: "'DM Sans',sans-serif" }}
        >
          <p>
            <span className="font-semibold">Email:</span> {datosMostrar.email}
          </p>
          <p>
            <span className="font-semibold">Nombre:</span> {datosMostrar.nombre}{' '}
            {datosMostrar.apellido}
          </p>
          <p>
            <span className="font-semibold">Teléfono:</span> {datosMostrar.telefono}
          </p>
        </div>

        <button
          onClick={onLogout}
          className="mt-7 w-full py-3 rounded-xl font-semibold text-white"
          style={{ background: 'var(--gor-acento)', color: 'var(--gor-btn-txt)' }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
