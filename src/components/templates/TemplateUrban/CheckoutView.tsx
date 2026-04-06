import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createPedido } from '../../../api/pedidos.api';
import { useAuthSessionStore } from '../../../store/useAuthSession';
import { usePerfilCliente } from '../../../hooks/useCliente';
import type { Tienda, Carrito } from './Types';

interface CheckoutViewProps {
  tienda: Tienda;
  carrito: Carrito;
  onClose: () => void;
  onSuccess: (orderId: number) => void;
  sessionId: string;
}

type CheckoutStep = 'datos' | 'entrega' | 'pago' | 'resumen';

interface CheckoutFormValues {
  nombre: string;
  email: string;
  tel: string;
  calle: string;
  numero: string;
  ciudad: string;
  provincia: string;
  metodoEntregaId: number;
  metodoPagoId: number;
  notas: string;
}

export default function CheckoutView({ tienda, carrito, onClose, onSuccess, sessionId }: CheckoutViewProps) {
  const [step, setStep] = useState<CheckoutStep>('datos');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = useAuthSessionStore((s) => s.token);
  const { data: perfil } = usePerfilCliente(!!token);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      nombre: '',
      email: '',
      tel: '',
      calle: '',
      numero: '',
      ciudad: '',
      provincia: '',
      metodoEntregaId: 0,
      metodoPagoId: 0,
      notas: '',
    },
  });

  const watched = watch();
  const subtotal = useMemo(() => carrito.items.reduce((acc: number, item: any) => acc + Number(item.precioUnit) * (item.cantidad || item.qty || 1), 0), [carrito]);
  
  // Lógica de costo de envío
  const selectedEntrega = tienda?.metodosEntrega?.find(me => Number(me.metodoEntrega.id) === Number(watched.metodoEntregaId));
  const isEnvio = selectedEntrega?.metodoEntrega?.nombre?.toLowerCase().includes('envío') ||
                  selectedEntrega?.metodoEntrega?.nombre?.toLowerCase().includes('uber') ||
                  selectedEntrega?.metodoEntrega?.nombre?.toLowerCase().includes('domicilio');
  
  const shipCost = isEnvio ? (subtotal >= 15000 ? 0 : 1200) : 0;
  const total = subtotal + shipCost;

  const advanceStep = async () => {
    if (step === 'datos') {
      const ok = await trigger(['nombre', 'email', 'tel', 'calle', 'numero', 'ciudad', 'provincia']);
      if (!ok) {
        setError('POR FAVOR, COMPLETÁ LOS CAMPOS REQUERIDOS');
        return;
      }
      setError('');
      setStep('entrega');
      return;
    }
    if (step === 'entrega') {
      if (!watched.metodoEntregaId || watched.metodoEntregaId == 0) {
        setError('SELECCIONÁ UN MÉTODO DE ENVÍO');
        return;
      }
      setError('');
      setStep('pago');
      return;
    }
    if (step === 'pago') {
      if (!watched.metodoPagoId || watched.metodoPagoId == 0) {
        setError('SELECCIONÁ UN MÉTODO DE PAGO');
        return;
      }
      setError('');
      setStep('resumen');
      return;
    }
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        compradorNombre: data.nombre,
        compradorEmail: data.email,
        compradorTel: data.tel,
        metodoEntregaId: Number(data.metodoEntregaId),
        direccionCalle: data.calle,
        direccionNumero: data.numero,
        direccionCiudad: data.ciudad,
        direccionProv: data.provincia,
        metodoPagoId: Number(data.metodoPagoId),
        notasCliente: data.notas,
        costoEnvio: shipCost,
      };
      const res = await createPedido(tienda.id!, sessionId, payload);
      onSuccess(res.id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white py-20 px-6">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto flex flex-col gap-12">
        {/* Header navigation */}
        <div className="flex justify-between items-center border-b border-zinc-900 pb-8">
          <button 
            type="button" 
            onClick={() => {
              if (step === 'datos') onClose();
              else if (step === 'entrega') setStep('datos');
              else if (step === 'pago') setStep('entrega');
              else if (step === 'resumen') setStep('pago');
            }} 
            className="text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest bg-transparent border-none cursor-pointer transition-all"
          >
            {step === 'datos' ? '← ABANDONAR_CHECKOUT' : '← VOLVER_ATRÁS'}
          </button>
          <div className="flex gap-2">
            {['datos', 'entrega', 'pago', 'resumen'].map((s) => (
               <div key={s} className={`h-1 transition-all duration-500 ${step === s ? 'w-12 bg-red-600' : 'w-4 bg-zinc-900'}`} />
            ))}
          </div>
        </div>

        {/* Title Section */}
        <div>
          <h1 className="text-white text-6xl leading-none uppercase font-bebas mb-2">
            {step === 'datos' && 'IDENTIFICACIÓN'}
            {step === 'entrega' && 'LOGÍSTICA'}
            {step === 'pago' && 'TRANSACCIÓN'}
            {step === 'resumen' && 'CONFIRMACIÓN'}
          </h1>
          <div className="w-16 h-1 bg-red-600" />
        </div>

        {error && (
            <div className="bg-red-600/10 border border-red-600 text-red-600 p-6 text-[10px] font-black uppercase tracking-widest animate-pulse">
                ERROR_SYSTEM: {error}
            </div>
        )}

        <div className="min-h-[400px]">
          {step === 'datos' && (
            <div className="space-y-8 animate-in fade-in duration-700">
               {perfil && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setValue('nombre', `${perfil.nombre} ${perfil.apellido || ''}`.trim());
                        setValue('email', perfil.email);
                        setValue('tel', perfil.telefono || '');
                      }}
                      className="bg-transparent border border-zinc-800 text-zinc-500 hover:text-white px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer"
                    >
                      [ USAR_DATOS_AUTENTICADOS ]
                    </button>
                  </div>
               )}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label className="text-zinc-600 text-[10px] font-black uppercase tracking-widest ml-1 mb-2 block">Nombre Completo</label>
                    <input {...register('nombre', { required: true })} className={`w-full bg-zinc-950 border-2 px-5 py-4 text-white text-sm focus:outline-none transition-all ${errors.nombre ? 'border-red-600' : 'border-zinc-900 focus:border-white'}`} placeholder="NOMBRE Y APELLIDO..." />
                  </div>
                  <div>
                    <label className="text-zinc-600 text-[10px] font-black uppercase tracking-widest ml-1 mb-2 block">Email Contacto</label>
                    <input {...register('email', { required: true })} className={`w-full bg-zinc-950 border-2 px-5 py-4 text-white text-sm focus:outline-none transition-all ${errors.email ? 'border-red-600' : 'border-zinc-900 focus:border-white'}`} placeholder="TU@EMAIL.COM" />
                  </div>
                  <div>
                    <label className="text-zinc-600 text-[10px] font-black uppercase tracking-widest ml-1 mb-2 block">Teléfono / Celular</label>
                    <input {...register('tel', { required: true })} className={`w-full bg-zinc-950 border-2 px-5 py-4 text-white text-sm focus:outline-none transition-all ${errors.tel ? 'border-red-600' : 'border-zinc-900 focus:border-white'}`} placeholder="381 ..." />
                  </div>
                  <div className="md:col-span-2 grid grid-cols-[1fr_120px] gap-8">
                    <div>
                      <label className="text-zinc-600 text-[10px] font-black uppercase tracking-widest ml-1 mb-2 block">Calle / Dirección</label>
                      <input {...register('calle', { required: true })} className={`w-full bg-zinc-950 border-2 px-5 py-4 text-white text-sm focus:outline-none transition-all ${errors.calle ? 'border-red-600' : 'border-zinc-900 focus:border-white'}`} placeholder="CALLE..." />
                    </div>
                    <div>
                      <label className="text-zinc-600 text-[10px] font-black uppercase tracking-widest ml-1 mb-2 block">N°</label>
                      <input {...register('numero', { required: true })} className={`w-full bg-zinc-950 border-2 px-5 py-4 text-white text-sm focus:outline-none transition-all ${errors.numero ? 'border-red-600' : 'border-zinc-900 focus:border-white'}`} placeholder="000" />
                    </div>
                  </div>
                  <div>
                    <label className="text-zinc-600 text-[10px] font-black uppercase tracking-widest ml-1 mb-2 block">Ciudad</label>
                    <input {...register('ciudad', { required: true })} className={`w-full bg-zinc-950 border-2 px-5 py-4 text-white text-sm focus:outline-none transition-all ${errors.ciudad ? 'border-red-600' : 'border-zinc-900 focus:border-white'}`} placeholder="CIUDAD..." />
                  </div>
                  <div>
                    <label className="text-zinc-600 text-[10px] font-black uppercase tracking-widest ml-1 mb-2 block">Provincia</label>
                    <input {...register('provincia', { required: true })} className={`w-full bg-zinc-950 border-2 px-5 py-4 text-white text-sm focus:outline-none transition-all ${errors.provincia ? 'border-red-600' : 'border-zinc-900 focus:border-white'}`} placeholder="PROVINCIA..." />
                  </div>
               </div>
            </div>
          )}

          {step === 'entrega' && (
            <div className="space-y-4 animate-in fade-in duration-700">
              {tienda?.metodosEntrega?.length ? tienda.metodosEntrega.map((me: any) => (
                <label key={me.metodoEntrega.id} className={`flex items-center gap-6 p-8 border-2 cursor-pointer transition-all ${watched.metodoEntregaId == me.metodoEntrega.id ? 'border-red-600 bg-zinc-950 shadow-[0_0_20px_rgba(255,0,0,0.1)]' : 'border-zinc-900 bg-black opacity-60 hover:opacity-100'}`}>
                  <input type="radio" value={me.metodoEntrega.id} {...register('metodoEntregaId', { required: true })} className="w-5 h-5 accent-red-600" />
                  <div className="flex-1">
                    <p className="font-syncopate font-black text-xs uppercase tracking-widest text-white">{me.metodoEntrega?.nombre || 'ENVÍO'}</p>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-tighter mt-1">{me.detalle || 'MÉTODO ESTÁNDAR'}</p>
                  </div>
                  <span className="font-bebas text-2xl text-red-600">
                    {me.metodoEntrega?.nombre?.toLowerCase().includes('envío') || me.metodoEntrega?.nombre?.toLowerCase().includes('uber') || me.metodoEntrega?.nombre?.toLowerCase().includes('domicilio')
                      ? (subtotal >= 15000 ? 'GRATIS' : '$1.200')
                      : 'GRATIS'}
                  </span>
                </label>
              )) : (
                <div className="py-20 text-center border border-zinc-900 uppercase text-zinc-700 text-[10px] font-black tracking-widest">
                  NO_LOGISTICS_AVAILABLE
                </div>
              )}
            </div>
          )}

          {step === 'pago' && (
            <div className="space-y-4 animate-in fade-in duration-700">
              {tienda?.metodosPago?.length ? tienda.metodosPago.map((mp: any) => (
                <label key={mp.metodoPago.id} className={`flex items-center gap-6 p-8 border-2 cursor-pointer transition-all ${watched.metodoPagoId == mp.metodoPago.id ? 'border-red-600 bg-zinc-950 shadow-[0_0_20px_rgba(255,0,0,0.1)]' : 'border-zinc-900 bg-black opacity-60 hover:opacity-100'}`}>
                  <input type="radio" value={mp.metodoPago.id} {...register('metodoPagoId', { required: true })} className="w-5 h-5 accent-red-600" />
                  <div className="flex-1">
                    <p className="font-syncopate font-black text-xs uppercase tracking-widest text-white">{mp.metodoPago?.nombre || 'PAGO'}</p>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-tighter mt-1">{mp.detalle || 'OPCIONES DISPONIBLES'}</p>
                  </div>
                </label>
              )) : (
                <div className="py-20 text-center border border-zinc-900 uppercase text-zinc-700 text-[10px] font-black tracking-widest">
                  NO_PAYMENT_MET_AVAILABLE
                </div>
              )}
            </div>
          )}

          {step === 'resumen' && (
            <div className="space-y-10 animate-in fade-in duration-700">
               <div className="bg-zinc-950 border border-zinc-900 p-8 space-y-8">
                  <div className="flex justify-between items-start flex-wrap gap-8">
                     <div className="flex-1 min-w-[200px]">
                        <h4 className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em] mb-4 font-syncopate">DESTINATION</h4>
                        <p className="text-white text-xs font-black uppercase">{watched.nombre}</p>
                        <p className="text-zinc-500 text-[10px] uppercase mt-1 font-barlow tracking-wider">{watched.calle} {watched.numero}</p>
                        <p className="text-zinc-500 text-[10px] uppercase font-barlow tracking-wider">{watched.ciudad}, {watched.provincia}</p>
                     </div>
                     <div className="flex-1 min-w-[200px]">
                        <h4 className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em] mb-4 font-syncopate">ORDER_SUMMARY</h4>
                        <div className="space-y-2">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                             <span className="text-zinc-600">SUBTOTAL</span>
                             <span className="text-white">${subtotal.toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                             <span className="text-zinc-600">LOGISTICS</span>
                             <span className="text-white">{shipCost === 0 ? 'FREE' : `$${shipCost.toLocaleString()}`}</span>
                           </div>
                           <div className="h-px bg-zinc-900 my-4" />
                           <div className="flex justify-between text-2xl font-bebas text-red-600">
                             <span>TOTAL_DUE</span>
                             <span>${total.toLocaleString()}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div>
                  <label className="text-zinc-600 text-[10px] font-black uppercase tracking-widest ml-1 mb-2 block">Special Requests / Notes</label>
                  <textarea {...register('notas')} placeholder="ADDITIONAL_DATA..." className="w-full bg-zinc-950 border-2 border-zinc-900 px-5 py-4 text-white text-sm focus:outline-none focus:border-white transition-all resize-none min-h-[100px]" />
               </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {step !== 'resumen' ? (
              <button
                type="button"
                onClick={advanceStep}
                className="col-span-full bg-red-600 hover:bg-white hover:text-black text-white font-black py-6 uppercase tracking-[0.3em] font-syncopate transition duration-500 text-xs border-none cursor-pointer"
              >
                PROCEED_TO_NEXT_PHASE
              </button>
           ) : (
              <button
                type="submit"
                disabled={loading}
                className="col-span-full bg-white text-black hover:bg-red-600 hover:text-white font-black py-6 uppercase tracking-[0.3em] font-syncopate transition duration-500 text-xs border-none cursor-pointer"
              >
                {loading ? 'TRANSMITTING_DATA...' : 'EXECUTE_ORDER'}
              </button>
           )}
        </div>
      </form>
    </div>
  );
}
