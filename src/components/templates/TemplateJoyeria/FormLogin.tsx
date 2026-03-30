import { useForm } from 'react-hook-form';
import { useLoginCliente } from '../../../hooks/useCliente';
import { useTiendaIDStore } from '../../../store/useTiendaIDStore';

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
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm leading-7" style={{ color: MUTED, fontFamily: "'Jost', sans-serif" }}>
        Bienvenido de nuevo a{' '}
        <strong style={{ color: ACENTO, fontWeight: 600 }}>{tiendaNombre}</strong>. Ingresá para ver
        tus pedidos y datos guardados.
      </p>

      <form onSubmit={handleSubmit(handleSubmitForm)} className="flex flex-col gap-4">
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

        {/* 7. Opción para recuperar contraseña */}
        <button
          type="button"
          onClick={onGoOlvide}
          className="self-end text-sm underline"
          style={{ color: MUTED, fontFamily: "'Jost', sans-serif" }}
        >
          ¿Olvidaste tu contraseña?
        </button>

        {errorGlobal && (
          <p
            className="rounded-lg p-2 text-xs"
            style={{ background: '#fef2f2', color: '#dc2626', fontFamily: "'Jost', sans-serif" }}
          >
            {errorGlobal}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full text-sm font-bold tracking-widest uppercase text-white"
          style={{ background: loading ? `${ACENTO}80` : ACENTO, color: BTN_TXT }}
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p
          className="text-sm text-center mt-4"
          style={{ color: MUTED, fontFamily: "'Jost', sans-serif" }}
        >
          ¿No tenés cuenta?{' '}
          <button
            type="button"
            onClick={onGoRegistro}
            className="underline font-semibold"
            style={{ color: ACENTO }}
          >
            Registrate gratis
          </button>
        </p>
      </form>
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
