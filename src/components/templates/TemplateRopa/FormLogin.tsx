import { useForm } from 'react-hook-form';
import { useTiendaIDStore } from '../../../store/useTiendaIDStore';
import { useLoginCliente } from '../../../hooks/useCliente';

// ── TIPOS ─────────────────────────────────────────────────────
// Estructura de datos para el inicio de sesión
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

// ── COLORES (heredados de las CSS vars de la plantilla Ropa/VESTE) ───
const ACENTO = 'var(--rop-acento)'; // rojo editorial
const DARK = 'var(--rop-dark)';
const MUTED = 'var(--rop-muted)';
const BTN_TXT = 'var(--rop-btn-txt)';
const BORDER = 'var(--rop-border)';
const SURFACE = 'var(--rop-surface)';
const TXT = 'var(--rop-txt)';

// ── COMPONENTE ────────────────────────────────────────────────
// Este componente implementa el login con la estética minimalista de la plantilla Ropa
export default function FormLogin({
  tiendaNombre,
  onGoRegistro,
  onGoOlvide,
  loading,
  errorGlobal,
}: FormLoginProps) {

  // 1. Obtenemos el tiendaId del store persistente
  const { tiendaId } = useTiendaIDStore();
  
  // 2. Setup del formulario con validaciones
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({ mode: 'onBlur' });

  // 3. Hook asíncrono para mutación de login
  const { mutate: postLogin } = useLoginCliente();

  // 4. Procesamiento del envío del formulario
  const handleSubmitForm = (data: LoginData) => {
    const dataLogin: LoginData = {
      email: data.email,
      password: data.password,
      tiendaId: tiendaId!,
    };
    
    postLogin(dataLogin);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* 5. Introducción con tipografía Outfit (moderna/geométrica) */}
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '.95rem',
          color: MUTED,
          marginBottom: '2rem',
          lineHeight: 1.6,
          fontWeight: 300
        }}
      >
        Ingresá a tu cuenta en{' '}
        <strong style={{ color: DARK, fontWeight: 600 }}>{tiendaNombre}</strong> para gestionar tus pedidos.
      </p>

      {/* ── 6. CAMPOS ── */}
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '0.5rem' }}
      >
        <FieldGroup label="EMAIL" error={errors.email?.message}>
          <input
            {...register('email', {
              required: 'Campo obligatorio',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email no válido',
              },
            })}
            type="email"
            placeholder="hola@tuemail.com"
            style={fieldStyle(!!errors.email)}
          />
        </FieldGroup>

        <FieldGroup label="CONTRASEÑA" error={errors.password?.message}>
          <input
            {...register('password', {
              required: 'Campo obligatorio',
            })}
            type="password"
            placeholder="••••••••"
            style={fieldStyle(!!errors.password)}
          />
        </FieldGroup>
      </div>

      {/* 7. Recuperación de acceso */}
      <button
        onClick={onGoOlvide}
        style={{
          alignSelf: 'flex-start',
          background: 'none',
          border: 'none',
          fontFamily: "'Outfit', sans-serif",
          fontSize: '.72rem',
          color: MUTED,
          cursor: 'pointer',
          padding: '8px 0 2rem',
          textDecoration: 'underline',
          letterSpacing: '.05em'
        }}
      >
        Olvidé mi contraseña
      </button>

      {/* 8. Errores de API */}
      {errorGlobal && (
        <div
          style={{
            background: '#000',
            borderRadius: '2px',
            padding: '12px',
            marginBottom: '1.5rem',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '.75rem',
            color: '#fff',
            textAlign: 'center'
          }}
        >
          {errorGlobal}
        </div>
      )}

      {/* 9. Botón con estilo rectangular sobrio (característico de VESTE) */}
      <button
        onClick={handleSubmit(handleSubmitForm)}
        disabled={loading}
        style={{
          width: '100%',
          padding: '16px',
          background: loading ? DARK : DARK,
          color: BTN_TXT,
          border: 'none',
          borderRadius: '4px',
          fontFamily: "'Outfit', sans-serif",
          fontSize: '.75rem',
          fontWeight: 600,
          letterSpacing: '.15em',
          textTransform: 'uppercase',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all .25s',
          opacity: loading ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (!loading) e.currentTarget.style.background = ACENTO;
        }}
        onMouseLeave={(e) => {
          if (!loading) e.currentTarget.style.background = DARK;
        }}
      >
        {loading ? 'CONECTANDO...' : 'INICIAR SESIÓN'}
      </button>

      {/* 10. Alternativa de registro */}
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '.8rem',
          color: MUTED,
          textAlign: 'center',
          marginTop: '2rem',
          fontWeight: 300
        }}
      >
        ¿No sos miembro?{' '}
        <button
          onClick={onGoRegistro}
          style={{
            background: 'none',
            border: 'none',
            color: DARK,
            fontFamily: "'Outfit', sans-serif",
            fontSize: '.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0,
            textDecoration: 'underline',
          }}
        >
          Únete ahora
        </button>
      </p>
    </div>
  );
}

// ── 11. HELPERS ───────────────────────────────────────────────

function fieldStyle(hasError: boolean): React.CSSProperties {
  return {
    width: '100%',
    padding: '14px 0',
    border: 'none',
    borderBottom: `1px solid ${hasError ? ACENTO : BORDER}`,
    background: 'transparent',
    color: DARK,
    fontFamily: "'Outfit', sans-serif",
    fontSize: '.9rem',
    outline: 'none',
    transition: 'border-color .3s',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <label
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '.62rem',
          fontWeight: 600,
          color: DARK,
          letterSpacing: '.12em',
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '.65rem',
            color: ACENTO,
            marginTop: '4px'
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
