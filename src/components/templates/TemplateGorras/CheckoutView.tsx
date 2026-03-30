import { useState, useMemo } from 'react';
import type { Tienda, Carrito } from './Types';
import { createPedido } from '../../../api/pedidos.api';

interface CheckoutViewProps {
  tienda: Tienda;
  carrito: Carrito;
  onClose: () => void;
  onSuccess: (orderId: number) => void;
  sessionId: string;
}

type CheckoutStep = 'datos' | 'entrega' | 'pago' | 'resumen';

// ── CSS vars ──────────────────────────────────────────────────
const ACENTO = 'var(--gor-acento)';
const TXT = 'var(--gor-txt)';
const MUTED = 'var(--gor-muted)';
const BORDER = 'var(--gor-border)';
const SURFACE = 'var(--gor-surface)';
const BTN_TXT = 'var(--gor-btn-txt)';

// ── Field Helper ──────────────────────────────────────────────
function Field({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[.78rem] font-semibold tracking-[.03em]"
        style={{ color: MUTED, fontFamily: "'DM Sans',sans-serif" }}
      >
        {label} {required && '*'}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-4 py-3 rounded-[10px] text-[.95rem] outline-none transition-colors duration-200"
        style={{
          border: `1.5px solid ${focused ? ACENTO : BORDER}`,
          background: SURFACE,
          color: TXT,
          fontFamily: "'DM Sans',sans-serif",
        }}
      />
      {error && (
        <span className="text-[.72rem] text-red-500" style={{ fontFamily: "'DM Sans',sans-serif" }}>
          {error}
        </span>
      )}
    </div>
  );
}

