import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ChevronDown, 
  ChevronUp, 
  Package, 
  Calendar, 
  CreditCard, 
  Truck, 
  LogOut, 
  ArrowLeft,
  Info,
  ExternalLink,
  History,
  User,
  AlertCircle
} from 'lucide-react';
import { useAuthSessionStore } from '../../../store/useAuthSession';
import { getMisPedidos } from '../../../api/pedidos.api';

interface AccountViewProps {
  onBack: () => void;
  onLogout: () => void;
}

export default function AccountView({ onBack, onLogout }: AccountViewProps) {
  const cliente = useAuthSessionStore((state) => state.cliente);
  const token = useAuthSessionStore((state) => state.token);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<'en_curso' | 'finalizados' | 'todos'>('en_curso');

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
    queryFn: () => getMisPedidos(),
    enabled: !!token && !!cliente?.id,
    staleTime: 1000 * 60 * 1, // 1 minuto
  });

  const counts = useMemo(() => {
    const total = pedidos.length;
    const enCurso = pedidos.filter(p => ['PENDIENTE', 'CONFIRMADO', 'EN_CAMINO'].includes(p.estado || 'PENDIENTE')).length;
    const finalizados = total - enCurso;
    return { total, enCurso, finalizados };
  }, [pedidos]);

  const pedidosFiltrados = useMemo(() => {
    let list = pedidos;
    if (filtro === 'en_curso') {
      list = pedidos.filter(p => ['PENDIENTE', 'CONFIRMADO', 'EN_CAMINO'].includes(p.estado || 'PENDIENTE'));
    } else if (filtro === 'finalizados') {
      list = pedidos.filter(p => ['ENTREGADO', 'CANCELADO'].includes(p.estado));
    }
    return list;
  }, [pedidos, filtro]);

  const toggleOrder = (id: number) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getStatusInfo = (estado: string) => {
    switch (estado) {
      case 'ENTREGADO':
        return { color: '#10b981', label: 'Entregado', icon: <Package size={12} /> };
      case 'CANCELADO':
        return { color: '#ef4444', label: 'Cancelado', icon: <Info size={12} /> };
      case 'EN_CAMINO':
        return { color: '#3b82f6', label: 'En Camino', icon: <Truck size={12} /> };
      case 'CONFIRMADO':
        return { color: '#f59e0b', label: 'Procesando', icon: <Package size={12} /> };
      default:
        return { color: '#64748b', label: 'Pendiente', icon: <Calendar size={12} /> };
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#fafafa] dark:bg-[#0a0a0b] py-8 md:py-16 px-4 md:px-8 mt-16 font-['DM_Sans',sans-serif]">
      {/* Contenedor Principal Ultra-Wide */}
      <div className="max-w-[1400px] mx-auto">
        
        {/* Barra de navegación superior (Breadcrumb style) */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={onBack}
            className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all group"
          >
            <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors">
               <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            </div>
            Volver a la tienda
          </button>
        </div>

        {/* Layout de Paneles (Dashboard) */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 items-start">
          
          {/* SIDEBAR (Sticky) */}
          <aside className="lg:sticky lg:top-28 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/60 p-8 shadow-sm">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 rounded-[2rem] bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 text-2xl font-black mb-4 shadow-xl">
                  {datosMostrar.nombre[0]}
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">
                  {datosMostrar.nombre} <br/> {datosMostrar.apellido}
                </h2>
                <p className="text-xs font-medium text-slate-400 mt-2">{datosMostrar.email}</p>
              </div>

              <div className="space-y-1">
                 <SidebarItem icon={<Package size={18}/>} label="Mis Pedidos" active={true} count={counts.total} />
                 <SidebarItem icon={<User size={18}/>} label="Configuración" />
                 <SidebarItem icon={<CreditCard size={18}/>} label="Métodos de Pago" />
              </div>

              <button
                onClick={onLogout}
                className="mt-8 w-full py-4 rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-500 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                <LogOut size={14} />
                Cerrar sesión
              </button>
            </div>

            {/* Info Card de Ayuda */}
            <div className="bg-[var(--gor-acento)] rounded-3xl p-8 text-[var(--gor-btn-txt)] shadow-lg shadow-[var(--gor-acento)]/20 relative overflow-hidden group">
               <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Info size={120} />
               </div>
               <h4 className="font-black text-sm uppercase tracking-widest mb-2">¿Necesitás ayuda?</h4>
               <p className="text-[11px] font-medium leading-relaxed opacity-80">Si tenés dudas con un pedido o querés realizar un cambio, contactanos por WhatsApp.</p>
               <button className="mt-4 text-[10px] font-black uppercase underline tracking-widest">Soporte 24/7</button>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter" style={{ fontFamily: "'Playfair Display',serif" }}>
                  Panel Escritorio
                </h1>
                <p className="text-slate-400 text-sm mt-1 font-medium italic">Tu historial completo y estados en tiempo real.</p>
              </div>

              {/* TABS MINIMALISTAS */}
              <div className="inline-flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/60">
                 <TabButton active={filtro === 'en_curso'} onClick={() => setFiltro('en_curso')} label="En curso" count={counts.enCurso} />
                 <TabButton active={filtro === 'finalizados'} onClick={() => setFiltro('finalizados')} label="Finalizados" count={counts.finalizados} />
                 <TabButton active={filtro === 'todos'} onClick={() => setFiltro('todos')} label="Todo" count={counts.total} />
              </div>
            </div>

            {/* LISTA DE PEDIDOS */}
            <div className="flex flex-col gap-5">
              {pedidosLoading && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-20 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 border-2 border-slate-100 border-t-slate-900 dark:border-t-white rounded-full animate-spin mb-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Actualizando datos</span>
                </div>
              )}

              {pedidosError && (
                <div className="bg-red-50 dark:bg-red-950/20 p-8 rounded-3xl border border-red-100 dark:border-red-900/30 text-red-600 flex items-center gap-4">
                  <AlertCircle size={20} />
                  <p className="text-sm font-bold">Error al conectar con la base de datos de pedidos.</p>
                </div>
              )}

              {!pedidosLoading && !pedidosError && pedidosFiltrados.length === 0 && (
                <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-[2.5rem] p-20 text-center flex flex-col items-center justify-center">
                   <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6">
                      <History size={32} className="text-slate-200 dark:text-slate-700" />
                   </div>
                   <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Sin actividad histórica</h3>
                   <p className="text-slate-400 text-sm mt-2 max-w-[300px]">No se encontraron registros bajo el filtro seleccionado.</p>
                </div>
              )}

              {!pedidosLoading && !pedidosError && pedidosFiltrados.map((pedido : any) => (
                <OrderCard 
                  key={pedido.id} 
                  pedido={pedido} 
                  isExpanded={expandedOrderId === pedido.id}
                  onToggle={() => toggleOrder(pedido.id)}
                  statusInfo={getStatusInfo(pedido.estado)}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// ── COMPONENTES INTERNOS ───────────────────────────────────────────────────

function SidebarItem({ icon, label, active = false, count } : { icon: any, label: string, active?: boolean, count?: number }) {
  return (
    <div className={`
      flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all gap-3
      ${active ? 'bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}
    `}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-[13px] font-bold tracking-tight">{label}</span>
      </div>
      {count !== undefined && <span className="text-[10px] font-black opacity-40">{count}</span>}
    </div>
  );
}

function TabButton({ active, label, count, onClick } : { active: boolean, label: string, count: number, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`
        px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
        ${active ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}
      `}
    >
      {label} <span className="ml-1 opacity-50">[{count}]</span>
    </button>
  );
}

function OrderCard({ pedido, isExpanded, onToggle, statusInfo } : any) {
  return (
    <div className={`
      bg-white dark:bg-slate-900 border transition-all duration-500 rounded-[2rem] overflow-hidden
      ${isExpanded ? 'border-slate-900/10 dark:border-white/10 shadow-2xl scale-[1.01]' : 'border-slate-100 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'}
    `}>
      {/* Header */}
      <div 
        onClick={onToggle}
        className="p-6 md:p-10 cursor-pointer flex flex-wrap items-center justify-between gap-8 relative"
      >
        <div className="flex items-center gap-8">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">ID Registro</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">#{pedido.id}</span>
           </div>
           
           <div className="hidden sm:flex flex-col px-8 border-l border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Fecha</span>
              <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                 {new Date(pedido.creadoEn).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
              </span>
           </div>
        </div>

        <div className="flex items-center gap-10">
           <div className="flex flex-col text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Inversión Total</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">
                 ${Number(pedido.total).toLocaleString('es-AR')}
              </span>
           </div>

           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                 <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusInfo.color }} />
                 <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: statusInfo.color }}>
                   {statusInfo.label}
                 </span>
              </div>
              
              <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-slate-900 dark:text-white' : 'text-slate-300'}`}>
                 <ChevronDown size={20} />
              </div>
           </div>
        </div>
      </div>

      {/* Detail Area */}
      {isExpanded && (
        <div className="px-6 md:px-10 pb-10 animate-in fade-in slide-in-from-top-4 duration-500">
           <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-12 pt-10 border-t border-slate-50 dark:border-slate-800/60">
              
              {/* Productos */}
              <div className="space-y-6">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Resumen de Artículos</h4>
                 <div className="grid gap-4">
                    {pedido.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-5 p-4 rounded-3xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                         <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                            {item.imagenUrl ? (
                              <img src={item.imagenUrl} alt={item.nombreProd} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-200"><Package size={24} /></div>
                            )}
                         </div>
                         <div className="flex-1">
                            <h5 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">{item.nombreProd}</h5>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.1em]">Cantidad: {item.cantidad} unidades</p>
                            <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[9px] font-black text-slate-500">
                               Ref: #{item.productoId}
                            </span>
                         </div>
                         <div className="text-right">
                            <p className="text-xs font-black text-slate-900 dark:text-white opacity-40 mb-1">${Number(item.precioUnit).toLocaleString('es-AR')} c/u</p>
                            <p className="text-base font-black text-slate-900 dark:text-white">${Number(item.subtotal).toLocaleString('es-AR')}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Logística y Finanzas */}
              <div className="space-y-6">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Detalle Logístico</h4>
                 
                 <div className="space-y-8 bg-white dark:bg-slate-950 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                    <div>
                       <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800">
                             <Truck size={14} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Entrega</span>
                       </div>
                       <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">
                          {pedido.metodoEntrega?.nombre || 'Retiro Presencial'}
                       </p>
                       <p className="text-[11px] font-medium text-slate-500 leading-relaxed capitalize italic">
                          {pedido.direccionCalle} {pedido.direccionNumero}, {pedido.direccionCiudad}
                       </p>
                    </div>

                    <div className="pt-8 border-t border-slate-50 dark:border-slate-900">
                       <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800">
                             <CreditCard size={14} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pago</span>
                       </div>
                       <div className="flex items-center justify-between">
                          <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
                             {pedido.metodoPago?.nombre || 'Coordinar Pago'}
                          </p>
                          <History size={14} className="opacity-20 translate-x-1" />
                       </div>
                    </div>
                    
                    <div className="pt-8 flex items-center justify-center">
                       <a 
                        href={`https://wa.me/yourwhatsapp?text=Hola!%20Tengo%20una%20duda%20del%20pedido%20%23${pedido.id}`}
                        target="_blank"
                        className="text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 transition-transform"
                       >
                         Tengo una duda
                       </a>
                    </div>
                 </div>
              </div>

           </div>
        </div>
      )}
    </div>
  );
}
