import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createPedido } from '../../../api/pedidos.api';
import { usePerfilCliente } from '../../../hooks/useCliente';
import { useAuthSessionStore } from '../../../store/useAuthSession';

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

// ── COLORES ───────────────────────────────────────────────────
const DARK = 'var(--rop-dark)';
const ACENTO = 'var(--rop-acento)';
const MUTED = 'var(--rop-muted)';
const BORDER = 'var(--rop-border)';
const BG = 'var(--rop-bg)';

// ── HELPERS ───────────────────────────────────────────────────
const inputClass = 'w-full py-3 px-3.5 rounded outline-none text-sm';
const labelClass = 'text-[.7rem] font-semibold uppercase';

export default function CheckoutView({
  tienda,
  carrito,
  onClose,
  onSuccess,
  sessionId,
}: CheckoutViewProps) {
  const { token } = useAuthSessionStore();
  const { data: perfil } = usePerfilCliente(!!token);
  const [step, setStep] = useState<CheckoutStep>('datos');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: {},
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      nombre: '', email: '', tel: '', calle: '', numero: '',
      ciudad: '', provincia: '', metodoEntregaId: 0, metodoPagoId: 0, notas: '',
    },
  });

  const watched = watch();
  const subtotal = useMemo(
    () => carrito.items.reduce((acc: number, item: any) => acc + Number(item.precioUnit) * item.cantidad, 0),
    [carrito]
  );
  const shipCost = Number(watched.metodoEntregaId) > 0 ? (subtotal >= 10000 ? 0 : 900) : 0;
  const total = subtotal + shipCost;

  const advanceStep = async () => {
    if (step === 'datos') {
      const ok = await trigger(['nombre', 'email', 'tel', 'calle', 'ciudad', 'provincia']);
      if (!ok) { setError('Por favor completa los campos obligatorios'); return; }
      setError(''); setStep('entrega'); return;
    }
    if (step === 'entrega') {
      const ok = await trigger('metodoEntregaId');
      if (!ok) { setError('Selecciona un método de entrega'); return; }
      setError(''); setStep('pago'); return;
    }
    if (step === 'pago') {
      const ok = await trigger('metodoPagoId');
      if (!ok) { setError('Selecciona un método de pago'); return; }
      setError(''); setStep('resumen'); return;
    }
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    setLoading(true); setError('');
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

  const goBack = () => {
    if (step === 'datos') { onClose(); return; }
    if (step === 'entrega') setStep('datos');
    if (step === 'pago') setStep('entrega');
    if (step === 'resumen') setStep('pago');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8 max-w-[600px] mx-auto p-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={goBack}
          className="bg-transparent border-none cursor-pointer flex items-center gap-1.5 text-[.8rem]"
          style={{ color: MUTED, fontFamily: "'Outfit',sans-serif" }}
        >
          ← {step === 'datos' ? 'Volver al carrito' : 'Atrás'}
        </button>
        <span
          className="text-base tracking-[.1em]"
          style={{ fontFamily: "'Bebas Neue',sans-serif", color: ACENTO }}
        >
          PASO {step === 'datos' ? '1' : step === 'entrega' ? '2' : step === 'pago' ? '3' : '4'} / 4
        </span>
      </div>

      {/* Title */}
      <h1
        className="text-[2.5rem] m-0 tracking-[.02em]"
        style={{ fontFamily: "'Bebas Neue',sans-serif", color: DARK }}
      >
        {step === 'datos' && 'TUS DATOS'}
        {step === 'entrega' && 'ENVÍO'}
        {step === 'pago' && 'PAGO'}
        {step === 'resumen' && 'RESUMEN'}
      </h1>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded text-[.9rem] border border-red-200">
          {error}
        </div>
      )}

      {/* Step content */}
      <div className="flex-1">
        {/* ── DATOS ── */}
        {step === 'datos' && (
          <div className="flex flex-col gap-5">
            {perfil && (
              <button
                type="button"
                onClick={() => {
                  if (perfil?.datos) {
                    const { nombre, apellido, email, telefono } = perfil.datos;
                    setValue('nombre', `${nombre} ${apellido}`);
                    setValue('email', email);
                    setValue('tel', telefono || '');
                  }
                }}
                className="self-start bg-transparent py-2 px-3 rounded cursor-pointer text-[.7rem] font-semibold"
                style={{ border: `1px solid ${BORDER}`, color: ACENTO, fontFamily: "'Outfit',sans-serif" }}
              >
                ✨ USAR MIS DATOS GUARDADOS
              </button>
            )}

            <Field label="Nombre Completo">
              <input {...register('nombre', { required: true })} className={inputClass} placeholder="Ej: Juan Pérez" style={{ border: `1px solid ${BORDER}`, background: BG, color: DARK }} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Email">
                <input {...register('email', { required: true, pattern: /^\S+@\S+$/i })} className={inputClass} placeholder="juan@email.com" style={{ border: `1px solid ${BORDER}`, background: BG, color: DARK }} />
              </Field>
              <Field label="Teléfono">
                <input {...register('tel', { required: true })} className={inputClass} placeholder="11 2233-4455" style={{ border: `1px solid ${BORDER}`, background: BG, color: DARK }} />
              </Field>
            </div>

            <div className="grid grid-cols-[3fr_1fr] gap-4">
              <Field label="Calle">
                <input {...register('calle', { required: true })} className={inputClass} placeholder="Ej: Av. Santa Fe" style={{ border: `1px solid ${BORDER}`, background: BG, color: DARK }} />
              </Field>
              <Field label="Altura">
                <input {...register('numero', { required: true })} className={inputClass} placeholder="1234" style={{ border: `1px solid ${BORDER}`, background: BG, color: DARK }} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Ciudad">
                <input {...register('ciudad', { required: true })} className={inputClass} placeholder="Ej: CABA" style={{ border: `1px solid ${BORDER}`, background: BG, color: DARK }} />
              </Field>
              <Field label="Provincia">
                <input {...register('provincia', { required: true })} className={inputClass} placeholder="Buenos Aires" style={{ border: `1px solid ${BORDER}`, background: BG, color: DARK }} />
              </Field>
            </div>
          </div>
        )}

        {/* ── ENTREGA ── */}
        {step === 'entrega' && (
          <div className="flex flex-col gap-4">
            {tienda?.metodosEntrega?.map((me: any) => (
              <label
                key={me.metodoEntregaId}
                className="flex items-center gap-3 p-4 rounded-lg cursor-pointer"
                style={{
                  border: `1px solid ${watched.metodoEntregaId == me.metodoEntregaId ? ACENTO : BORDER}`,
                  background: watched.metodoEntregaId == me.metodoEntregaId ? `${ACENTO}08` : 'transparent',
                }}
              >
                <input
                  type="radio"
                  value={me.metodoEntregaId}
                  {...register('metodoEntregaId', { required: true })}
                  style={{ accentColor: ACENTO }}
                />
                <div className="flex-1">
                  <p className="m-0 font-semibold text-[.9rem]" style={{ color: DARK }}>{me.metodoEntrega?.nombre}</p>
                  <p className="m-0 text-[.75rem]" style={{ color: MUTED }}>{me.detalle || 'Envío a domicilio'}</p>
                </div>
                <span className="font-bold text-[.9rem]" style={{ color: DARK }}>
                  {subtotal >= 10000 ? 'Gratis' : '$900'}
                </span>
              </label>
            ))}
          </div>
        )}

        {/* ── PAGO ── */}
        {step === 'pago' && (
          <div className="flex flex-col gap-4">
            {tienda?.metodosPago?.map((mp: any) => (
              <label
                key={mp.metodoPagoId}
                className="flex items-center gap-3 p-4 rounded-lg cursor-pointer"
                style={{
                  border: `1px solid ${watched.metodoPagoId == mp.metodoPagoId ? ACENTO : BORDER}`,
                  background: watched.metodoPagoId == mp.metodoPagoId ? `${ACENTO}08` : 'transparent',
                }}
              >
                <input
                  type="radio"
                  value={mp.metodoPagoId}
                  {...register('metodoPagoId', { required: true })}
                  style={{ accentColor: ACENTO }}
                />
                <div className="flex-1">
                  <p className="m-0 font-semibold text-[.9rem]" style={{ color: DARK }}>{mp.metodoPago?.nombre}</p>
                  <p className="m-0 text-[.75rem]" style={{ color: MUTED }}>{mp.detalle || 'Paga al recibir o transferencia'}</p>
                </div>
              </label>
            ))}
          </div>
        )}

        {/* ── RESUMEN ── */}
        {step === 'resumen' && (
          <div className="flex flex-col gap-6">
            {/* Address card */}
            <div
              className="p-4 rounded-lg"
              style={{ background: `${ACENTO}05`, border: `1px dashed ${BORDER}` }}
            >
              <p className="m-0 mb-2 text-[.7rem] font-bold uppercase" style={{ color: ACENTO }}>Enviar a:</p>
              <p className="m-0 text-[.9rem] font-medium" style={{ color: DARK }}>{watched.nombre}</p>
              <p className="m-0 text-[.85rem]" style={{ color: MUTED }}>
                {watched.calle} {watched.numero}, {watched.ciudad}
              </p>
            </div>

            {/* Totals */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-[.9rem]" style={{ color: MUTED }}>
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[.9rem]" style={{ color: MUTED }}>
                <span>Envío</span>
                <span style={{ color: shipCost === 0 ? '#16a34a' : MUTED }}>
                  {shipCost === 0 ? 'Gratis' : `$${shipCost.toLocaleString()}`}
                </span>
              </div>
              <div
                className="flex justify-between text-xl font-extrabold pt-3"
                style={{ color: DARK, borderTop: `1px solid ${BORDER}` }}
              >
                <span>TOTAL</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>

            {/* Notes */}
            <textarea
              {...register('notas')}
              placeholder="Notas adicionales (opcional)"
              className="p-3.5 rounded min-h-[80px] text-[.85rem] outline-none resize-y"
              style={{
                border: `1px solid ${BORDER}`,
                background: BG,
                color: DARK,
                fontFamily: "'Outfit',sans-serif",
              }}
            />
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type={step === 'resumen' ? 'submit' : 'button'}
        onClick={step !== 'resumen' ? advanceStep : undefined}
        disabled={loading}
        className="w-full py-5 border-none rounded text-xl tracking-[.1em] mt-4 transition-all duration-200 text-white"
        style={{
          background: DARK,
          fontFamily: "'Bebas Neue',sans-serif",
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'PROCESANDO...' : step === 'resumen' ? 'FINALIZAR PEDIDO' : 'CONTINUAR'}
      </button>

      <p
        className="text-center text-[.7rem] uppercase tracking-[.05em]"
        style={{ color: MUTED }}
      >
        Tus datos están protegidos y son necesarios para procesar la compra.
      </p>
    </form>
  );
}

// ── Field helper component ────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className={labelClass} style={{ color: MUTED }}>{label}</label>
      {children}
    </div>
  );
}
