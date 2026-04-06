import { useState } from 'react';
import FormLogin from './FormLogin';
import FormRegistro from './FormRegistro';

// ── TIPOS ─────────────────────────────────────────────────────
type AuthMode = 'login' | 'registro' | 'olvide';

interface AuthViewProps {
  onClose: () => void;
  tienda?: { nombre?: string; logoUrl?: string };
  onLogin?: (data: any) => Promise<void>;
  onRegistro?: (data: any) => Promise<void>;
  onOlvide?: (email: string) => Promise<void>;
}

// ── COLORES ───────────────────────────────────────────────────
const ACENTO = 'var(--rop-acento)';
const DARK = 'var(--rop-dark)';
const MUTED = 'var(--rop-muted)';
const BTN_TXT = 'var(--rop-btn-txt)';
const BORDER = 'var(--rop-border)';

// ── FORMULARIO OLVIDÉ CONTRASEÑA ─────────────────────────────

function FormOlvide({
  onGoLogin,
  loading,
  enviado,
  errorGlobal,
  onSubmit,
}: {
  onGoLogin: () => void;
  loading: boolean;
  enviado: boolean;
  errorGlobal?: string;
  onSubmit: (email: string) => void;
}) {
  const [email, setEmail] = useState('');

  if (enviado) {
    return (
      <div className="text-center py-4">
        <p
          className="mb-10 font-light leading-[1.6]"
          style={{ fontFamily: "'Outfit', sans-serif", color: DARK }}
        >
          Te enviamos un email con las instrucciones para recuperar tu contraseña.
        </p>
        <button
          onClick={onGoLogin}
          className="py-3 px-8 border-none rounded cursor-pointer text-[.75rem] font-semibold uppercase tracking-[.12em]"
          style={{ background: DARK, color: BTN_TXT, fontFamily: "'Outfit', sans-serif" }}
        >
          Volver al login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <p
        className="text-[.9rem] font-light"
        style={{ fontFamily: "'Outfit', sans-serif", color: MUTED }}
      >
        Ingresá tu email y te mandamos un link para restablecer tu contraseña.
      </p>

      <div className="flex flex-col gap-1">
        <label
          className="text-[.62rem] font-semibold tracking-[.12em]"
          style={{ fontFamily: "'Outfit', sans-serif", color: DARK }}
        >
          EMAIL
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="hola@tuemail.com"
          className="py-3 bg-transparent border-0 outline-none"
          style={{
            borderBottom: `1px solid ${BORDER}`,
            color: DARK,
            fontFamily: "'Outfit', sans-serif",
          }}
        />
      </div>

      {errorGlobal && (
        <p className="text-center text-[.75rem]" style={{ color: ACENTO }}>
          {errorGlobal}
        </p>
      )}

      <button
        onClick={() => onSubmit(email)}
        disabled={loading}
        className="py-4 border-none rounded cursor-pointer text-[.75rem] font-semibold uppercase tracking-[.15em]"
        style={{
          background: DARK,
          color: BTN_TXT,
          fontFamily: "'Outfit', sans-serif",
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'ENVIANDO...' : 'RECUPERAR ACCESO'}
      </button>

      <button
        onClick={onGoLogin}
        className="self-center bg-transparent border-none underline cursor-pointer text-[.7rem] tracking-[.05em]"
        style={{ color: MUTED }}
      >
        VOLVER AL LOGIN
      </button>
    </div>
  );
}

// ── CONTENEDOR PRINCIPAL ─────────────────────────────────────

export default function AuthView({
  onClose,
  tienda,
  onLogin,
  onRegistro,
  onOlvide,
}: AuthViewProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState('');
  const [olvideEnviado, setOlvideEnviado] = useState(false);

  const tiendaNombre = tienda?.nombre || 'VESTE';

  const meta = {
    login: { titulo: 'ACCESO CLIENTES' },
    registro: { titulo: 'NUEVA CUENTA' },
    olvide: { titulo: 'OLVIDÉ MI CLAVE' },
  };

  async function handleLogin(data: any) {
    if (!onLogin) return;
    try { setLoading(true); setErrorGlobal(''); await onLogin(data); }
    catch (e: any) { setErrorGlobal(e.message || 'Error al iniciar sesión'); }
    finally { setLoading(false); }
  }

  async function handleRegistro(data: any) {
    if (!onRegistro) return;
    try { setLoading(true); setErrorGlobal(''); await onRegistro(data); }
    catch (e: any) { setErrorGlobal(e.message || 'Error al registrarse'); }
    finally { setLoading(false); }
  }

  async function handleOlvide(email: string) {
    if (!onOlvide) { setOlvideEnviado(true); return; }
    try { setLoading(true); setErrorGlobal(''); await onOlvide(email); setOlvideEnviado(true); }
    catch (e: any) { setErrorGlobal(e.message || 'Error al enviar instrucciones'); }
    finally { setLoading(false); }
  }

  return (
    <div
      className="pt-16 pb-16 px-8 min-h-[85vh] flex flex-col items-center justify-center"
      style={{ background: 'var(--rop-bg)' }}
    >
      <div className="max-w-[440px] w-full flex flex-col">
        {/* Back button */}
        <button
          onClick={onClose}
          className="self-start bg-transparent border-none cursor-pointer mb-16 flex items-center gap-2.5 font-medium tracking-[.1em] text-[.75rem]"
          style={{ color: MUTED }}
        >
          <span>←</span> VOLVER A LA TIENDA
        </button>

        {/* Title */}
        <h2
          className="text-[3.5rem] font-normal mb-4 tracking-[.05em] leading-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", color: DARK }}
        >
          {meta[mode].titulo}
        </h2>

        {/* Accent line */}
        <div className="w-[60px] h-0.5 mb-12" style={{ background: ACENTO }} />

        {/* Form switcher */}
        {mode === 'login' && (
          <FormLogin
            tiendaNombre={tiendaNombre}
            onSubmit={handleLogin}
            onGoRegistro={() => setMode('registro')}
            onGoOlvide={() => setMode('olvide')}
            loading={loading}
            errorGlobal={errorGlobal}
          />
        )}

        {mode === 'registro' && (
          <FormRegistro
            tiendaNombre={tiendaNombre}
            onSubmit={handleRegistro}
            onGoLogin={() => setMode('login')}
            loading={loading}
            errorGlobal={errorGlobal}
          />
        )}

        {mode === 'olvide' && (
          <FormOlvide
            onSubmit={handleOlvide}
            onGoLogin={() => setMode('login')}
            loading={loading}
            enviado={olvideEnviado}
            errorGlobal={errorGlobal}
          />
        )}
      </div>
    </div>
  );
}
