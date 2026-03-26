import { useForm } from 'react-hook-form';
import { useLoginCliente } from '../../../hooks/useCliente';
import { useTiendaIDStore } from '../../../store/useTiendaIDStore';

// ── TIPOS ─────────────────────────────────────────────────────

interface LoginData {
  email: string;
  password: string;
  tiendaId: number;
}

interface FormLoginProps {
  tiendaNombre: string;
  onSubmit: (data: LoginData) => void;
  onGoRegistro: () => void;
  onGoOlvide: () => void;
  loading: boolean;
  errorGlobal?: string;
}

// ── COLORES (heredados de las CSS vars de la plantilla) ───────

const ACENTO = 'var(--gor-acento)';
const MUTED = 'var(--gor-muted)';
const BTN_TXT = 'var(--gor-btn-txt)';
const BORDER = 'var(--gor-border)';
const SURFACE = 'var(--gor-surface)';
const TXT = 'var(--gor-txt)';

// ── COMPONENTE ────────────────────────────────────────────────

export default function FormLogin({
  tiendaNombre,
  onSubmit,
  onGoRegistro,
  onGoOlvide,
  loading,
  errorGlobal,
}: FormLoginProps) {
  //obtenemos el id de la tienda del store para enviarlo al backend junto con los datos del cliente
  const { tiendaId } = useTiendaIDStore();
  //manejo de formulario con react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({ mode: 'onBlur' });

  //hook para enviar los datos al back end
  const { mutate: postLogin } = useLoginCliente();

  const handleSubmitForm = (data: LoginData) => {
    console.log('📝 Datos del form:', data);
    console.log('🏪 tiendaId del store:', tiendaId);

    const dataLogin: LoginData = {
      email: data.email,
      password: data.password,
      tiendaId: tiendaId!,
    };

    console.log('📦 Payload a enviar:', dataLogin);
    postLogin(dataLogin);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Descripción personalizada con nombre de tienda */}
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '.95rem',
          color: MUTED,
          marginBottom: '2rem',
          lineHeight: 1.6,
        }}
      >
        Bienvenido de nuevo a{' '}
        <strong style={{ color: ACENTO, fontWeight: 700 }}>{tiendaNombre}</strong>. Ingresá para ver
        tus pedidos y datos guardados.
      </p>

      {/* ── CAMPOS ── */}
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '0.5rem' }}
      >
        <FieldGroup label="Email" error={errors.email?.message}>
          <input
            {...register('email', {
              required: 'El email es requerido',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email inválido',
              },
            })}
            type="email"
            placeholder="tucorreo@email.com"
            style={fieldStyle(!!errors.email)}
          />
        </FieldGroup>

        <FieldGroup label="Contraseña" error={errors.password?.message}>
          <input
            {...register('password', {
              required: 'La contraseña es requerida',
            })}
            type="password"
            placeholder="••••••••"
            style={fieldStyle(!!errors.password)}
          />
        </FieldGroup>
      </div>

      {/* Link olvidaste contraseña — alineado a la derecha */}
      <button
        onClick={onGoOlvide}
        style={{
          alignSelf: 'flex-end',
          background: 'none',
          border: 'none',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '.78rem',
          color: MUTED,
          cursor: 'pointer',
          padding: '8px 0 1.5rem',
          textDecoration: 'underline',
          transition: 'color .2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = ACENTO)}
        onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
      >
        ¿Olvidaste tu contraseña?
      </button>

      {/* Error global del servidor */}
      {errorGlobal && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '1rem',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '.82rem',
            color: '#dc2626',
          }}
        >
          {errorGlobal}
        </div>
      )}

      {/* Botón submit — pill igual al resto de la plantilla */}
      <button
        onClick={handleSubmit(handleSubmitForm)}
        disabled={loading}
        style={{
          width: '100%',
          padding: '14px',
          background: loading ? `${ACENTO}80` : ACENTO,
          color: BTN_TXT,
          border: 'none',
          borderRadius: '50px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '.78rem',
          fontWeight: 700,
          letterSpacing: '.06em',
          textTransform: 'uppercase',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'opacity .2s',
        }}
        onMouseEnter={(e) => {
          if (!loading) e.currentTarget.style.opacity = '.85';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
      >
        {loading ? 'Ingresando...' : 'Ingresar'}
      </button>

      {/* Link a registro */}
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '.85rem',
          color: MUTED,
          textAlign: 'center',
          marginTop: '1.75rem',
        }}
      >
        ¿No tenés cuenta?{' '}
        <button
          onClick={onGoRegistro}
          style={{
            background: 'none',
            border: 'none',
            color: ACENTO,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0,
            textDecoration: 'underline',
          }}
        >
          Registrate gratis
        </button>
      </p>
    </div>
  );
}

// ── HELPERS DE ESTILO ─────────────────────────────────────────

function fieldStyle(hasError: boolean): React.CSSProperties {
  return {
    width: '100%',
    padding: '12px 16px',
    border: `1.5px solid ${hasError ? '#ef4444' : BORDER}`,
    borderRadius: '8px',
    background: SURFACE,
    color: TXT,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '.88rem',
    outline: 'none',
    transition: 'border-color .2s',
  };
}

function FieldGroup({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '.75rem',
          fontWeight: 600,
          color: MUTED,
          letterSpacing: '.03em',
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '.7rem',
            color: '#ef4444',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
