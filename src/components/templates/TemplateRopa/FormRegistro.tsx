import { useForm } from 'react-hook-form';
import { useRegisterCliente } from '../../../hooks/useCliente';
import { useTiendaIDStore } from '../../../store/useTiendaIDStore';
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

// ── COLORES ───────────────────────────────────────────────────
const ACENTO = 'var(--rop-acento)';
const DARK = 'var(--rop-dark)';
const MUTED = 'var(--rop-muted)';
const BTN_TXT = 'var(--rop-btn-txt)';
const BORDER = 'var(--rop-border)';

export default function FormRegistro({ tiendaNombre, onGoLogin, errorGlobal }: FormRegistroProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IClientForm>({ mode: 'onBlur' });

  const { tiendaId } = useTiendaIDStore();
  const { mutate: postRegister, isPending } = useRegisterCliente();

  const passwordActual = watch('password');

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
    reset();
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm leading-7" style={{ color: MUTED, fontFamily: "'Outfit', sans-serif" }}>
        Crea tu cuenta en{' '}
        <strong className="font-semibold" style={{ color: DARK }}>
          {tiendaNombre}
        </strong>{' '}
        y forma parte de nuestra comunidad.
      </p>

      {/* Fields */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Nombre y Apellido */}
        <div className="grid grid-cols-2 gap-6">
          <FieldGroup label="NOMBRE" error={errors.nombre?.message}>
            <input
              {...register('nombre', { required: 'Requerido' })}
              placeholder="Juan"
              className="w-full py-3 bg-transparent outline-none text-[.9rem] border-0 transition-colors duration-300"
              style={{
                borderBottom: `1px solid ${errors.nombre ? ACENTO : BORDER}`,
                color: DARK,
                fontFamily: "'Outfit', sans-serif",
              }}
            />
          </FieldGroup>

          <FieldGroup label="APELLIDO" error={errors.apellido?.message}>
            <input
              {...register('apellido', { required: 'Requerido' })}
              placeholder="García"
              className="w-full py-3 bg-transparent outline-none text-[.9rem] border-0 transition-colors duration-300"
              style={{
                borderBottom: `1px solid ${errors.apellido ? ACENTO : BORDER}`,
                color: DARK,
                fontFamily: "'Outfit', sans-serif",
              }}
            />
          </FieldGroup>
        </div>

        <FieldGroup label="EMAIL" error={errors.email?.message}>
          <input
            {...register('email', {
              required: 'Campo obligatorio',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' },
            })}
            type="email"
            placeholder="hola@tuemail.com"
            className="w-full py-3 bg-transparent outline-none text-[.9rem] border-0 transition-colors duration-300"
            style={{
              borderBottom: `1px solid ${errors.email ? ACENTO : BORDER}`,
              color: DARK,
              fontFamily: "'Outfit', sans-serif",
            }}
          />
        </FieldGroup>

        <FieldGroup label="TELÉFONO" error={errors.telefono?.message}>
          <input
            {...register('telefono', { required: 'Campo obligatorio' })}
            type="tel"
            placeholder="381 123 4567"
            className="w-full py-3 bg-transparent outline-none text-[.9rem] border-0 transition-colors duration-300"
            style={{
              borderBottom: `1px solid ${errors.telefono ? ACENTO : BORDER}`,
              color: DARK,
              fontFamily: "'Outfit', sans-serif",
            }}
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
            className="w-full py-3 bg-transparent outline-none text-[.9rem] border-0 transition-colors duration-300"
            style={{
              borderBottom: `1px solid ${errors.password ? ACENTO : BORDER}`,
              color: DARK,
              fontFamily: "'Outfit', sans-serif",
            }}
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
            className="w-full py-3 bg-transparent outline-none text-[.9rem] border-0 transition-colors duration-300"
            style={{
              borderBottom: `1px solid ${errors.confirmar ? ACENTO : BORDER}`,
              color: DARK,
              fontFamily: "'Outfit', sans-serif",
            }}
          />
        </FieldGroup>
      </div>

      {/* Error feedback */}
      {errorGlobal && (
        <div
          className="p-3 mb-6 text-center text-[.75rem] text-white bg-black"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {errorGlobal}
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit(handleSubmitForm)}
        disabled={isPending}
        className="w-full py-4 rounded-full text-sm font-bold tracking-widest border-none transition-all duration-200"
        style={{
          background: DARK,
          color: BTN_TXT,
          cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.6 : 1,
        }}
        onMouseEnter={(e) => { if (!isPending) e.currentTarget.style.background = ACENTO; }}
        onMouseLeave={(e) => { if (!isPending) e.currentTarget.style.background = DARK; }}
      >
        {isPending ? 'CREANDO...' : 'CREAR CUENTA'}
      </button>

      {/* Go to login link */}
      <p
        className="text-center text-[.8rem] font-light mt-8"
        style={{ color: MUTED, fontFamily: "'Outfit', sans-serif" }}
      >
        ¿Ya eres miembro?{' '}
        <button
          onClick={onGoLogin}
          className="bg-transparent border-none underline font-semibold cursor-pointer p-0 text-[.8rem]"
          style={{ color: DARK, fontFamily: "'Outfit', sans-serif" }}
        >
          Iniciá sesión
        </button>
      </p>
    </div>
  );
}

// ── HELPERS ───────────────────────────────────────────────────

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
    <div className="flex flex-col gap-0.5">
      <label
        className="text-[.62rem] font-semibold tracking-[.12em]"
        style={{ fontFamily: "'Outfit', sans-serif", color: DARK }}
      >
        {label}
      </label>
      {children}
      {error && (
        <span
          className="text-[.65rem] mt-1"
          style={{ fontFamily: "'Outfit', sans-serif", color: ACENTO }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
