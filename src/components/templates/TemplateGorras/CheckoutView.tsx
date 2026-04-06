import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createPedido } from '../../../api/pedidos.api';
import { usePerfilCliente } from '../../../hooks/useCliente';
import { useAuthSessionStore } from '../../../store/useAuthSession';
import type { Carrito, Tienda } from './Types';

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

// -- CSS vars --------------------------------------------------
const ACENTO = 'var(--gor-acento)';
const TXT = 'var(--gor-txt)';
const MUTED = 'var(--gor-muted)';
const BORDER = 'var(--gor-border)';
const SURFACE = 'var(--gor-surface)';
const BTN_TXT = 'var(--gor-btn-txt)';

export default function CheckoutView({
  tienda,
  carrito,
  onClose,
  onSuccess,
  sessionId,
}: CheckoutViewProps) {
  const [step, setStep] = useState<CheckoutStep>('datos');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { token } = useAuthSessionStore();
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

  const subtotal = useMemo(
    () =>
      carrito?.items?.reduce((acc, item) => acc + Number(item.precioUnit) * item.cantidad, 0) || 0,
    [carrito]
  );

  // Determinamos el costo de envío basado en el método seleccionado
  const selectedEntrega = tienda?.metodosEntrega?.find(
    (me) => me.metodoEntrega.id === Number(watched.metodoEntregaId)
  );
  const isEnvio =
    selectedEntrega?.metodoEntrega?.nombre?.toLowerCase().includes('envío') ||
    selectedEntrega?.metodoEntrega?.nombre?.toLowerCase().includes('uber');

  const shipCost = isEnvio ? (subtotal >= 15000 ? 0 : 1500) : 0;
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
      if (!watched.metodoEntregaId || watched.metodoEntregaId == 0) {
        setError('Selecciona un método de entrega');
        return;
      }
      setError('');
      setStep('pago');
      return;
    }

    if (step === 'pago') {
      if (!watched.metodoPagoId || watched.metodoPagoId == 0) {
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

  const goBack = () => {
    if (step === 'datos') {
      onClose();
      return;
    }
    if (step === 'entrega') setStep('datos');
    if (step === 'pago') setStep('entrega');
    if (step === 'resumen') setStep('pago');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-6 py-12 min-h-[80vh] flex flex-col"
      style={{ background: 'var(--gor-bg)' }}
    >
      <div className="max-w-[700px] mx-auto w-full flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-10">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-2 bg-transparent border-none text-[.85rem] font-medium cursor-pointer p-0 transition-all hover:opacity-70"
            style={{ color: MUTED, fontFamily: "'DM Sans',sans-serif" }}
          >
            ← {step === 'datos' ? 'Volver al carrito' : 'Atrás'}
          </button>
          <div className="flex gap-1.5 items-center">
            {['datos', 'entrega', 'pago', 'resumen'].map((s, i) => (
              <div
                key={s}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: step === s ? '24px' : '6px',
                  background:
                    step === s
                      ? ACENTO
                      : i < ['datos', 'entrega', 'pago', 'resumen'].indexOf(step)
                        ? ACENTO
                        : BORDER,
                  opacity: step === s ? 1 : 0.4,
                }}
              />
            ))}
          </div>
        </div>

        <h1
          className="font-bold leading-[1.1] mb-6"
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            color: TXT,
          }}
        >
          {step === 'datos' && 'Finalizar Compra'}
          {step === 'entrega' && 'Método de Envío'}
          {step === 'pago' && 'Método de Pago'}
          {step === 'resumen' && 'Resumen Final'}
        </h1>

        {error && (
          <div
            className="mb-8 p-4 rounded-xl text-[.85rem] border font-medium flex items-center gap-3 animate-shake"
            style={{ background: '#fef2f2', color: '#ef4444', borderColor: '#fee2e2' }}
          >
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="flex-1">
          {step === 'datos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 animate-fadeIn">
              <div className="md:col-span-2">
                {perfil && (
                  <div
                    style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setValue('nombre', perfil.nombre + ' ' + perfil.apellido);
                        setValue('email', perfil.email);
                        setValue('tel', perfil.telefono || '');
                      }}
                      style={{
                        background: 'none',
                        border: `1px solid ${ACENTO}`,
                        color: ACENTO,
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        letterSpacing: '0.05em',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = ACENTO;
                        e.currentTarget.style.color = BTN_TXT;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'none';
                        e.currentTarget.style.color = ACENTO;
                      }}
                    >
                      ✨ USAR MIS DATOS
                    </button>
                  </div>
                )}
                <label
                  className="block text-[.7rem] uppercase font-bold tracking-widest mb-2"
                  style={{ color: MUTED }}
                >
                  Nombre Completo
                </label>
                <input
                  {...register('nombre', { required: true })}
                  className="w-full p-4 rounded-xl border text-[.95rem] transition-all outline-none focus:ring-2"
                  style={{
                    background: SURFACE,
                    borderColor: errors.nombre ? '#ef4444' : BORDER,
                    color: TXT,
                  }}
                  placeholder="Ingresa tu nombre..."
                />
              </div>
              <div>
                <label
                  className="block text-[.7rem] uppercase font-bold tracking-widest mb-2"
                  style={{ color: MUTED }}
                >
                  Email
                </label>
                <input
                  {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                  className="w-full p-4 rounded-xl border text-[.95rem] transition-all outline-none"
                  style={{
                    background: SURFACE,
                    borderColor: errors.email ? '#ef4444' : BORDER,
                    color: TXT,
                  }}
                  placeholder="juan@gmail.com"
                />
              </div>
              <div>
                <label
                  className="block text-[.7rem] uppercase font-bold tracking-widest mb-2"
                  style={{ color: MUTED }}
                >
                  Teléfono
                </label>
                <input
                  {...register('tel', { required: true })}
                  className="w-full p-4 rounded-xl border text-[.95rem] transition-all outline-none"
                  style={{
                    background: SURFACE,
                    borderColor: errors.tel ? '#ef4444' : BORDER,
                    color: TXT,
                  }}
                  placeholder="381 000 0000"
                />
              </div>
              <div className="md:col-span-2 grid grid-cols-[1fr, 80px] gap-4">
                <div>
                  <label
                    className="block text-[.7rem] uppercase font-bold tracking-widest mb-2"
                    style={{ color: MUTED }}
                  >
                    Calle
                  </label>
                  <input
                    {...register('calle', { required: true })}
                    className="w-full p-4 rounded-xl border text-[.95rem] transition-all outline-none"
                    style={{
                      background: SURFACE,
                      borderColor: errors.calle ? '#ef4444' : BORDER,
                      color: TXT,
                    }}
                    placeholder="Nombre de la calle"
                  />
                </div>
                <div>
                  <label
                    className="block text-[.7rem] uppercase font-bold tracking-widest mb-2"
                    style={{ color: MUTED }}
                  >
                    N°
                  </label>
                  <input
                    {...register('numero', { required: true })}
                    className="w-full p-4 rounded-xl border text-[.95rem] transition-all outline-none"
                    style={{
                      background: SURFACE,
                      borderColor: errors.numero ? '#ef4444' : BORDER,
                      color: TXT,
                    }}
                    placeholder="123"
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-[.7rem] uppercase font-bold tracking-widest mb-2"
                  style={{ color: MUTED }}
                >
                  Ciudad
                </label>
                <input
                  {...register('ciudad', { required: true })}
                  className="w-full p-4 rounded-xl border text-[.95rem] transition-all outline-none"
                  style={{
                    background: SURFACE,
                    borderColor: errors.ciudad ? '#ef4444' : BORDER,
                    color: TXT,
                  }}
                  placeholder="Tucumán"
                />
              </div>
              <div>
                <label
                  className="block text-[.7rem] uppercase font-bold tracking-widest mb-2"
                  style={{ color: MUTED }}
                >
                  Provincia
                </label>
                <input
                  {...register('provincia', { required: true })}
                  className="w-full p-4 rounded-xl border text-[.95rem] transition-all outline-none"
                  style={{
                    background: SURFACE,
                    borderColor: errors.provincia ? '#ef4444' : BORDER,
                    color: TXT,
                  }}
                  placeholder="Tucumán"
                />
              </div>
            </div>
          )}

          {step === 'entrega' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              {tienda?.metodosEntrega?.length ? (
                tienda.metodosEntrega.map((me: any) => (
                  <label
                    key={me.metodoEntregaId}
                    className="flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all hover:bg-zinc-50"
                    style={{
                      borderColor: watched.metodoEntregaId == me.metodoEntregaId ? ACENTO : BORDER,
                      background:
                        watched.metodoEntregaId == me.metodoEntregaId ? `${ACENTO}05` : SURFACE,
                    }}
                  >
                    <input
                      type="radio"
                      value={me.metodoEntregaId}
                      {...register('metodoEntregaId', { required: true })}
                      className="w-5 h-5"
                      style={{ accentColor: ACENTO }}
                    />
                    <div className="flex-1">
                      <p className="font-bold text-[.95rem]" style={{ color: TXT }}>
                        {me.metodoEntrega?.nombre || 'Envío'}
                      </p>
                      <p className="text-[.8rem]" style={{ color: MUTED }}>
                        {me.detalle || 'Coordinar con la tienda'}
                      </p>
                    </div>
                    <span className="font-bold" style={{ color: TXT }}>
                      {me.metodoEntrega?.nombre?.toLowerCase().includes('envío') ||
                      me.metodoEntrega?.nombre?.toLowerCase().includes('uber')
                        ? subtotal >= 15000
                          ? 'GRATIS'
                          : '$1.500'
                        : 'GRATIS'}
                    </span>
                  </label>
                ))
              ) : (
                <p style={{ color: MUTED }}>No hay métodos de envío disponibles.</p>
              )}
            </div>
          )}

          {step === 'pago' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              {tienda?.metodosPago?.length ? (
                tienda.metodosPago.map((mp: any) => (
                  <label
                    key={mp.metodoPagoId}
                    className="flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all hover:bg-zinc-50"
                    style={{
                      borderColor: watched.metodoPagoId == mp.metodoPagoId ? ACENTO : BORDER,
                      background: watched.metodoPagoId == mp.metodoPagoId ? `${ACENTO}05` : SURFACE,
                    }}
                  >
                    <input
                      type="radio"
                      value={mp.metodoPagoId}
                      {...register('metodoPagoId', { required: true })}
                      className="w-5 h-5"
                      style={{ accentColor: ACENTO }}
                    />
                    <div className="flex-1">
                      <p className="font-bold text-[.95rem]" style={{ color: TXT }}>
                        {mp.metodoPago?.nombre || 'Pago'}
                      </p>
                      <p className="text-[.8rem]" style={{ color: MUTED }}>
                        {mp.detalle || 'Efectivo, Transferencia o Tarjeta'}
                      </p>
                    </div>
                  </label>
                ))
              ) : (
                <p style={{ color: MUTED }}>No hay métodos de pago disponibles.</p>
              )}
            </div>
          )}

          {step === 'resumen' && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              <div
                className="bg-zinc-50 p-6 rounded-2xl border"
                style={{ borderColor: BORDER, background: SURFACE }}
              >
                <h4
                  className="text-[.7rem] uppercase font-black tracking-widest mb-4"
                  style={{ color: ACENTO }}
                >
                  Tu Pedido
                </h4>
                <div className="space-y-3 mb-6">
                  {carrito.items.map((it: any) => (
                    <div key={it.id} className="flex justify-between items-center text-[.9rem]">
                      <span style={{ color: TXT }}>
                        {it.cantidad}x {it.producto?.nombre}
                        {it.variante && (
                          <span
                            style={{
                              color: ACENTO,
                              marginLeft: 4,
                              fontWeight: 'bold',
                              opacity: 0.8,
                            }}
                          >
                            ({it.variante.nombre})
                          </span>
                        )}
                      </span>
                      <span className="font-bold" style={{ color: TXT }}>
                        ${(Number(it.precioUnit) * it.cantidad).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-[.85rem]" style={{ color: MUTED }}>
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[.85rem]" style={{ color: MUTED }}>
                    <span>Envío ({watched.metodoEntregaId == 1 ? 'Domicilio' : 'Retiro'})</span>
                    <span>{shipCost === 0 ? 'Gratis' : `$${shipCost.toLocaleString()}`}</span>
                  </div>
                  <div
                    className="flex justify-between items-center pt-2 mt-2 border-t text-xl font-bold"
                    style={{ color: TXT, borderColor: BORDER }}
                  >
                    <span>TOTAL</span>
                    <span style={{ color: ACENTO }}>${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <label
                  className="block text-[.7rem] uppercase font-bold tracking-widest mb-2"
                  style={{ color: MUTED }}
                >
                  Notas adicionales
                </label>
                <textarea
                  {...register('notas')}
                  className="w-full p-4 rounded-xl border text-[.9rem] min-h-[100px] transition-all outline-none"
                  style={{ background: SURFACE, borderColor: BORDER, color: TXT, resize: 'none' }}
                  placeholder="¿Alguna instrucción especial para tu envío?"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 flex flex-col gap-4">
          <button
            type={step === 'resumen' ? 'submit' : 'button'}
            onClick={step !== 'resumen' ? advanceStep : undefined}
            disabled={loading}
            className="w-full py-5 rounded-2xl text-[1rem] font-bold border-none transition-all active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50"
            style={{
              background: ACENTO,
              color: BTN_TXT,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {loading
              ? 'Procesando...'
              : step === 'resumen'
                ? 'Finalizar Pedido'
                : 'Continuar al siguiente paso'}
          </button>
          <p
            className="text-[.75rem] text-center max-w-[400px] mx-auto leading-relaxed"
            style={{ color: MUTED }}
          >
            {step === 'resumen'
              ? 'Al confirmar, registraremos tu pedido y nos pondremos en contacto.'
              : 'Completa la información para avanzar. Tus datos están 100% protegidos.'}
          </p>
        </div>
      </div>
    </form>
  );
}
