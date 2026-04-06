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

// ── COLORES ───────────────────────────────────────────────────
const ACENTO = 'var(--rop-acento)';
const DARK = 'var(--rop-dark)';
const MUTED = 'var(--rop-muted)';
const BTN_TXT = 'var(--rop-btn-txt)';
const BORDER = 'var(--rop-border)';

export default function FormLogin({
  tiendaNombre,
  onGoRegistro,
  onGoOlvide,
  loading,
  errorGlobal,
}: FormLoginProps) {
  const { tiendaId } = useTiendaIDStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({ mode: 'onBlur' });
  const { mutate: postLogin } = useLoginCliente();

  const handleSubmitForm = (data: LoginData) => {
    postLogin({ ...data, tiendaId: tiendaId ?? 0 });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm leading-7" style={{ color: MUTED, fontFamily: "'Outfit', sans-serif" }}>
        Ingresá a tu cuenta en{' '}
        <strong className="font-semibold" style={{ color: DARK }}>
          {tiendaNombre}
        </strong>{' '}
        para gestionar tus pedidos.
      </p>

      <form onSubmit={handleSubmit(handleSubmitForm)} className="flex flex-col gap-4">
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
            className="w-full px-3.5 py-2 rounded-md border text-sm bg-transparent outline-none"
            style={{
              borderColor: errors.email ? ACENTO : BORDER,
              color: DARK,
            }}
          />
        </FieldGroup>

        <FieldGroup label="CONTRASEÑA" error={errors.password?.message}>
          <input
            {...register('password', {
              required: 'Campo obligatorio',
            })}
            type="password"
            placeholder="••••••••"
            className="w-full px-3.5 py-2 rounded-md border text-sm bg-transparent outline-none"
            style={{
              borderColor: errors.password ? ACENTO : BORDER,
              color: DARK,
            }}
          />
        </FieldGroup>

        <button
          type="button"
          onClick={onGoOlvide}
          className="self-start text-xs underline bg-transparent border-none cursor-pointer"
          style={{ color: MUTED, fontFamily: "'Outfit', sans-serif" }}
        >
          Olvidé mi contraseña
        </button>

        {errorGlobal && (
          <p className="rounded-md p-2 text-xs bg-red-50 text-red-800">
            {errorGlobal}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full text-sm font-bold tracking-widest cursor-pointer border-none"
          style={{ background: DARK, opacity: loading ? 0.6 : 1, color: BTN_TXT }}
        >
          {loading ? 'CONECTANDO...' : 'INICIAR SESIÓN'}
        </button>

        <p
          className="text-center text-xs mt-4"
          style={{ color: MUTED, fontFamily: "'Outfit', sans-serif" }}
        >
          ¿No sos miembro?{' '}
          <button
            type="button"
            onClick={onGoRegistro}
            className="underline font-semibold bg-transparent border-none cursor-pointer p-0"
            style={{ color: DARK }}
          >
            Únete ahora
          </button>
        </p>
      </form>
    </div>
  );
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
    <div className="flex flex-col gap-1">
      <label
        className="text-xs font-semibold"
        style={{ color: MUTED, fontFamily: "'Outfit', sans-serif" }}
      >
        {label}
      </label>
      {children}
      {error && (
        <span className="text-xs text-red-600" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {error}
        </span>
      )}
    </div>
  );
}
