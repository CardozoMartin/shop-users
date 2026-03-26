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

// ── COLORES (heredados de las CSS vars de la plantilla Ropa/VESTE) ───
const ACENTO = 'var(--rop-acento)'; 
const DARK = 'var(--rop-dark)';
const MUTED = 'var(--rop-muted)';
const BTN_TXT = 'var(--rop-btn-txt)';
const BORDER = 'var(--rop-border)';
// const SURFACE = 'var(--rop-surface)'; // Comentado si no se usa

// ── COMPONENTE ────────────────────────────────────────────────
// Este componente gestiona el alta de nuevos clientes para VESTE (Ropa)
export default function FormRegistro({
  tiendaNombre,
  onGoLogin,
  // loading, // Usamos isPending
  errorGlobal,
}: FormRegistroProps) {

  // 1. Iniciamos react-hook-form para captura y validación
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IClientForm>({ mode: 'onBlur' });

  // 2. Traemos el ID de la tienda del store
  const { tiendaId } = useTiendaIDStore();

  // 3. Mutación de registro
  const { mutate: postRegister, isPending  } = useRegisterCliente();

  // 4. Vigilamos la contraseña para match en confirmación
  const passwordActual = watch('password');

  // 5. Preparación y envío de datos
  const handleSubmitForm = (data: IClient) => {
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
      {/* 6. Cabecera informativa */}
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
        Crea tu cuenta en <strong style={{ color: DARK, fontWeight: 600 }}>{tiendaNombre}</strong>{' '}
        y forma parte de nuestra comunidad.
      </p>

      {/* ── 7. CAMPOS DE REGISTRO ── */}
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}
      >
        {/* Nombre y Apellido */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <FieldGroup label="NOMBRE" error={errors.nombre?.message}>
            <input
              {...register('nombre', { required: 'Requerido' })}
              placeholder="Juan"
              style={fieldStyle(!!errors.nombre)}
            />
          </FieldGroup>

          <FieldGroup label="APELLIDO" error={errors.apellido?.message}>
            <input
              {...register('apellido', { required: 'Requerido' })}
              placeholder="García"
              style={fieldStyle(!!errors.apellido)}
            />
          </FieldGroup>
        </div>

        <FieldGroup label="EMAIL" error={errors.email?.message}>
          <input
            {...register('email', {
              required: 'Campo obligatorio',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email inválido',
              },
            })}
            type="email"
            placeholder="hola@tuemail.com"
            style={fieldStyle(!!errors.email)}
          />
        </FieldGroup>

        <FieldGroup label="TELÉFONO" error={errors.telefono?.message}>
          <input
            {...register('telefono', { required: 'Campo obligatorio' })}
            type="tel"
            placeholder="381 123 4567"
            style={fieldStyle(!!errors.telefono)}
          />
        </FieldGroup>

        <FieldGroup label="CONTRASEÑA" error={errors.password?.message}>
          <input
            {...register('password', {
              required: 'Campo obligatorio',
              minLength: { value: 8, message: 'Mínimo 8 caracteres' },
            })}
            type="password"
            placeholder="Mínimo 8 caracteres"
            style={fieldStyle(!!errors.password)}
          />
        </FieldGroup>

        <FieldGroup label="CONFIRMAR CONTRASEÑA" error={errors.confirmar?.message}>
          <input
            {...register('confirmar', {
              required: 'Campo obligatorio',
              validate: (v) => v === passwordActual || 'Las contraseñas no coinciden',
            })}
            type="password"
            placeholder="Repite tu contraseña"
            style={fieldStyle(!!errors.confirmar)}
          />
        </FieldGroup>
      </div>

      {/* 8. Feedback de servidor */}
      {errorGlobal && (
        <div
          style={{
            background: '#000',
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

      {/* 9. Botón Submit rectangular */}
      <button
        onClick={handleSubmit(handleSubmitForm)}
        disabled={isPending}
        style={{
          width: '100%',
          padding: '16px',
          background: DARK,
          color: BTN_TXT,
          border: 'none',
          borderRadius: '4px',
          fontFamily: "'Outfit', sans-serif",
          fontSize: '.75rem',
          fontWeight: 600,
          letterSpacing: '.15em',
          textTransform: 'uppercase',
          cursor: isPending ? 'not-allowed' : 'pointer',
          transition: 'all .25s',
          opacity: isPending ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (!isPending) e.currentTarget.style.background = ACENTO;
        }}
        onMouseLeave={(e) => {
          if (!isPending) e.currentTarget.style.background = DARK;
        }}
      >
        {isPending ? 'CREANDO...' : 'CREAR CUENTA'}
      </button>

      {/* 10. Link de retorno al login */}
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
        ¿Ya eres miembro?{' '}
        <button
          onClick={onGoLogin}
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
          Iniciá sesión
        </button>
      </p>
    </div>
  );
}

// ── 11. HELPERS ───────────────────────────────────────────────

function fieldStyle(hasError: boolean): React.CSSProperties {
  return {
    width: '100%',
    padding: '12px 0',
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
