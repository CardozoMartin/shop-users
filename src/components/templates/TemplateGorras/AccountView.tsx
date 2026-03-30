import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthSessionStore } from '../../../store/useAuthSession';
import { getMisPedidos } from '../../../api/pedidos.api';

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

  const { data: pedidos = [], isLoading: pedidosLoading, isError: pedidosError } = useQuery<any[]>({
    queryKey: ['misPedidos', cliente?.id],
    queryFn: () => (cliente ? getMisPedidos(cliente.id) : Promise.resolve([])),
    enabled: !!cliente?.id,
    staleTime: 1000 * 60 * 1, // 1 minuto
  });

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

        <div className="mt-6 border-t border-slate-200 dark:border-slate-600 pt-5">
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--gor-txt)' }}>
            Mis pedidos
          </h2>

          {pedidosLoading && <p>Cargando pedidos...</p>}
          {pedidosError && <p className="text-red-500">No se pudieron cargar tus pedidos.</p>}
          {!pedidosLoading && !pedidosError && (!pedidos || pedidos.length === 0) && (
            <p>No tenés pedidos recientes.</p>
          )}

          {!pedidosLoading && !pedidosError && pedidos && pedidos.length > 0 && (
            <ul className="space-y-3">
              {pedidos.map((pedido: any) => (
                <li key={pedido.id} className="p-3 bg-slate-100/80 dark:bg-slate-800 rounded-xl">
                  <p>
                    <strong>ID:</strong> {pedido.id}
                  </p>
                  <p>
                    <strong>Fecha:</strong>{' '}
                    {pedido.creadoEn || pedido.fecha
                      ? new Date(pedido.creadoEn || pedido.fecha).toLocaleDateString()
                      : 'N/A'}
                  </p>
                  <p>
                    <strong>Estado:</strong> {pedido.estado || 'Pendiente'}
                  </p>
                  <p>
                    <strong>Total:</strong> ${pedido.total || 0}
                  </p>
                </li>
              ))}
            </ul>
          )}
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
