import { useState } from 'react';
import FormRegistro from './FormRegistro';
import FormLogin from './FormLogin';
// ── TIPOS ─────────────────────────────────────────────────────

type AuthMode = 'login' | 'registro' | 'olvide';

interface AuthViewProps {
  onClose: () => void;
  tienda?: {
    nombre?: string;
    logoUrl?: string;
  };
  // Callbacks para conectar con tu backend cuando lo implementes
  onLogin?: (data: LoginData) => Promise<void>;
  onRegistro?: (data: RegistroData) => Promise<void>;
  onOlvide?: (email: string) => Promise<void>;
}

interface LoginData {
  email: string;
  password: string;
  tiendaId: number;
}

interface RegistroData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
}

// ── COLORES (heredados de las CSS vars de la plantilla) ───────

const ACENTO = 'var(--gor-acento)';
const BG = 'var(--gor-bg)';
const SURFACE = 'var(--gor-surface)';
const TXT = 'var(--gor-txt)';
const MUTED = 'var(--gor-muted)';
const BORDER = 'var(--gor-border)';
const BTN_TXT = 'var(--gor-btn-txt)';

// ── HELPERS ───────────────────────────────────────────────────

/** Estilos base para los inputs, reutilizados en los 3 formularios */
function inputStyle(focused: boolean): React.CSSProperties {
  return {
    width: '100%',
    padding: '13px 16px',
    border: `1.5px solid ${focused ? 'var(--gor-acento)' : 'var(--gor-border)'}`,
    borderRadius: '10px',
    background: 'var(--gor-surface)',
    color: 'var(--gor-txt)',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '.95rem',
    outline: 'none',
    transition: 'border-color .2s',
  };
}

