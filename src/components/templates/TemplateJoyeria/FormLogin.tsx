import { useForm } from 'react-hook-form';
import { useTiendaIDStore } from '../../../store/useTiendaIDStore';
import { useLoginCliente } from '../../../hooks/useCliente';

// ── TIPOS ─────────────────────────────────────────────────────
// Definimos la estructura de los datos que el formulario manejará
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

// ── COLORES (heredados de las CSS vars de la plantilla Joyería) ───────
const ACENTO = 'var(--acc-acento)';
const MUTED = 'var(--acc-muted)';
const BTN_TXT = 'var(--acc-btn-txt)';
const BORDER = 'var(--acc-border)';
const SURFACE = 'var(--acc-surface)';
const TXT = 'var(--acc-txt)';

// ── COMPONENTE ────────────────────────────────────────────────
// Este componente maneja el formulario de inicio de sesión para la plantilla Joyería
export default function FormLogin({
  tiendaNombre,
  onGoRegistro,
  onGoOlvide,
  loading,
  errorGlobal,
}: FormLoginProps) {

  // 1. Obtenemos el ID de la tienda desde nuestro store global
  // Necesitamos este ID para que el backend sepa a qué tienda pertenece el cliente
  const { tiendaId } = useTiendaIDStore();
  
  // 2. Iniciamos el manejo del formulario con react-hook-form
  // Usamos 'onBlur' para validar cuando el usuario sale de un campo
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({ mode: 'onBlur' });

  // 3. Hook para enviar la petición de login al backend
  const { mutate: postLogin } = useLoginCliente();

  // 4. Función que se ejecuta al enviar el formulario validado
  const handleSubmitForm = (data: LoginData) => {
    // Combinamos los datos del formulario con el ID de la tienda
    const dataLogin: LoginData = {
      email: data.email,
      password: data.password,
      tiendaId: tiendaId!,
    };
    
    // Enviamos la petición al servidor a través del hook
    postLogin(dataLogin);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* 5. Mensaje de bienvenida personalizado con el nombre de la tienda */}
      <p
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: '.95rem',
          color: MUTED,
          marginBottom: '2rem',
          lineHeight: 1.6,
        }}
      >
        Bienvenido de nuevo a{' '}
        <strong style={{ color: ACENTO, fontWeight: 500 }}>{tiendaNombre}</strong>. Ingresá para ver
        tus pedidos y datos guardados.
      </p>

      {/* ── 6. CAMPOS DEL FORMULARIO ── */}
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '0.5rem' }}
      >
        {/* Campo de Email con validaciones básicas */}
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

        {/* Campo de Contraseña */}
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

      {/* 7. Opción para recuperar contraseña */}
      <button
        onClick={onGoOlvide}
        style={{
          alignSelf: 'flex-end',
          background: 'none',
          border: 'none',
          fontFamily: "'Jost', sans-serif",
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

      {/* 8. Muestra errores generales provenientes del servidor si existieran */}
      {errorGlobal && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '1rem',
            fontFamily: "'Jost', sans-serif",
            fontSize: '.82rem',
            color: '#dc2626',
          }}
        >
          {errorGlobal}
        </div>
      )}

      {/* 9. Botón de acceso con estilo pill redondeado para Joyería */}
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
          fontFamily: "'Jost', sans-serif",
          fontSize: '.78rem',
          fontWeight: 600,
          letterSpacing: '.12em',
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

      {/* 10. Link para ir al registro de nueva cuenta */}
      <p
        style={{
          fontFamily: "'Jost', sans-serif",
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
            fontFamily: "'Jost', sans-serif",
            fontSize: '.85rem',
            fontWeight: 500,
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

// ── 11. HELPERS DE ESTILO (Reutilizados en el componente) ─────────────────────

/** Devuelve los estilos base para los inputs del formulario */
function fieldStyle(hasError: boolean): React.CSSProperties {
  return {
    width: '100%',
    padding: '12px 16px',
    border: `1px solid ${hasError ? '#ef4444' : BORDER}`,
    borderRadius: '4px',
    background: SURFACE,
    color: TXT,
    fontFamily: "'Jost', sans-serif",
    fontSize: '.88rem',
    outline: 'none',
    transition: 'border-color .2s',
  };
}

/** Agrupa Label + Input + Error en un solo contenedor con espaciado consistente */
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
          fontFamily: "'Jost', sans-serif",
          fontSize: '.75rem',
          fontWeight: 500,
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
            fontFamily: "'Jost', sans-serif",
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
