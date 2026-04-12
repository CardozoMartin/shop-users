import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  Truck,
  CreditCard,
  ShoppingBag,
  AlertCircle,
  Banknote,
  Zap,
  MapPin,
} from 'lucide-react';
import { createPedido } from '../../../api/pedidos.api';
import { usePerfilCliente } from '../../../hooks/useCliente';
import { useAuthSessionStore } from '../../../store/useAuthSession';
import type { Carrito, Tienda } from './Types';

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Step config ──────────────────────────────────────────────────────────────

const STEPS: CheckoutStep[] = ['datos', 'entrega', 'pago', 'resumen'];

const STEP_META: Record<CheckoutStep, { title: string; subtitle: string }> = {
  datos: {
    title: 'Finalizar compra',
    subtitle: 'Completá tus datos de contacto y dirección de entrega.',
  },
  entrega: {
    title: 'Método de entrega',
    subtitle: 'Elegí cómo querés recibir tu pedido.',
  },
  pago: {
    title: 'Método de pago',
    subtitle: 'Elegí cómo vas a abonar.',
  },
  resumen: {
    title: 'Revisá tu pedido',
    subtitle: 'Confirmá que todo esté correcto antes de continuar.',
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepDots({ current }: { current: CheckoutStep }) {
  const ci = STEPS.indexOf(current);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {STEPS.map((s, i) => (
        <div
          key={s}
          style={{
            height: 5,
            borderRadius: 4,
            background:
              i === ci
                ? 'var(--gor-txt)'
                : i < ci
                  ? 'var(--gor-muted)'
                  : 'var(--gor-border)',
            opacity: i === ci ? 1 : i < ci ? 0.45 : 0.25,
            width: i === ci ? 22 : 6,
            transition: 'width 0.25s, background 0.25s, opacity 0.25s',
          }}
        />
      ))}
      <span
        style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.06em',
          color: 'var(--gor-muted)',
          marginLeft: 4,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {ci + 1} / {STEPS.length}
      </span>
    </div>
  );
}

const inputBase: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '11px 13px',
  borderRadius: 10,
  border: '1px solid var(--gor-border)',
  background: 'var(--gor-surface)',
  color: 'var(--gor-txt)',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.15s',
};

