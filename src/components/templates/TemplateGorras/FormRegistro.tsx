import { useForm } from 'react-hook-form';
import { useTiendaIDStore } from '../../../store/useTiendaIDStore';
import { useRegisterCliente } from '../../../hooks/useCliente';
import type { IClient } from '../../../types/clients.type';


interface FormRegistroProps {
  tiendaNombre: string;
  onSubmit: (data: Omit<IClient, 'confirmar'>) => void;
  onGoLogin: () => void;
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

export default function FormRegistro({
  tiendaNombre,
  onSubmit,
  onGoLogin,
  loading,
  errorGlobal,
}: FormRegistroProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IClient>({ mode: 'onBlur' });
  //obtenemos el id de la tienda del store para enviarlo al backend junto con los datos del cliente
  const { tiendaId } = useTiendaIDStore();

  //hook para enviar la pepticion al back end
  const { mutate: postRegister, isPending  } = useRegisterCliente();
  // Necesitamos observar password para validar que confirmar coincida
  const passwordActual = watch('password');

  const handleSubmitForm = (data: IClient) => {
    const dataRegister: IClient = {
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      telefono: data.telefono,
      password: data.password,
      tiendaId: tiendaId,
    };

    postRegister(dataRegister);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Descripción personalizada */}
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '.95rem',
          color: MUTED,
          marginBottom: '2rem',
          lineHeight: 1.6,
        }}
      >
        Creá tu cuenta en <strong style={{ color: ACENTO, fontWeight: 700 }}>{tiendaNombre}</strong>{' '}
        para hacer seguimiento de tus pedidos.
      </p>

      {/* ── FORMULARIO ── */}
      {/* Usamos div en lugar de form para evitar submit nativo */}
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}
      >
        {/* Nombre y Apellido en grilla 2 columnas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FieldGroup label="Nombre" error={errors.nombre?.message}>
            <input
              {...register('nombre', { required: 'Requerido' })}
              placeholder="Juan"
              style={fieldStyle(!!errors.nombre)}
            />
          </FieldGroup>

          <FieldGroup label="Apellido" error={errors.apellido?.message}>
            <input
              {...register('apellido', { required: 'Requerido' })}
              placeholder="García"
              style={fieldStyle(!!errors.apellido)}
            />
          </FieldGroup>
        </div>

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

        <FieldGroup label="Teléfono" error={errors.telefono?.message}>
          <input
            {...register('telefono', { required: 'El teléfono es requerido' })}
            type="tel"
            placeholder="381 123-4567"
            style={fieldStyle(!!errors.telefono)}
          />
        </FieldGroup>

        <FieldGroup label="Contraseña" error={errors.password?.message}>
          <input
            {...register('password', {
              required: 'La contraseña es requerida',
              minLength: { value: 8, message: 'Mínimo 8 caracteres' },
            })}
            type="password"
            placeholder="Mínimo 8 caracteres"
            style={fieldStyle(!!errors.password)}
          />
        </FieldGroup>

        <FieldGroup label="Confirmar contraseña" error={errors.confirmar?.message}>
          <input
            {...register('confirmar', {
              required: 'Confirmá tu contraseña',
              validate: (v) => v === passwordActual || 'Las contraseñas no coinciden',
            })}
            type="password"
            placeholder="••••••••"
            style={fieldStyle(!!errors.confirmar)}
          />
        </FieldGroup>
      </div>

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

      {/* Botón submit */}
      <button
        onClick={handleSubmit(handleSubmitForm)}
        disabled={isPending}
        style={{
          width: '100%',
          padding: '14px',
          background: isPending ? `${ACENTO}80` : ACENTO,
          color: BTN_TXT,
          border: 'none',
          borderRadius: '50px', // pill — igual al resto de botones de la plantilla
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '.78rem',
          fontWeight: 700,
          letterSpacing: '.06em',
          textTransform: 'uppercase',
          cursor: isPending ? 'not-allowed' : 'pointer',
          transition: 'opacity .2s',
        }}
        onMouseEnter={(e) => {
          if (!isPending) e.currentTarget.style.opacity = '.85';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
      >
        {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      {/* Link a login */}
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '.85rem',
          color: MUTED,
          textAlign: 'center',
          marginTop: '1.75rem',
        }}
      >
        ¿Ya tenés cuenta?{' '}
        <button
          onClick={onGoLogin}
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
          Iniciá sesión
        </button>
      </p>
    </div>
  );
}

// ── HELPERS DE ESTILO ─────────────────────────────────────────

/**
 * Estilo del input: borde rojo si hay error, acento si está enfocado.
 * No usamos estado de foco local porque RHF ya maneja el blur/touch.
 */
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

/**
 * Wrapper de label + input + mensaje de error.
 * Separa la lógica de presentación del campo en sí.
 */
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
