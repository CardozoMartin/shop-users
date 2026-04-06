import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createPedido } from '../../../api/pedidos.api';

interface CheckoutViewProps {
  tienda: any;
  carrito: any;
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

  const {
    register,
    handleSubmit,
    watch,
    trigger,
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
  const subtotal = useMemo(() => carrito.items.reduce((acc: number, item: any) => acc + Number(item.precioUnit) * item.cantidad, 0), [carrito]);
  const shipCost = Number(watched.metodoEntregaId) > 0 ? (subtotal >= 10000 ? 0 : 500) : 0; // Joyeria tiene envio mas barato segun grep previo
  const total = subtotal + shipCost;

  const advanceStep = async () => {
    if (step === 'datos') {
      const ok = await trigger(['nombre', 'email', 'tel', 'calle', 'ciudad', 'provincia']);
      if (!ok) {
        setError('Por favor completa los campos obligatorios');
        return;
      }
      setError('');
      setStep('entrega');
      return;
    }
    if (step === 'entrega') {
      if (!watched.metodoEntregaId) {
        setError('Selecciona un método de envío');
        return;
      }
      setError('');
      setStep('pago');
      return;
    }
    if (step === 'pago') {
      if (!watched.metodoPagoId) {
        setError('Selecciona un método de pago');
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
      };
      const res = await createPedido(tienda.id!, sessionId, payload);
      onSuccess(res.id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  const ACENTO = 'var(--acc-acento)';
  const TXT = 'var(--acc-txt)';
  const MUTED = 'var(--acc-muted)';
  const BORDER = 'var(--acc-border)';
  const SURFACE = 'var(--acc-surface)';
  const BTN_TXT = 'var(--acc-btn-txt)';

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '3rem 2rem', maxWidth: '700px', margin: '0 auto', fontFamily: "'Jost', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <button type="button" onClick={() => step === 'datos' ? onClose() : setStep(step === 'entrega' ? 'datos' : step === 'pago' ? 'entrega' : 'pago')} style={{ background: 'none', border: 'none', color: MUTED, fontSize: '.75rem', cursor: 'pointer', letterSpacing: '.1em', textTransform: 'uppercase' }}>
          ← {step === 'datos' ? 'Volver' : 'Atrás'}
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['datos', 'entrega', 'pago', 'resumen'].map((s) => (
            <div key={s} style={{ width: '8px', height: '8px', borderRadius: '50%', background: step === s ? ACENTO : `${ACENTO}33` }} />
          ))}
        </div>
      </div>

      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 300, color: TXT, marginBottom: '2.5rem', textAlign: 'center' }}>
        {step === 'datos' && 'Finalizar Compra'}
        {step === 'entrega' && 'Método de Envío'}
        {step === 'pago' && 'Forma de Pago'}
        {step === 'resumen' && 'Resumen del Pedido'}
      </h1>

      {error && <div style={{ background: '#fef2f2', color: '#991b1b', padding: '1rem', borderRadius: '4px', fontSize: '.85rem', marginBottom: '2rem', border: '1px solid #fee2e2' }}>{error}</div>}

      <div style={{ minHeight: '300px' }}>
        {step === 'datos' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: MUTED, display: 'block', marginBottom: '.5rem' }}>Nombre Completo</label>
              <input {...register('nombre', { required: true })} style={{ width: '100%', padding: '12px', border: `1px solid ${BORDER}`, background: SURFACE, color: TXT, borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: MUTED, display: 'block', marginBottom: '.5rem' }}>Email</label>
              <input {...register('email', { required: true })} style={{ width: '100%', padding: '12px', border: `1px solid ${BORDER}`, background: SURFACE, color: TXT, borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: MUTED, display: 'block', marginBottom: '.5rem' }}>Teléfono</label>
              <input {...register('tel', { required: true })} style={{ width: '100%', padding: '12px', border: `1px solid ${BORDER}`, background: SURFACE, color: TXT, borderRadius: '4px' }} />
            </div>
            <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: MUTED, display: 'block', marginBottom: '.5rem' }}>Calle</label>
                <input {...register('calle', { required: true })} style={{ width: '100%', padding: '12px', border: `1px solid ${BORDER}`, background: SURFACE, color: TXT, borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: MUTED, display: 'block', marginBottom: '.5rem' }}>Nro</label>
                <input {...register('numero', { required: true })} style={{ width: '100%', padding: '12px', border: `1px solid ${BORDER}`, background: SURFACE, color: TXT, borderRadius: '4px' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: MUTED, display: 'block', marginBottom: '.5rem' }}>Ciudad</label>
              <input {...register('ciudad', { required: true })} style={{ width: '100%', padding: '12px', border: `1px solid ${BORDER}`, background: SURFACE, color: TXT, borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: MUTED, display: 'block', marginBottom: '.5rem' }}>Provincia</label>
              <input {...register('provincia', { required: true })} style={{ width: '100%', padding: '12px', border: `1px solid ${BORDER}`, background: SURFACE, color: TXT, borderRadius: '4px' }} />
            </div>
          </div>
        )}

        {step === 'entrega' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tienda?.metodosEntrega?.map((me: any) => (
              <label key={me.metodoEntregaId} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1.5rem', border: `1px solid ${BORDER}`, borderRadius: '12px', cursor: 'pointer', transition: 'all .2s', background: watched.metodoEntregaId == me.metodoEntregaId ? `${ACENTO}05` : SURFACE, borderColor: watched.metodoEntregaId == me.metodoEntregaId ? ACENTO : BORDER }}>
                <input type="radio" value={me.metodoEntregaId} {...register('metodoEntregaId', { required: true })} style={{ accentColor: ACENTO }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 500, color: TXT }}>{me.metodoEntrega?.nombre}</p>
                  <p style={{ margin: 0, fontSize: '.75rem', color: MUTED }}>{me.detalle || 'Envío estándar'}</p>
                </div>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', color: ACENTO }}>{subtotal >= 10000 ? 'Gratis' : '$500'}</span>
              </label>
            ))}
          </div>
        )}

        {step === 'pago' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tienda?.metodosPago?.map((mp: any) => (
              <label key={mp.metodoPagoId} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1.5rem', border: `1px solid ${BORDER}`, borderRadius: '12px', cursor: 'pointer', transition: 'all .2s', background: watched.metodoPagoId == mp.metodoPagoId ? `${ACENTO}05` : SURFACE, borderColor: watched.metodoPagoId == mp.metodoPagoId ? ACENTO : BORDER }}>
                <input type="radio" value={mp.metodoPagoId} {...register('metodoPagoId', { required: true })} style={{ accentColor: ACENTO }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 500, color: TXT }}>{mp.metodoPago?.nombre}</p>
                  <p style={{ margin: 0, fontSize: '.75rem', color: MUTED }}>{mp.detalle || 'Acordar con el vendedor'}</p>
                </div>
              </label>
            ))}
          </div>
        )}

        {step === 'resumen' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ padding: '1.2rem', border: `1px solid ${BORDER}`, borderRadius: '8px' }}>
                   <h4 style={{ margin: '0 0 .5rem', fontSize: '.6rem', letterSpacing: '.1em', textTransform: 'uppercase', color: ACENTO }}>Cliente</h4>
                   <p style={{ margin: 0, fontSize: '.85rem', color: TXT, fontWeight: 500 }}>{watched.nombre}</p>
                   <p style={{ margin: 0, fontSize: '.8rem', color: MUTED }}>{watched.email}</p>
                </div>
                <div style={{ padding: '1.2rem', border: `1px solid ${BORDER}`, borderRadius: '8px' }}>
                   <h4 style={{ margin: '0 0 .5rem', fontSize: '.6rem', letterSpacing: '.1em', textTransform: 'uppercase', color: ACENTO }}>Envío</h4>
                   <p style={{ margin: 0, fontSize: '.85rem', color: TXT, fontWeight: 500 }}>{watched.calle} {watched.numero}</p>
                   <p style={{ margin: 0, fontSize: '.8rem', color: MUTED }}>{watched.ciudad}, {watched.provincia}</p>
                </div>
             </div>

             <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.7rem', color: MUTED, fontSize: '.9rem' }}>
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', color: MUTED, fontSize: '.9rem' }}>
                  <span>Envío</span>
                  <span>{shipCost === 0 ? 'Bonificado' : `$${shipCost.toLocaleString()}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '.75rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: TXT }}>Total Final</span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.4rem', color: ACENTO }}>${total.toLocaleString()}</span>
                </div>
             </div>

             <textarea {...register('notas')} placeholder="Notas sobre tu pedido..." style={{ width: '100%', padding: '1rem', border: `1px solid ${BORDER}`, borderRadius: '8px', background: SURFACE, color: TXT, minHeight: '100px', resize: 'none', fontSize: '.85rem' }} />
          </div>
        )}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <button
          type={step === 'resumen' ? 'submit' : 'button'}
          onClick={step !== 'resumen' ? advanceStep : undefined}
          disabled={loading}
          style={{ width: '100%', padding: '1.2rem', background: ACENTO, color: BTN_TXT, border: 'none', borderRadius: '40px', fontFamily: "'Jost', sans-serif", fontSize: '.8rem', fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all .3s', boxShadow: `0 10px 30px ${ACENTO}33` }}
        >
          {loading ? 'Procesando...' : step === 'resumen' ? 'Confirmar Pedido' : 'Siguiente Paso'}
        </button>
      </div>
    </form>
  );
}
