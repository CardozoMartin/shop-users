import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLoginCliente } from '../../../hooks/useCliente';
import { useTiendaIDStore } from '../../../store/useTiendaIDStore';
import { useAuthSessionStore } from '../../../store/useAuthSession';
import type { LoginData } from './Types';

const ACENTO = 'var(--gor-acento)';
const MUTED = 'var(--gor-muted)';
const BTN_TXT = 'var(--gor-btn-txt)';
const BORDER = 'var(--gor-border)';
const SURFACE = 'var(--gor-surface)';
const TXT = 'var(--gor-txt)';

interface FormLoginProps {
  tiendaNombre: string;
  onGoRegistro: () => void;
  onGoOlvide: () => void;
  onLoginSuccess: () => void;
}

export default function FormLogin({ tiendaNombre, onGoRegistro, onGoOlvide, onLoginSuccess }: FormLoginProps) {
  const { tiendaId } = useTiendaIDStore();
  const token = useAuthSessionStore((state) => state.token);

  useEffect(() => {
    if (token) {
      onLoginSuccess();
    }
  }, [token, onLoginSuccess]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({ mode: 'onBlur' });

  const { mutate: postLogin, isPending } = useLoginCliente();

  const handleSubmitForm = (data: LoginData) => {
    postLogin({ email: data.email, password: data.password, tiendaId: tiendaId! });
  };

  return (
    <div className="flex flex-col">
      {/* Descripción */}
      <p
        className="text-[.95rem] leading-[1.6] mb-8"
        style={{ color: MUTED, fontFamily: "'DM Sans',sans-serif" }}
      >
        Bienvenido de nuevo a{' '}
        <strong className="font-bold" style={{ color: ACENTO }}>
          {tiendaNombre}
        </strong>
        . Ingresá para ver tus pedidos y datos guardados.
      </p>

      {/* Campos */}
      <div className="flex flex-col gap-4 mb-2">
        <FieldGroup label="Email" error={errors.email?.message}>
          <input
            {...register('email', {
              required: 'El email es requerido',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' },
            })}
            type="email"
            placeholder="tucorreo@email.com"
            className="w-full px-4 py-3 rounded-lg text-[.88rem] outline-none transition-colors duration-200"
            style={fieldStyle(!!errors.email)}
          />
        </FieldGroup>

        <FieldGroup label="Contraseña" error={errors.password?.message}>
          <input
            {...register('password', { required: 'La contraseña es requerida' })}
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-lg text-[.88rem] outline-none transition-colors duration-200"
            style={fieldStyle(!!errors.password)}
          />
        </FieldGroup>
      </div>

      {/* ¿Olvidaste tu contraseña? */}
      <button
        onClick={onGoOlvide}
        className="self-end bg-transparent border-none text-[.78rem] cursor-pointer py-2 pb-6 underline transition-colors duration-200"
        style={{ color: MUTED, fontFamily: "'DM Sans',sans-serif" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = ACENTO)}
        onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
      >
        ¿Olvidaste tu contraseña?
      </button>

      {/* Error global */}

      {/* Botón submit */}
      <button
        onClick={handleSubmit(handleSubmitForm)}
        className="w-full py-3.5 rounded-full text-[.78rem] font-bold tracking-wide uppercase border-none transition-opacity duration-200"
        style={{
          background: isPending ? `${ACENTO}80` : ACENTO,
          color: BTN_TXT,
          cursor: isPending ? 'not-allowed' : 'pointer',
          fontFamily: "'DM Sans',sans-serif",
        }}
        onMouseEnter={(e) => {
          if (!isPending) e.currentTarget.style.opacity = '.85';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
      >
        {isPending ? 'Ingresando...' : 'Ingresar'}
      </button>

      {/* Link a registro */}
      <p
        className="text-[.85rem] text-center mt-7"
        style={{ color: MUTED, fontFamily: "'DM Sans',sans-serif" }}
      >
        ¿No tenés cuenta?{' '}
        <button
          onClick={onGoRegistro}
          className="bg-transparent border-none text-[.85rem] font-semibold cursor-pointer p-0 underline"
          style={{ color: ACENTO, fontFamily: "'DM Sans',sans-serif" }}
        >
          Registrate gratis
        </button>
      </p>
    </div>
  );
}

// ── HELPERS ───────────────────────────────────────────────────

// Solo el borde es dinámico, el resto va en className del input
function fieldStyle(hasError: boolean): React.CSSProperties {
  return {
    border: `1.5px solid ${hasError ? '#ef4444' : BORDER}`,
    background: SURFACE,
    color: TXT,
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
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[.75rem] font-semibold tracking-[.03em]"
        style={{ color: MUTED, fontFamily: "'DM Sans',sans-serif" }}
      >
        {label}
      </label>
      {children}
      {error && (
        <span className="text-[.7rem] text-red-500" style={{ fontFamily: "'DM Sans',sans-serif" }}>
          {error}
        </span>
      )}
    </div>
  );
}