function FieldInput({
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      style={{ ...inputBase, borderColor: error ? '#dc2626' : 'var(--gor-border)' }}
      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--gor-txt)')}
      onBlur={(e) =>
        (e.currentTarget.style.borderColor = error ? '#dc2626' : 'var(--gor-border)')
      }
      {...props}
    />
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: 'block',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        color: 'var(--gor-muted)',
        marginBottom: 5,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {children}
    </label>
  );
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: 'var(--gor-surface)',
        border: '1px solid var(--gor-border)',
        borderRadius: 14,
        padding: '16px 18px',
        marginBottom: 12,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 14,
          paddingBottom: 12,
          borderBottom: '1px solid var(--gor-border)',
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 8,
            background: 'var(--gor-bg)',
            border: '1px solid var(--gor-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: 'var(--gor-muted)',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        fontSize: 13,
        padding: '3px 0',
        gap: 8,
      }}
    >
      <span style={{ color: 'var(--gor-muted)', flexShrink: 0 }}>{label}</span>
      <span
        style={{
          fontWeight: 500,
          color: 'var(--gor-txt)',
          textAlign: 'right',
          wordBreak: 'break-word',
        }}
      >
        {value || '—'}
      </span>
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  name,
  desc,
  right,
}: {
  selected: boolean;
  onClick: () => void;
  name: string;
  desc?: string;
  right?: React.ReactNode;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 16px',
        borderRadius: 12,
        border: selected ? '1.5px solid var(--gor-txt)' : '1px solid var(--gor-border)',
        background: selected ? 'var(--gor-bg)' : 'var(--gor-surface)',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
        marginBottom: 10,
        userSelect: 'none',
      }}
    >
      {/* Radio circulo */}
      <div
        style={{
          width: 17,
          height: 17,
          borderRadius: '50%',
          border: `1.5px solid ${selected ? 'var(--gor-txt)' : 'var(--gor-border)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'border-color 0.15s',
        }}
      >
        {selected && (
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--gor-txt)',
            }}
          />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--gor-txt)' }}>{name}</div>
        {desc && (
          <div style={{ fontSize: 12, color: 'var(--gor-muted)', marginTop: 2 }}>{desc}</div>
        )}
      </div>

      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

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
      carrito?.items?.reduce(
        (acc, item) => acc + Number(item.precioUnit) * item.cantidad,
        0,
      ) || 0,
    [carrito],
  );

  const selectedEntrega = tienda?.metodosEntrega?.find(
    (me) => me.metodoEntrega.id === Number(watched.metodoEntregaId),
  );
  const isEnvio =
    selectedEntrega?.metodoEntrega?.nombre?.toLowerCase().includes('envío') ||
    selectedEntrega?.metodoEntrega?.nombre?.toLowerCase().includes('uber');

  const shipCost = isEnvio ? (subtotal >= 15000 ? 0 : 1500) : 0;
  const total = subtotal + shipCost;

  const selectedPago = tienda?.metodosPago?.find(
    (mp: any) => mp.metodoPagoId == watched.metodoPagoId,
  );

  const stepIndex = STEPS.indexOf(step);
  const isResumen = step === 'resumen';
  const { title, subtitle } = STEP_META[step];

  // ── Avanzar paso ──────────────────────────────────────────────────────────
  const advance = async () => {
    if (step === 'datos') {
      const ok = await trigger(['nombre', 'email', 'tel', 'calle', 'ciudad', 'provincia']);
      if (!ok) {
        setError('Completá todos los campos obligatorios.');
        return;
      }
    }
    if (step === 'entrega' && (!watched.metodoEntregaId || watched.metodoEntregaId == 0)) {
      setError('Seleccioná un método de entrega.');
      return;
    }
    if (step === 'pago' && (!watched.metodoPagoId || watched.metodoPagoId == 0)) {
      setError('Seleccioná un método de pago.');
      return;
    }
    setError('');
    setStep(STEPS[stepIndex + 1]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (step === 'datos') {
      onClose();
      return;
    }
    setError('');
    setStep(STEPS[stepIndex - 1]);
  };

  // ── Confirmar pedido ──────────────────────────────────────────────────────
  const onSubmit = async (data: CheckoutFormValues) => {
    setLoading(true);
    setError('');
    try {
      const res = await createPedido(tienda.id!, sessionId, {
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
      });
      onSuccess(res.id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ocurrió un error al procesar el pedido.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        background: 'var(--gor-bg)',
        minHeight: '100vh',
        padding: 'clamp(1.5rem, 4vw, 2.5rem) 1rem',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
          }}
        >
          <button
            type="button"
            onClick={goBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--gor-muted)',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'color 0.15s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--gor-txt)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--gor-muted)')}
          >
            <ArrowLeft size={14} strokeWidth={2} />
            {step === 'datos' ? 'Volver al carrito' : 'Atrás'}
          </button>

          <StepDots current={step} />
        </div>

        {/* ── Title ──────────────────────────────────────────────────── */}
        <h1
          style={{
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontWeight: 400,
            fontSize: 'clamp(1.7rem, 5vw, 2.4rem)',
            color: 'var(--gor-txt)',
            lineHeight: 1.1,
            margin: '0 0 0.3rem',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 13,
            color: 'var(--gor-muted)',
            margin: '0 0 2rem',
          }}
        >
          {subtitle}
        </p>

        {/* ── Error ──────────────────────────────────────────────────── */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '11px 15px',
              borderRadius: 10,
              background: '#fef2f2',
              color: '#b91c1c',
              fontSize: 13,
              fontWeight: 500,
              marginBottom: '1.5rem',
              border: '1px solid #fecaca',
            }}
          >
            <AlertCircle size={15} strokeWidth={2} style={{ flexShrink: 0 }} />
            {error}
          </div>
        )}

        {/* ══ PASO 1: DATOS ══════════════════════════════════════════ */}
        {step === 'datos' && (
          <div>
            {perfil && (
              <button
                type="button"
                onClick={() => {
                  setValue('nombre', `${perfil.nombre} ${perfil.apellido}`);
                  setValue('email', perfil.email);
                  setValue('tel', perfil.telefono || '');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--gor-muted)',
                  border: '1px solid var(--gor-border)',
                  background: 'var(--gor-surface)',
                  borderRadius: 20,
                  padding: '5px 12px',
                  cursor: 'pointer',
                  marginBottom: 18,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gor-txt)';
                  e.currentTarget.style.color = 'var(--gor-txt)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gor-border)';
                  e.currentTarget.style.color = 'var(--gor-muted)';
                }}
              >
                <User size={12} strokeWidth={2} />
                Usar mis datos guardados
              </button>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 14,
              }}
            >
              {/* Nombre — full width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <FieldLabel>Nombre completo</FieldLabel>
                <FieldInput
                  {...register('nombre', { required: true })}
                  error={!!errors.nombre}
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div>
                <FieldLabel>Email</FieldLabel>
                <FieldInput
                  {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                  error={!!errors.email}
                  type="email"
                  placeholder="juan@email.com"
                />
              </div>

              <div>
                <FieldLabel>Teléfono</FieldLabel>
                <FieldInput
                  {...register('tel', { required: true })}
                  error={!!errors.tel}
                  placeholder="381 000 0000"
                />
              </div>

              {/* Calle + Número */}
              <div
                style={{
                  gridColumn: '1 / -1',
                  display: 'grid',
                  gridTemplateColumns: '1fr 90px',
                  gap: 12,
                }}
              >
                <div>
                  <FieldLabel>Calle</FieldLabel>
                  <FieldInput
                    {...register('calle', { required: true })}
                    error={!!errors.calle}
                    placeholder="Nombre de la calle"
                  />
                </div>
                <div>
                  <FieldLabel>N°</FieldLabel>
                  <FieldInput
                    {...register('numero')}
                    placeholder="123"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Ciudad</FieldLabel>
                <FieldInput
                  {...register('ciudad', { required: true })}
                  error={!!errors.ciudad}
                  placeholder="Tucumán"
                />
              </div>

              <div>
                <FieldLabel>Provincia</FieldLabel>
                <FieldInput
                  {...register('provincia', { required: true })}
                  error={!!errors.provincia}
                  placeholder="Tucumán"
                />
              </div>
            </div>
          </div>
        )}

        {/* ══ PASO 2: ENTREGA ════════════════════════════════════════ */}
        {step === 'entrega' && (
          <div>
            {tienda?.metodosEntrega?.length ? (
              tienda.metodosEntrega.map((me: any) => {
                const esEnvio =
                  me.metodoEntrega?.nombre?.toLowerCase().includes('envío') ||
                  me.metodoEntrega?.nombre?.toLowerCase().includes('uber');
                const costo = esEnvio ? (subtotal >= 15000 ? 0 : 1500) : 0;

                return (
                  <OptionCard
                    key={me.metodoEntregaId}
                    selected={watched.metodoEntregaId == me.metodoEntregaId}
                    onClick={() => {
                      setValue('metodoEntregaId', me.metodoEntregaId);
                      setError('');
                    }}
                    name={me.metodoEntrega?.nombre || 'Entrega'}
                    desc={me.detalle || 'Coordinar con la tienda'}
                    right={
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: costo === 0 ? '#15803d' : 'var(--gor-txt)',
                        }}
                      >
                        {costo === 0 ? 'Sin costo' : `$${costo.toLocaleString()}`}
                      </span>
                    }
                  />
                );
              })
            ) : (
              <p style={{ color: 'var(--gor-muted)', fontSize: 14 }}>
                No hay métodos de entrega disponibles.
              </p>
            )}
          </div>
        )}

        {/* ══ PASO 3: PAGO ═══════════════════════════════════════════ */}
        {step === 'pago' && (
          <div>
            {tienda?.metodosPago?.length ? (
              tienda.metodosPago.map((mp: any) => {
                const nombre = mp.metodoPago?.nombre?.toLowerCase() || '';
                const icon =
                  nombre.includes('efectivo') ? (
                    <Banknote size={14} strokeWidth={1.5} color="var(--gor-muted)" />
                  ) : nombre.includes('tarjeta') ? (
                    <CreditCard size={14} strokeWidth={1.5} color="var(--gor-muted)" />
                  ) : (
                    <Zap size={14} strokeWidth={1.5} color="var(--gor-muted)" />
                  );

                return (
                  <OptionCard
                    key={mp.metodoPagoId}
                    selected={watched.metodoPagoId == mp.metodoPagoId}
                    onClick={() => {
                      setValue('metodoPagoId', mp.metodoPagoId);
                      setError('');
                    }}
                    name={mp.metodoPago?.nombre || 'Pago'}
                    desc={mp.detalle || 'Efectivo, Transferencia o Tarjeta'}
                    right={icon}
                  />
                );
              })
            ) : (
              <p style={{ color: 'var(--gor-muted)', fontSize: 14 }}>
                No hay métodos de pago disponibles.
              </p>
            )}
          </div>
        )}

        {/* ══ PASO 4: RESUMEN ════════════════════════════════════════ */}
        {step === 'resumen' && (
          <div>

            {/* Datos del comprador */}
            <SectionCard
              icon={<User size={13} strokeWidth={1.75} color="var(--gor-muted)" />}
              title="Datos del comprador"
            >
              <KV label="Nombre" value={watched.nombre} />
              <KV label="Email" value={watched.email} />
              <KV label="Teléfono" value={watched.tel} />
            </SectionCard>

            {/* Dirección */}
            <SectionCard
              icon={<MapPin size={13} strokeWidth={1.75} color="var(--gor-muted)" />}
              title="Dirección de entrega"
            >
              <KV
                label="Dirección"
                value={
                  [watched.calle, watched.numero, watched.ciudad, watched.provincia]
                    .filter(Boolean)
                    .join(', ')
                }
              />
            </SectionCard>

            {/* Entrega y pago */}
            <SectionCard
              icon={<Truck size={13} strokeWidth={1.75} color="var(--gor-muted)" />}
              title="Entrega y pago"
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: 10,
                }}
              >
                {/* Envío */}
                <div
                  style={{
                    background: 'var(--gor-bg)',
                    border: '1px solid var(--gor-border)',
                    borderRadius: 10,
                    padding: '11px 13px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      marginBottom: 3,
                    }}
                  >
                    <Truck size={11} strokeWidth={1.75} color="var(--gor-muted)" />
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        color: 'var(--gor-muted)',
                      }}
                    >
                      Envío
                    </span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gor-txt)' }}>
                    {selectedEntrega?.metodoEntrega?.nombre || '—'}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--gor-muted)' }}>
                    {shipCost === 0 ? 'Sin costo adicional' : `$${shipCost.toLocaleString()}`}
                  </span>
                </div>

                {/* Pago */}
                <div
                  style={{
                    background: 'var(--gor-bg)',
                    border: '1px solid var(--gor-border)',
                    borderRadius: 10,
                    padding: '11px 13px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      marginBottom: 3,
                    }}
                  >
                    <CreditCard size={11} strokeWidth={1.75} color="var(--gor-muted)" />
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        color: 'var(--gor-muted)',
                      }}
                    >
                      Pago
                    </span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gor-txt)' }}>
                    {selectedPago?.metodoPago?.nombre || '—'}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--gor-muted)' }}>
                    {selectedPago?.detalle || ''}
                  </span>
                </div>
              </div>
            </SectionCard>

            {/* Productos */}
            <SectionCard
              icon={<ShoppingBag size={13} strokeWidth={1.75} color="var(--gor-muted)" />}
              title="Productos"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                {carrito.items.map((it: any) => (
                  <div
                    key={it.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      fontSize: 13,
                      gap: 8,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <span style={{ color: 'var(--gor-txt)', fontWeight: 500 }}>
                        {it.cantidad}×
                      </span>{' '}
                      <span style={{ color: 'var(--gor-txt)' }}>{it.producto?.nombre}</span>
                      {it.variante && (
                        <div
                          style={{
                            fontSize: 11,
                            color: 'var(--gor-muted)',
                            marginTop: 2,
                          }}
                        >
                          {it.variante.nombre}
                        </div>
                      )}
                    </div>
                    <span style={{ fontWeight: 500, color: 'var(--gor-txt)', whiteSpace: 'nowrap' }}>
                      ${(Number(it.precioUnit) * it.cantidad).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div
                style={{
                  borderTop: '1px solid var(--gor-border)',
                  paddingTop: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 7,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--gor-muted)' }}>Subtotal</span>
                  <span style={{ color: 'var(--gor-txt)' }}>${subtotal.toLocaleString()}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: 'var(--gor-muted)' }}>Envío</span>
                  {shipCost === 0 ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 20,
                        background: '#dcfce7',
                        color: '#15803d',
                      }}
                    >
                      <Check size={10} strokeWidth={2.5} />
                      Gratis
                    </span>
                  ) : (
                    <span style={{ color: 'var(--gor-txt)' }}>${shipCost.toLocaleString()}</span>
                  )}
                </div>

                <div
                  style={{
                    borderTop: '1px solid var(--gor-border)',
                    paddingTop: 11,
                    marginTop: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gor-txt)' }}>
                    Total
                  </span>
                  <span
                    style={{
                      fontFamily: "'Playfair Display', 'Georgia', serif",
                      fontSize: '1.45rem',
                      fontWeight: 400,
                      color: 'var(--gor-txt)',
                    }}
                  >
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>
            </SectionCard>

            {/* Notas */}
            <div style={{ marginTop: 4 }}>
              <FieldLabel>
                Notas adicionales{' '}
                <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>
                  (opcional)
                </span>
              </FieldLabel>
              <textarea
                {...register('notas')}
                placeholder="¿Alguna indicación especial para tu pedido?"
                style={{
                  ...inputBase,
                  resize: 'none',
                  minHeight: 78,
                }}
              />
            </div>
          </div>
        )}

        {/* ── Actions ─────────────────────────────────────────────────── */}
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Botón avance — SIEMPRE type="button", nunca dispara submit */}
          {!isResumen && (
            <button
              type="button"
              onClick={advance}
              style={{
                width: '100%',
                padding: '13px 20px',
                borderRadius: 12,
                border: 'none',
                background: 'var(--gor-txt)',
                color: 'var(--gor-bg)',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'opacity 0.15s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Continuar
              <ArrowRight size={15} strokeWidth={2} />
            </button>
          )}

          {/* Botón confirmación — SIEMPRE type="submit", solo en resumen */}
          {isResumen && (
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px 20px',
                borderRadius: 12,
                border: 'none',
                background: 'var(--gor-txt)',
                color: 'var(--gor-bg)',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity: loading ? 0.55 : 1,
                transition: 'opacity 0.15s',
              }}
              onMouseOver={(e) => { if (!loading) e.currentTarget.style.opacity = '0.85'; }}
              onMouseOut={(e) => { if (!loading) e.currentTarget.style.opacity = '1'; }}
            >
              {loading ? (
                'Procesando...'
              ) : (
                <>
                  <Check size={15} strokeWidth={2.5} />
                  Confirmar pedido
                </>
              )}
            </button>
          )}

          <p
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: 'var(--gor-muted)',
              lineHeight: 1.5,
              maxWidth: 400,
              margin: '2px auto 0',
            }}
          >
            {isResumen
              ? 'Al confirmar registraremos tu pedido y nos contactaremos a la brevedad.'
              : 'Tus datos están protegidos y no son compartidos con terceros.'}
          </p>
        </div>
      </div>
    </form>
  );
}
