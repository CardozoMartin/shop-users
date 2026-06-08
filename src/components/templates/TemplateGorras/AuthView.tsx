import { useState, useEffect } from 'react';
import { useAuthSessionStore } from '../../../store/useAuthSession';
import FormLogin from './FormLogin';
import FormRegistro from './FormRegistro';
import { useOlvidePasswordCliente } from '../../../hooks/useCliente';
import { useTiendaIDStore } from '../../../store/useTiendaIDStore';

// ── Tipos ─────────────────────────────────────────────────────
type AuthMode = 'login' | 'registro' | 'olvide';

interface AuthViewProps {
  onClose: () => void;
  onLoginSuccess: () => void;
  tienda?: { nombre?: string; logoUrl?: string };
}

// ── CSS vars ──────────────────────────────────────────────────
const ACENTO = 'var(--gor-acento)';
const TXT = 'var(--gor-txt)';
const MUTED = 'var(--gor-muted)';
const BORDER = 'var(--gor-border)';
const SURFACE = 'var(--gor-surface)';
const BTN_TXT = 'var(--gor-btn-txt)';

// ── Meta títulos por modo ─────────────────────────────────────
const META: Record<AuthMode, string> = {
  login: '¡Qué bueno verte!',
  registro: 'Creá tu cuenta',
  olvide: 'Recuperar contraseña',
};

// ── Field — input con foco acento ─────────────────────────────
function Field({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[.78rem] font-semibold tracking-[.03em]"
        style={{ color: MUTED, fontFamily: "'DM Sans',sans-serif" }}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-4 py-3 rounded-[10px] text-[.95rem] outline-none transition-colors duration-200"
        style={{
          border: `1.5px solid ${focused ? ACENTO : BORDER}`,
          background: SURFACE,
          color: TXT,
          fontFamily: "'DM Sans',sans-serif",
        }}
      />
      {error && (
        <span className="text-[.72rem] text-red-500" style={{ fontFamily: "'DM Sans',sans-serif" }}>
          {error}
        </span>
      )}
    </div>
  );
}

// ── FormOlvide ────────────────────────────────────────────────
function FormOlvide({
  onSubmit,
  onGoLogin,
  enviado,
  isPending,
}: {
  onSubmit: (email: string) => void;
  onGoLogin: () => void;
  enviado: boolean;
  isPending: boolean;
}) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!email.trim()) {
      setError('El email es requerido');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email inválido');
      return;
    }
    setError('');
    onSubmit(email.trim());
  };

  // ── Estado enviado ────────────────────────────────────────
  if (enviado) {
    return (
      <div className="flex flex-col items-center gap-6 pt-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-[1.8rem]"
          style={{ background: `${ACENTO}14`, border: `2px solid ${ACENTO}` }}
        >
          ✉️
        </div>
        <p
          className="text-base text-center leading-[1.7]"
          style={{ color: TXT, fontFamily: "'DM Sans',sans-serif" }}
        >
          Te enviamos un email con las instrucciones para recuperar tu contraseña.
          <br />
          <span className="text-[.88rem]" style={{ color: MUTED }}>
            Revisá también tu carpeta de spam.
          </span>
        </p>
        <button
          onClick={onGoLogin}
          className="px-7 py-3 rounded-[10px] text-[.9rem] font-bold border-none cursor-pointer mt-2 transition-opacity hover:opacity-85"
          style={{ background: ACENTO, color: BTN_TXT, fontFamily: "'DM Sans',sans-serif" }}
        >
          Volver al login
        </button>
      </div>
    );
  }

  // ── Formulario ────────────────────────────────────────────
  return (
    <div className="flex flex-col">
      <p
        className="text-[.95rem] leading-[1.6] mb-10"
        style={{ color: MUTED, fontFamily: "'DM Sans',sans-serif" }}
      >
        Ingresá tu email y te mandamos un link para restablecer tu contraseña.
      </p>

      <div className="mb-6">
        <Field
          label="Email registrado"
          type="email"
          placeholder="tucorreo@email.com"
          value={email}
          onChange={setEmail}
          error={error}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full py-3.5 rounded-[10px] text-[.95rem] font-bold border-none transition-opacity duration-200"
        style={{
          background: isPending ? `${ACENTO}80` : ACENTO,
          color: BTN_TXT,
          cursor: isPending ? 'not-allowed' : 'pointer',
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        {isPending ? 'Enviando...' : 'Enviar instrucciones'}
      </button>

      <button
        onClick={onGoLogin}
        className="self-center mt-5 bg-transparent border-none text-[.85rem] cursor-pointer underline p-0 transition-colors duration-200"
        style={{ color: MUTED, fontFamily: "'DM Sans',sans-serif" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = TXT)}
        onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
      >
        ← Volver al login
      </button>
    </div>
  );
}

// ── AuthView — root ───────────────────────────────────────────
export default function AuthView({ onClose, onLoginSuccess, tienda }: AuthViewProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [olvideEnviado, setOlvideEnviado] = useState(false);

  const token = useAuthSessionStore((state) => state.token);

  useEffect(() => {
    if (token) {
      onLoginSuccess();
    }
  }, [token, onLoginSuccess]);

  const tiendaNombre = tienda?.nombre || 'la tienda';

  // Cambia de modo (login / registro / olvide)
  const cambiarModo = (m: AuthMode) => {
    setMode(m);
  };

  // ── Handlers ──────────────────────────────────────────────
  const { tiendaId } = useTiendaIDStore();
  const { mutate: solicitarReset, isPending } = useOlvidePasswordCliente();

  const handleOlvide = (email: string) => {
    if (!tiendaId) return;
    solicitarReset(
      { email, tiendaId },
      {
        onSuccess: () => setOlvideEnviado(true),
      }
    );
  };

  return (
    <div className="px-6 py-12 min-h-[80vh] flex flex-col">
      <div className="max-w-[480px] mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Volver a la tienda */}
        <button
          onClick={onClose}
          className="self-start flex items-center gap-2 bg-transparent border-none text-[.85rem] font-medium cursor-pointer p-0 mb-12 transition-colors duration-200"
          style={{ color: MUTED, fontFamily: "'DM Sans',sans-serif" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = TXT)}
          onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
        >
          <span className="text-xl">←</span> Volver a la tienda
        </button>

        {/* Logo */}
        {tienda?.logoUrl && (
          <img
            src={tienda.logoUrl}
            alt={tiendaNombre}
            onClick={onClose}
            className="h-10 object-contain self-start mb-6 cursor-pointer transition-transform hover:scale-105"
          />
        )}

        {/* Título */}
        <h1
          className="font-bold leading-[1.1] mb-2"
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(1.9rem, 3.5vw, 2.6rem)',
            color: TXT,
          }}
        >
          {META[mode]}
        </h1>

        {/* Línea acento */}
        <div className="w-10 h-[3px] rounded-sm mb-7" style={{ background: ACENTO }} />

        {/* Formulario activo */}
        {mode === 'login' && (
          <FormLogin
            tiendaNombre={tiendaNombre}
            onGoRegistro={() => cambiarModo('registro')}
            onGoOlvide={() => cambiarModo('olvide')}
            onLoginSuccess={() => onLoginSuccess()}
          />
        )}
        {mode === 'registro' && (
          <FormRegistro tiendaNombre={tiendaNombre} onGoLogin={() => cambiarModo('login')} />
        )}
        {mode === 'olvide' && (
          <FormOlvide
            onSubmit={handleOlvide}
            onGoLogin={() => cambiarModo('login')}
            enviado={olvideEnviado}
            isPending={isPending}
          />
        )}
      </div>
    </div>
  );
}
