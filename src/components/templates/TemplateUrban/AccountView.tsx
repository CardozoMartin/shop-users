import { useQuery } from '@tanstack/react-query';
import { useAuthSessionStore } from '../../../store/useAuthSession';
import { getMisPedidos } from '../../../api/pedidos.api';

interface AccountViewProps {
  onBack: () => void;
  onLogout: () => void;
}

export default function AccountView({ onBack, onLogout }: AccountViewProps) {
  const cliente = useAuthSessionStore((state) => state.cliente);
  const token = useAuthSessionStore((state) => state.token);

  const { data: pedidos = [], isLoading, isError } = useQuery<any[]>({
    queryKey: ['misPedidos', cliente?.id],
    queryFn: () => getMisPedidos(),
    enabled: !!token && !!cliente?.id,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="mb-12 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest bg-transparent border-none cursor-pointer transition-all"
        >
          ← BACK_TO_STREET
        </button>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar: Profile */}
          <div className="w-full lg:w-1/3 flex flex-col gap-10">
            <div>
              <h1 className="text-white text-7xl leading-none uppercase font-bebas mb-2">MY_ACCOUNT.ZIP</h1>
              <div className="w-20 h-1 bg-red-600" />
            </div>

            <div className="bg-zinc-950 border border-zinc-900 p-10 space-y-8">
               <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] font-syncopate">USER_PROFILE</h4>
               
               <div className="space-y-6">
                  <div>
                    <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest block mb-1">IDENTIFIER</span>
                    <p className="text-sm font-black uppercase text-white truncate">{cliente?.nombre} {cliente?.apellido}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest block mb-1">COMMUNICATION_LINK</span>
                    <p className="text-sm font-black uppercase text-white truncate">{cliente?.email}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest block mb-1">CONTACT_CELL</span>
                    <p className="text-sm font-black uppercase text-white">{cliente?.telefono || 'NO_DATA'}</p>
                  </div>
               </div>

               <button
                 onClick={onLogout}
                 className="w-full mt-4 bg-zinc-900 hover:bg-red-600 text-zinc-500 hover:text-white py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all border-none cursor-pointer"
               >
                 TERMINATE_SESSION
               </button>
            </div>
          </div>

          {/* Main Content: Orders */}
          <div className="flex-1">
             <div className="flex items-end justify-between mb-10 pb-4 border-b border-zinc-900">
                <h2 className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] font-syncopate">ORDER_HISTORY_LOG</h2>
                <span className="text-white text-xs font-black bg-zinc-900 px-3 py-1">[{pedidos.length}]</span>
             </div>

             {isLoading ? (
               <div className="space-y-4 animate-pulse">
                  <div className="h-24 bg-zinc-950 w-full" />
                  <div className="h-24 bg-zinc-950 w-full" />
                  <div className="h-24 bg-zinc-950 w-full" />
               </div>
             ) : isError ? (
               <div className="bg-red-600/10 border border-red-600 p-10 text-red-600 text-[10px] font-black uppercase tracking-widest">
                  CRITICAL_ERROR: UNABLE_TO_FETCH_ORDER_DATA
               </div>
             ) : pedidos.length === 0 ? (
               <div className="bg-zinc-950 border-2 border-dashed border-zinc-900 p-20 text-center">
                  <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em]">NO_TRANSACTIONS_FOUND_IN_ARCHIVE</p>
               </div>
             ) : (
               <div className="space-y-4">
                  {pedidos.map((p) => {
                    const statusColor = p.estado === 'ENTREGADO' ? 'text-green-500' : p.estado === 'CANCELADO' ? 'text-red-500' : 'text-zinc-400';
                    return (
                      <div key={p.id} className="bg-zinc-950 border border-zinc-900 p-8 flex flex-wrap items-center justify-between gap-6 hover:border-zinc-700 transition-all group">
                         <div className="flex items-center gap-8">
                            <span className="font-bebas text-4xl text-white group-hover:text-red-600 transition-colors">#{p.id}</span>
                            <div>
                               <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest block">TIMESTAMP</span>
                               <p className="text-[10px] font-black text-zinc-400 uppercase">
                                 {p.creadoEn ? new Date(p.creadoEn).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                               </p>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-12">
                            <div>
                               <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest block mb-1">STATUS</span>
                               <span className={`text-[10px] font-black uppercase tracking-widest ${statusColor}`}>
                                 [{p.estado || 'PENDING'}]
                               </span>
                            </div>
                            <div className="text-right min-w-[100px]">
                               <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest block mb-1">VALUE</span>
                               <p className="text-2xl font-bebas text-white">${Number(p.total).toLocaleString('es-AR')}</p>
                            </div>
                         </div>
                      </div>
                    );
                  })}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