export default function CheckoutView({ tienda, carrito, onClose, onSuccess, sessionId }: CheckoutViewProps) {
  const [step, setStep] = useState<CheckoutStep>('datos');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Form State ──────────────────────────────────────────────
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    tel: '',
    calle: '',
    numero: '',
    ciudad: '',
    provincia: '',
    metodoEntregaId: 0,
    metodoPagoId: 0,
    notas: ''
  });

  const subtotal = useMemo(() => {
    return carrito.items.reduce((acc, item) => acc + (Number(item.precioUnit) * item.cantidad), 0);
  }, [carrito]);

  // ── Handlers ────────────────────────────────────────────────
  const nextStep = () => {
    if (step === 'datos') {
      if (!formData.nombre || !formData.email || !formData.tel || !formData.calle || !formData.ciudad || !formData.provincia) {
        setError('Por favor completa los campos obligatorios');
        return;
      }
      setStep('entrega');
    } else if (step === 'entrega') {
      if (!formData.metodoEntregaId) {
        setError('Selecciona un método de entrega');
        return;
      }
      setStep('pago');
    } else if (step === 'pago') {
      if (!formData.metodoPagoId) {
        setError('Selecciona un método de pago');
        return;
      }
      setStep('resumen');
    }
    setError('');
  };

  const handleFinalizar = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        compradorNombre: formData.nombre,
        compradorEmail: formData.email,
        compradorTel: formData.tel,
        metodoEntregaId: formData.metodoEntregaId,
        direccionCalle: formData.calle,
        direccionNumero: formData.numero,
        direccionCiudad: formData.ciudad,
        direccionProv: formData.provincia,
        metodoPagoId: formData.metodoPagoId,
        notasCliente: formData.notas
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
    <div className="px-6 py-12 min-h-[80vh] flex flex-col">
      <div className="max-w-[600px] mx-auto w-full flex-1 flex flex-col">
          
        {/* Header simple */}
        <div className="flex justify-between items-center mb-10">
            <button
                onClick={() => step === 'datos' ? onClose() : setStep(step === 'resumen' ? 'pago' : step === 'pago' ? 'entrega' : 'datos')}
                className="flex items-center gap-2 bg-transparent border-none text-[.85rem] font-medium cursor-pointer p-0 transition-colors duration-200"
                style={{ color: MUTED, fontFamily: "'DM Sans',sans-serif" }}
            >
                <span className="text-xl">←</span> {step === 'datos' ? 'Volver al carrito' : 'Volver atrás'}
            </button>
            <span className="text-[.75rem] font-bold uppercase tracking-widest" style={{ color: ACENTO }}>
                Paso {step === 'datos' ? '1' : step === 'entrega' ? '2' : step === 'pago' ? '3' : '4'} de 4
            </span>
        </div>

        <h1
          className="font-bold leading-[1.1] mb-6"
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            color: TXT,
          }}
        >
          {step === 'datos' && 'Datos de envío'}
          {step === 'entrega' && 'Método de envío'}
          {step === 'pago' && 'Método de pago'}
          {step === 'resumen' && 'Resumen de tu pedido'}
        </h1>

        <div className="w-10 h-[3px] rounded-sm mb-10" style={{ background: ACENTO }} />

        {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-[.85rem] border border-red-100">
                {error}
            </div>
        )}

        {/* CONTENIDO POR PASO */}
        <div className="flex-1">
          {step === 'datos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Nombre Completo" placeholder="Ej: Juan Pérez" value={formData.nombre} onChange={(v) => setFormData({...formData, nombre: v})} required />
              <Field label="Email" type="email" placeholder="juan@email.com" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} required />
              <Field label="Teléfono / WhatsApp" placeholder="+54 9 11 ..." value={formData.tel} onChange={(v) => setFormData({...formData, tel: v})} required />
              <div className="md:col-span-2 grid grid-cols-3 gap-5">
                  <div className="col-span-2">
                    <Field label="Calle" placeholder="Ej: Av. Rivadavia" value={formData.calle} onChange={(v) => setFormData({...formData, calle: v})} required />
                  </div>
                  <Field label="Número" placeholder="1234" value={formData.numero} onChange={(v) => setFormData({...formData, numero: v})} />
              </div>
              <Field label="Ciudad" placeholder="Ej: CABA" value={formData.ciudad} onChange={(v) => setFormData({...formData, ciudad: v})} required />
              <Field label="Provincia" placeholder="Ej: Buenos Aires" value={formData.provincia} onChange={(v) => setFormData({...formData, provincia: v})} required />
            </div>
          )}

          {step === 'entrega' && (
            <div className="flex flex-col gap-4">
               {tienda.metodosEntrega?.map((m: any) => (
                   <label 
                    key={m.metodoEntrega.id}
                    className="flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all"
                    style={{ 
                        borderColor: formData.metodoEntregaId === m.metodoEntrega.id ? ACENTO : BORDER,
                        background: formData.metodoEntregaId === m.metodoEntrega.id ? `${ACENTO}08` : SURFACE
                    }}
                   >
                       <input 
                        type="radio" 
                        name="entrega" 
                        className="hidden" 
                        onChange={() => setFormData({...formData, metodoEntregaId: m.metodoEntrega.id})}
                       />
                       <div className="flex-1">
                           <p className="font-bold text-[1rem]" style={{ color: TXT }}>{m.metodoEntrega.nombre}</p>
                           {m.detalle && <p className="text-[.85rem]" style={{ color: MUTED }}>{m.detalle}</p>}
                       </div>
                       <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: formData.metodoEntregaId === m.metodoEntrega.id ? ACENTO : MUTED }}>
                           {formData.metodoEntregaId === m.metodoEntrega.id && <div className="w-2.5 h-2.5 rounded-full" style={{ background: ACENTO }} />}
                       </div>
                   </label>
               ))}
            </div>
          )}

          {step === 'pago' && (
            <div className="flex flex-col gap-4">
               {tienda.metodosPago?.map((m: any) => (
                   <label 
                    key={m.metodoPago.id}
                    className="flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all"
                    style={{ 
                        borderColor: formData.metodoPagoId === m.metodoPago.id ? ACENTO : BORDER,
                        background: formData.metodoPagoId === m.metodoPago.id ? `${ACENTO}08` : SURFACE
                    }}
                   >
                       <input 
                        type="radio" 
                        name="pago" 
                        className="hidden" 
                        onChange={() => setFormData({...formData, metodoPagoId: m.metodoPago.id})}
                       />
                       <div className="flex-1">
                           <p className="font-bold text-[1rem]" style={{ color: TXT }}>{m.metodoPago.nombre}</p>
                           {m.detalle && <p className="text-[.85rem]" style={{ color: MUTED }}>{m.detalle}</p>}
                       </div>
                       <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: formData.metodoPagoId === m.metodoPago.id ? ACENTO : MUTED }}>
                           {formData.metodoPagoId === m.metodoPago.id && <div className="w-2.5 h-2.5 rounded-full" style={{ background: ACENTO }} />}
                       </div>
                   </label>
               ))}
            </div>
          )}

          {step === 'resumen' && (
            <div className="flex flex-col gap-8">
               <div className="p-6 rounded-2xl border flex flex-col gap-4" style={{ borderColor: BORDER, background: SURFACE }}>
                   <div className="flex justify-between items-end border-b pb-4" style={{ borderColor: BORDER }}>
                       <span className="text-[.85rem] font-bold uppercase tracking-wider" style={{ color: MUTED }}>Productos ({carrito.items.length})</span>
                       <span className="text-[1.2rem] font-bold" style={{ color: TXT }}>${subtotal.toLocaleString()}</span>
                   </div>
                   <div className="flex flex-col gap-5 pt-2">
                       {carrito.items.map(item => (
                           <div key={item.id} className="flex justify-between items-center text-[.9rem]">
                               <div className="flex items-center gap-3">
                                   <span className="font-bold" style={{ color: ACENTO }}>{item.cantidad}x</span>
                                   <span style={{ color: TXT }}>{item.producto.nombre}</span>
                               </div>
                               <span style={{ color: MUTED }}>${(Number(item.precioUnit) * item.cantidad).toLocaleString()}</span>
                           </div>
                       ))}
                   </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="flex flex-col gap-1">
                       <span className="text-[.7rem] font-bold uppercase tracking-widest" style={{ color: MUTED }}>Envío a</span>
                       <p className="text-[.95rem] font-medium" style={{ color: TXT }}>{formData.calle} {formData.numero}, {formData.ciudad}</p>
                   </div>
                   <div className="flex flex-col gap-1">
                       <span className="text-[.7rem] font-bold uppercase tracking-widest" style={{ color: MUTED }}>Contacto</span>
                       <p className="text-[.95rem] font-medium" style={{ color: TXT }}>{formData.nombre} ({formData.tel})</p>
                   </div>
               </div>
               
               <div className="flex flex-col gap-3 mt-4">
                   <label className="text-[.78rem] font-semibold tracking-[.03em]" style={{ color: MUTED }}>Notas adicionales (opcional)</label>
                   <textarea 
                    value={formData.notas}
                    onChange={(e) => setFormData({...formData, notas: e.target.value})}
                    placeholder="Algo que quieras decirnos sobre tu pedido..."
                    className="w-full px-4 py-3 rounded-[10px] text-[.95rem] outline-none min-h-[100px] transition-colors"
                    style={{ border: `1.5px solid ${BORDER}`, background: SURFACE, color: TXT, fontFamily: "'DM Sans',sans-serif" }}
                   />
               </div>
            </div>
          )}
        </div>

        {/* BOTON SIGUIENTE / FINALIZAR */}
        <div className="mt-12 flex flex-col gap-4">
            <button
                onClick={step === 'resumen' ? handleFinalizar : nextStep}
                disabled={loading}
                className="w-full py-4 rounded-[12px] text-[1rem] font-bold border-none transition-all active:scale-[0.98] disabled:opacity-50"
                style={{
                    background: ACENTO,
                    color: BTN_TXT,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: `0 8px 24px -6px ${ACENTO}66`
                }}
            >
                {loading ? 'Procesando...' : (step === 'resumen' ? 'Finalizar Pedido' : 'Siguiente')}
            </button>
            <p className="text-[.75rem] text-center" style={{ color: MUTED }}>
                {step === 'resumen' ? 'Al hacer clic en finalizar, tu pedido será registrado y nos pondremos en contacto.' : 'Todos tus datos están protegidos y son necesarios para procesar la compra.'}
            </p>
        </div>

      </div>
    </div>
  );
}
