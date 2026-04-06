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
    <div className="px-4 py-12 min-h-[85vh] flex flex-col items-center justify-start mt-16">
      <div className="max-w-6xl w-full bg-white/90 dark:bg-slate-900/80 shadow-2xl rounded-3xl p-6 md:p-10 border border-slate-100 dark:border-slate-800 backdrop-blur-sm">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Volver a la tienda
        </button>

        <h1
          className="text-4xl md:text-5xl font-black mb-10 tracking-tight"
          style={{ color: 'var(--gor-txt)', fontFamily: "'Playfair Display',serif" }}
        >
          Mi cuenta
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* COLUMNA IZQUIERDA: Perfil */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--gor-txt)' }}>
                Mis Datos
              </h2>
              <div
                className="space-y-4 text-[15px] text-slate-600 dark:text-slate-300"
                style={{ fontFamily: "'DM Sans',sans-serif" }}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Email</span>
                  <p className="font-medium text-slate-900 dark:text-white truncate">{datosMostrar.email}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Nombre</span>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {datosMostrar.nombre} {datosMostrar.apellido}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Teléfono</span>
                  <p className="font-medium text-slate-900 dark:text-white">{datosMostrar.telefono}</p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="mt-8 w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                style={{ background: 'var(--gor-acento)', color: 'var(--gor-btn-txt)' }}
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Cerrar sesión
              </button>
            </div>
          </div>

          {/* COLUMNA DERECHA: Pedidos */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" style={{ color: 'var(--gor-txt)' }}>
                Historial de pedidos
              </h2>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">
                {pedidos?.length || 0} {(pedidos?.length === 1) ? 'pedido' : 'pedidos'}
              </span>
            </div>

            {pedidosLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-[var(--gor-acento)] rounded-full animate-spin" />
              </div>
            )}
            
            {pedidosError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 mt-4">
                No se pudieron cargar tus pedidos en este momento.
              </div>
            )}
            
            {!pedidosLoading && !pedidosError && (!pedidos || pedidos.length === 0) && (
              <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center h-full min-h-[250px]">
                <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-3 block">inventory_2</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No tienes pedidos</h3>
                <p className="text-slate-500 text-sm">Tus compras recientes aparecerán aquí.</p>
              </div>
            )}

            {!pedidosLoading && !pedidosError && pedidos && pedidos.length > 0 && (
              <div className="border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden shadow-sm">
                
                {/* Vista Mobile (Cards) */}
                <div className="block md:hidden">
                  <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
                    {pedidos.map((pedido: any) => {
                      const esEntregado = pedido.estado === 'ENTREGADO';
                      const esCancelado = pedido.estado === 'CANCELADO';
                      return (
                        <div key={pedido.id} className="p-5 flex flex-col gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="font-black text-lg text-slate-900 dark:text-white">#{pedido.id}</span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm" 
                              style={{ 
                                background: esEntregado ? '#dcfce7' : esCancelado ? '#fee2e2' : 'var(--gor-acento)',
                                color: esEntregado ? '#166534' : esCancelado ? '#991b1b' : 'var(--gor-btn-txt)'
                              }}>
                              {pedido.estado || 'PENDIENTE'}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-end mt-1">
                            <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[15px] opacity-80">calendar_today</span>
                              {pedido.creadoEn || pedido.fecha
                                ? new Date(pedido.creadoEn || pedido.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
                                : 'N/A'}
                            </span>
                            <span className="font-black text-[17px] text-slate-900 dark:text-white">
                              ${Number(pedido.total).toLocaleString('es-AR')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Vista Desktop (Tabla) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/60">
                      <tr>
                        <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-slate-500 w-24">ID Pedido</th>
                        <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-slate-500">Fecha</th>
                        <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-slate-500">Estado</th>
                        <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-slate-500 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {pedidos.map((pedido: any) => {
                        const esEntregado = pedido.estado === 'ENTREGADO';
                        const esCancelado = pedido.estado === 'CANCELADO';
                        
                        return (
                          <tr key={pedido.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                            <td className="px-6 py-5">
                              <span className="font-black text-[15px] text-slate-900 dark:text-white group-hover:text-[var(--gor-acento)] transition-colors">#{pedido.id}</span>
                            </td>
                            <td className="px-6 py-5">
                              <span className="text-[14px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] opacity-60">calendar_today</span>
                                {pedido.creadoEn || pedido.fecha
                                  ? new Date(pedido.creadoEn || pedido.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
                                  : 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm" 
                                style={{ 
                                  background: esEntregado ? '#dcfce7' : esCancelado ? '#fee2e2' : 'var(--gor-acento)',
                                  color: esEntregado ? '#166534' : esCancelado ? '#991b1b' : 'var(--gor-btn-txt)'
                                }}>
                                {pedido.estado || 'PENDIENTE'}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <span className="font-black text-[16px] text-slate-900 dark:text-white">
                                ${Number(pedido.total).toLocaleString('es-AR')}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
