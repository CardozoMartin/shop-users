import { useState } from 'react';
import FormRegistro from './FormRegistro';
import FormLogin from './FormLogin';

// ── 1. TIPOS ─────────────────────────────────────────────────────
// Los diferentes estados o pantallas que el contenedor puede mostrar
type AuthMode = 'login' | 'registro' | 'olvide';

interface AuthViewProps {
  onClose: () => void;
  tienda?: {
    nombre?: string;
    logoUrl?: string;
  };
  // Callbacks para eventos de autenticación
  onLogin?: (data: any) => Promise<void>;
  onRegistro?: (data: any) => Promise<void>;
  onOlvide?: (email: string) => Promise<void>;
}

// ── 2. COLORES (heredados de las CSS vars de la plantilla Joyería) ───────
const ACENTO = 'var(--acc-acento)';
const MUTED = 'var(--acc-muted)';
const TXT = 'var(--acc-txt)';
const BTN_TXT = 'var(--acc-btn-txt)';
const BORDER = 'var(--acc-border)';
const SURFACE = 'var(--acc-surface)';

// ── 3. HELPERS DE COMPONENTE ──────────────────────────────────────────

/** Vista simplificada para recuperación de contraseña */
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
  
  // Si ya se envió el correo, mostramos confirmación
  if (enviado) {
    return (
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <p style={{ fontFamily: "'Jost', sans-serif", color: TXT, marginBottom: '2rem' }}>
          Te enviamos un email con las instrucciones para recuperar tu contraseña.
        </p>
        <button
          onClick={onGoLogin}
          style={{
            padding: '10px 24px',
            background: ACENTO,
            color: BTN_TXT,
            border: 'none',
            borderRadius: '4px',
            fontFamily: "'Jost', sans-serif",
            cursor: 'pointer'
          }}
        >
          Volver al login
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '.9rem', color: MUTED }}>
        Ingresá tu email y te mandamos un link para restablecer tu contraseña.
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontFamily: "'Jost', sans-serif", fontSize: '.75rem', fontWeight: 500, color: MUTED }}>Email</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@email.com"
          style={{
            padding: '12px',
            borderRadius: '4px',
            border: `1px solid ${BORDER}`,
            background: SURFACE,
            color: TXT,
            fontFamily: "'Jost', sans-serif",
            outline: 'none'
          }}
        />
      </div>

      {errorGlobal && <p style={{ color: '#ef4444', fontSize: '.75rem' }}>{errorGlobal}</p>}

      <button
        onClick={() => onSubmit(email)}
        disabled={loading}
        style={{
          padding: '14px',
          background: ACENTO,
          color: BTN_TXT,
          border: 'none',
          borderRadius: '50px',
          fontFamily: "'Jost', sans-serif",
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '.12em',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Enviando...' : 'Enviar instrucciones'}
      </button>

      <button
        onClick={onGoLogin}
        style={{ alignSelf: 'center', background: 'none', border: 'none', color: MUTED, fontSize: '.8rem', cursor: 'pointer', textDecoration: 'underline' }}
      >
        ← Volver al login
      </button>
    </div>
  );
}


// ── 4. COMPONENTE RAÍZ DE AUTENTICACIÓN ───────────────────────────────

export default function AuthView({
  onClose,
  tienda,
  onLogin,
  onRegistro,
  onOlvide,
}: AuthViewProps) {
  // Manejo del estado interno: modo actual, carga y errores
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState('');
  const [olvideEnviado, setOlvideEnviado] = useState(false);

  // Nombre de la tienda
  const tiendaNombre = tienda?.nombre || 'la tienda';

  // Textos según el modo actual
  const meta = {
    login: { titulo: 'Bienvenido' },
    registro: { titulo: 'Crear cuenta' },
    olvide: { titulo: 'Recuperar acceso' },
  };

  // Handlers para las acciones
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
    if (!onOlvide) { setOlvideEnviado(true); return; }
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

  // ── 5. RENDERIZADO ───────────────────────────────────────────────────

  return (
    <div
      style={{
        padding: '3rem 1.5rem',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--acc-bg)',
      }}
    >
      <div style={{ maxWidth: '420px', width: '100%', display: 'flex', flexDirection: 'column' }}>
        
        {/* Botón de cierre o vuelta */}
        <button
          onClick={onClose}
          style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: MUTED, fontSize: '.85rem', cursor: 'pointer', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span>←</span> Volver a la tienda
        </button>

        {/* Título elegante con tipografía Serif de Joyería */}
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300, color: TXT, marginBottom: '.5rem' }}>
          {meta[mode].titulo}
        </h2>

        {/* Separador estilizado */}
        <div style={{ width: '40px', height: '1.5px', background: ACENTO, marginBottom: '2.5rem' }} />

        {/* 6. Switcher de sub-formularios según el modo */}
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
