import { useState } from 'react';
import FormLogin from './FormLogin';
import FormRegistro from './FormRegistro';

// ── 1. TIPOS ─────────────────────────────────────────────────────
type AuthMode = 'login' | 'registro' | 'olvide';

interface AuthViewProps {
  onClose: () => void;
  tienda?: {
    nombre?: string;
    logoUrl?: string;
  };
  onLogin?: (data: any) => Promise<void>;
  onRegistro?: (data: any) => Promise<void>;
  onOlvide?: (email: string) => Promise<void>;
}

// ── 2. COLORES (heredados de VESTE / Ropa) ────────────────────────
const ACENTO = 'var(--rop-acento)';
const DARK = 'var(--rop-dark)';
const MUTED = 'var(--rop-muted)';
const BTN_TXT = 'var(--rop-btn-txt)';
const BORDER = 'var(--rop-border)';

// ── 3. FORMULARIO OLVIDÉ CONTRASEÑA ──────────────────────────────

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

  // Vista de confirmación tras el envío
  if (enviado) {
    return (
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            color: DARK,
            marginBottom: '2.5rem',
            fontWeight: 300,
            lineHeight: 1.6,
          }}
        >
          Te enviamos un email con las instrucciones para recuperar tu contraseña.
        </p>
        <button
          onClick={onGoLogin}
          style={{
            padding: '12px 32px',
            background: DARK,
            color: BTN_TXT,
            border: 'none',
            borderRadius: '4px',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '.12em',
            cursor: 'pointer',
          }}
        >
          Volver al login
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '.9rem',
          color: MUTED,
          fontWeight: 300,
        }}
      >
        Ingresá tu email y te mandamos un link para restablecer tu contraseña.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '.62rem',
            fontWeight: 600,
            color: DARK,
            letterSpacing: '.12em',
          }}
        >
          EMAIL
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="hola@tuemail.com"
          style={{
            padding: '12px 0',
            border: 'none',
            borderBottom: `1px solid ${BORDER}`,
            background: 'transparent',
            color: DARK,
            fontFamily: "'Outfit', sans-serif",
            outline: 'none',
          }}
        />
      </div>

      {errorGlobal && (
        <p style={{ color: ACENTO, fontSize: '.75rem', textAlign: 'center' }}>{errorGlobal}</p>
      )}

      <button
        onClick={() => onSubmit(email)}
        disabled={loading}
        style={{
          padding: '16px',
          background: DARK,
          color: BTN_TXT,
          border: 'none',
          borderRadius: '4px',
          fontFamily: "'Outfit', sans-serif",
          fontSize: '.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '.15em',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'ENVIANDO...' : 'REPERCUPERAR ACCESO'}
      </button>

      <button
        onClick={onGoLogin}
        style={{
          alignSelf: 'center',
          background: 'none',
          border: 'none',
          color: MUTED,
          fontSize: '.7rem',
          cursor: 'pointer',
          textDecoration: 'underline',
          letterSpacing: '.05em',
        }}
      >
        VOLVER AL LOGIN
      </button>
    </div>
  );
}

// ── 4. CONTENEDOR PRINCIPAL ──────────────────────────────────────────

export default function AuthView({
  onClose,
  tienda,
  onLogin,
  onRegistro,
  onOlvide,
}: AuthViewProps) {
  // Estados para controlar la navegación entre formularios y el feedback visual
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState('');
  const [olvideEnviado, setOlvideEnviado] = useState(false);

  const tiendaNombre = tienda?.nombre || 'VESTE';

  // Títulos minimalistas con Bebas Neue
  const meta = {
    login: { titulo: 'ACCESO CLIENTES' },
    registro: { titulo: 'NUEVA CUENTA' },
    olvide: { titulo: 'OLVIDÉ MI CLAVE' },
  };

  // Handlers conectados a la lógica del backend (hooks)
  async function handleLogin(data: any) {
    if (!onLogin) return;
    try {
      setLoading(true);
      setErrorGlobal('');
      await onLogin(data);
    } catch (e: any) {
      setErrorGlobal(e.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegistro(data: any) {
    if (!onRegistro) return;
    try {
      setLoading(true);
      setErrorGlobal('');
      await onRegistro(data);
    } catch (e: any) {
      setErrorGlobal(e.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  }

  async function handleOlvide(email: string) {
    if (!onOlvide) {
      setOlvideEnviado(true);
      return;
    }
    try {
      setLoading(true);
      setErrorGlobal('');
      await onOlvide(email);
      setOlvideEnviado(true);
    } catch (e: any) {
      setErrorGlobal(e.message || 'Error al enviar instrucciones');
    } finally {
      setLoading(false);
    }
  }

  // ── 5. RENDERIZADO FINAL ───────────────────────────────────────────

  return (
    <div
      style={{
        padding: '4rem 2rem',
        minHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--rop-bg)',
      }}
    >
      <div style={{ maxWidth: '440px', width: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Enlace de retorno estilo editorial */}
        <button
          onClick={onClose}
          style={{
            alignSelf: 'flex-start',
            background: 'none',
            border: 'none',
            color: MUTED,
            fontSize: '.75rem',
            cursor: 'pointer',
            marginBottom: '4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 500,
            letterSpacing: '.1em',
          }}
        >
          <span>←</span> VOLVER A LA TIENDA
        </button>

        {/* Título en tipografía IMPACTANTE (Bebas Neue) */}
        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '3.5rem',
            fontWeight: 400,
            color: DARK,
            marginBottom: '1rem',
            letterSpacing: '.05em',
            lineHeight: 1,
          }}
        >
          {meta[mode].titulo}
        </h2>

        {/* Línea roja característica de VESTE */}
        <div style={{ width: '60px', height: '2px', background: ACENTO, marginBottom: '3rem' }} />

        {/* 6. Switcher de pantalla actual */}
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