/** Input controlado con foco automático del borde acento */
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '.78rem',
          fontWeight: 600,
          color: MUTED,
          letterSpacing: '.03em',
        }}
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
        style={inputStyle(focused)}
      />
      {/* Error inline debajo del campo */}
      {error && (
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '.72rem',
            color: '#ef4444',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}




// ── VISTA OLVIDÉ CONTRASEÑA ───────────────────────────────────

function FormOlvide({
  onSubmit,
  onGoLogin,
  loading,
  enviado,
  errorGlobal,
}: {
  onSubmit: (email: string) => void;
  onGoLogin: () => void;
  loading: boolean;
  enviado: boolean;
  errorGlobal?: string;
}) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function handleSubmit() {
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
  }

  // Estado "enviado" — confirmación
  if (enviado) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          paddingTop: '1rem',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: `var(--gor-acento)14`,
            border: `2px solid var(--gor-acento)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
          }}
        >
          ✉️
        </div>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '1rem',
            color: TXT,
            textAlign: 'center',
            lineHeight: 1.7,
          }}
        >
          Te enviamos un email con las instrucciones para recuperar tu contraseña.
          <br />
          <span style={{ color: MUTED, fontSize: '.88rem' }}>
            Revisá también tu carpeta de spam.
          </span>
        </p>
        <button
          onClick={onGoLogin}
          style={{
            padding: '12px 28px',
            background: 'var(--gor-acento)',
            color: BTN_TXT,
            border: 'none',
            borderRadius: '10px',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: '.5rem',
          }}
        >
          Volver al login
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '.95rem',
          color: MUTED,
          marginBottom: '2.5rem',
          lineHeight: 1.6,
        }}
      >
        Ingresá tu email y te mandamos un link para restablecer tu contraseña.
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
        <Field
          label="Email registrado"
          type="email"
          placeholder="tucorreo@email.com"
          value={email}
          onChange={setEmail}
          error={error}
        />
      </div>

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

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%',
          padding: '14px',
          background: loading ? `${ACENTO}80` : ACENTO,
          color: BTN_TXT,
          border: 'none',
          borderRadius: '10px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '.95rem',
          fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'opacity .2s',
        }}
      >
        {loading ? 'Enviando...' : 'Enviar instrucciones'}
      </button>

      <button
        onClick={onGoLogin}
        style={{
          marginTop: '1.25rem',
          background: 'none',
          border: 'none',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '.85rem',
          color: MUTED,
          cursor: 'pointer',
          textDecoration: 'underline',
          padding: 0,
          alignSelf: 'center',
          transition: 'color .2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = TXT)}
        onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
      >
        ← Volver al login
      </button>
    </div>
  );
}

// ── COMPONENTE RAÍZ ───────────────────────────────────────────

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

  // Nombre de tienda para los mensajes personalizados
  const tiendaNombre = tienda?.nombre || 'la tienda';

  // Títulos y subtítulos dinámicos según el modo
  const meta: Record<AuthMode, { titulo: string; subtitulo?: string }> = {
    login: {
      titulo: `¡Qué bueno verte!`,
    },
    registro: {
      titulo: 'Creá tu cuenta',
    },
    olvide: {
      titulo: 'Recuperar contraseña',
    },
  };

  // ── Handlers conectados a los callbacks del padre ──────────

  async function handleLogin(data: LoginData) {
    if (!onLogin) return;
    try {
      setLoading(true);
      setErrorGlobal('');
      await onLogin(data);
      // Si no tira error, el padre maneja el cierre/redirección
    } catch (e: any) {
      setErrorGlobal(e?.message || 'Email o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegistro(data: RegistroData) {
    if (!onRegistro) return;
    try {
      setLoading(true);
      setErrorGlobal('');
      await onRegistro(data);
    } catch (e: any) {
      setErrorGlobal(e?.message || 'No se pudo crear la cuenta. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  async function handleOlvide(email: string) {
    if (!onOlvide) {
      setOlvideEnviado(true);
      return;
    } // demo sin backend
    try {
      setLoading(true);
      setErrorGlobal('');
      await onOlvide(email);
      setOlvideEnviado(true);
    } catch (e: any) {
      setErrorGlobal(e?.message || 'No se pudo enviar el email. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  // Limpiar error global al cambiar de modo
  function cambiarModo(m: AuthMode) {
    setErrorGlobal('');
    setMode(m);
  }

  return (
    <div
      style={{
        padding: '3rem 1.5rem',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          width: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Botón volver a la tienda */}
        <button
          onClick={onClose}
          style={{
            alignSelf: 'flex-start',
            background: 'none',
            border: 'none',
            color: MUTED,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '.85rem',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '3rem',
            padding: 0,
            transition: 'color .2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = TXT)}
          onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
        >
          <span style={{ fontSize: '1.2rem' }}>←</span> Volver a la tienda
        </button>

        {/* Logo de la tienda si existe */}
        {tienda?.logoUrl && (
          <img
            src={tienda.logoUrl}
            alt={tiendaNombre}
            style={{
              height: '40px',
              objectFit: 'contain',
              alignSelf: 'flex-start',
              marginBottom: '1.5rem',
            }}
          />
        )}

        {/* Título dinámico */}
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.9rem, 3.5vw, 2.6rem)',
            fontWeight: 700,
            color: TXT,
            marginBottom: '.5rem',
            lineHeight: 1.1,
          }}
        >
          {meta[mode].titulo}
        </h1>

        {/* Divisor acento */}
        <div
          style={{
            width: '40px',
            height: '3px',
            background: 'var(--gor-acento)',
            borderRadius: '2px',
            marginBottom: '1.75rem',
          }}
        />

        {/* Formulario activo */}
        {mode === 'login' && (
          <FormLogin
            tiendaNombre={tiendaNombre}
            onSubmit={handleLogin}
            onGoRegistro={() => cambiarModo('registro')}
            onGoOlvide={() => cambiarModo('olvide')}
            loading={loading}
            errorGlobal={errorGlobal}
          />
        )}

        {mode === 'registro' && (
          <FormRegistro
            tiendaNombre={tiendaNombre}
            onSubmit={handleRegistro}
            onGoLogin={() => cambiarModo('login')}
            loading={loading}
            errorGlobal={errorGlobal}
          />
        )}

        {mode === 'olvide' && (
          <FormOlvide
            onSubmit={handleOlvide}
            onGoLogin={() => cambiarModo('login')}
            loading={loading}
            enviado={olvideEnviado}
            errorGlobal={errorGlobal}
          />
        )}
      </div>
    </div>
  );
}
