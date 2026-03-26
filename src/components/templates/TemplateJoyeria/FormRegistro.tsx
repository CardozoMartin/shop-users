import { useForm } from 'react-hook-form';
import { useTiendaIDStore } from '../../../store/useTiendaIDStore';
import { useRegisterCliente } from '../../../hooks/useCliente';
import type { IClient } from '../../../types/clients.type';

// ── TIPOS ─────────────────────────────────────────────────────
interface IClientForm extends IClient {
  confirmar: string;
}

interface FormRegistroProps {
  tiendaNombre: string;
  onSubmit: (data: Omit<IClient, 'confirmar'>) => void;
  onGoLogin: () => void;
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
// Este componente maneja el registro de nuevos clientes para la plantilla Joyería
export default function FormRegistro({
  tiendaNombre,
  onGoLogin,
  loading,
  errorGlobal,
}: FormRegistroProps) {

  // 1. Iniciamos react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IClientForm>({ mode: 'onBlur' });

  // 2. Extraemos el ID de la tienda del store global
  const { tiendaId } = useTiendaIDStore();

  // 3. Hook para la petición asíncrona de registro
  const { mutate: postRegister, isPending  } = useRegisterCliente();

  // 4. Observamos la contraseña actual para validar que la confirmación coincida
  const passwordActual = watch('password');

  // 5. Función que procesa los datos y los envía al backend
  const handleSubmitForm = (data: IClient) => {
    // Estructura final con el id de la tienda inyectado
    const dataRegister: IClient = {
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      telefono: data.telefono,
      password: data.password,
      tiendaId: tiendaId as number,
    };

    postRegister(dataRegister);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* 6. Descripción breve del propósito del formulario */}
      <p
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: '.95rem',
          color: MUTED,
          marginBottom: '2rem',
          lineHeight: 1.6,
        }}
      >
        Creá tu cuenta en <strong style={{ color: ACENTO, fontWeight: 500 }}>{tiendaNombre}</strong>{' '}
        para hacer seguimiento de tus pedidos.
      </p>

      {/* ── 7. CAMPOS DE REGISTRO ── */}
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}
      >
        {/* Fila doble: Nombre y Apellido */}
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

        {/* Campo Email */}
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

        {/* Campo Teléfono */}
        <FieldGroup label="Teléfono" error={errors.telefono?.message}>
          <input
            {...register('telefono', { required: 'El teléfono es requerido' })}
            type="tel"
            placeholder="381 123-4567"
            style={fieldStyle(!!errors.telefono)}
          />
        </FieldGroup>

        {/* Campo Contraseña y su Validación de longitud */}
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

        {/* Campo Confirmación con validación de igualdad */}
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

      {/* 8. Error global proveniente del servidor */}
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

      {/* 9. Botón de creación con estilo redondeado elegante (pill) */}
      <button
        onClick={handleSubmit(handleSubmitForm)}
        disabled={isPending}
        style={{
          width: '100%',
          padding: '14px',
          background: isPending ? `${ACENTO}80` : ACENTO,
          color: BTN_TXT,
          border: 'none',
          borderRadius: '50px',
          fontFamily: "'Jost', sans-serif",
          fontSize: '.78rem',
          fontWeight: 600,
          letterSpacing: '.12em',
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

      {/* 10. Link de navegación rápida al login */}
      <p
        style={{
          fontFamily: "'Jost', sans-serif",
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
            fontFamily: "'Jost', sans-serif",
            fontSize: '.85rem',
            fontWeight: 500,
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

// ── 11. HELPERS DE ESTILO (Reutilizados en el componente) ─────────────────────

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
