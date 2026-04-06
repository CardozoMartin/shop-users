import { useEffect, useState } from 'react';
import { useOlvidePasswordCliente } from '../../../hooks/useCliente';
import { useAuthSessionStore } from '../../../store/useAuthSession';
import { useTiendaIDStore } from '../../../store/useTiendaIDStore';
import FormLogin from './FormLogin';
import FormRegistro from './FormRegistro';

type AuthMode = 'login' | 'register' | 'recovery';

export default function AuthView({
  onClose,
  onLoginSuccess,
  tienda,
}: {
  onClose: () => void;
  onLoginSuccess: (user?: any) => void;
  tienda?: { nombre?: string };
}) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [recoverySent, setRecoverySent] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const token = useAuthSessionStore((state) => state.token);
  const { tiendaId } = useTiendaIDStore();
  const { mutate: solicitarReset, isPending: isRecoveryLoading } = useOlvidePasswordCliente();

  useEffect(() => {
    if (token) {
      onLoginSuccess();
    }
  }, [token, onLoginSuccess]);

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail || !tiendaId) return;
    solicitarReset({ email: recoveryEmail, tiendaId }, { onSuccess: () => setRecoverySent(true) });
  };

  const tiendaNombre = tienda?.nombre || 'la tienda';

  return (
    <div className="bg-black min-h-[90vh] flex flex-col justify-center items-center py-20 px-6 relative">
      <button
        onClick={onClose}
        className="absolute top-10 left-10 text-zinc-600 hover:text-white font-black uppercase text-[10px] tracking-widest transition-all cursor-pointer bg-transparent border-none"
      >
        ← Volver a la calle
      </button>

      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <h1
            className="text-white text-6xl leading-none uppercase mb-2"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {mode === 'login' && 'ACCESO_TOTAL'}
            {mode === 'register' && 'NUEVO_DROPS'}
            {mode === 'recovery' && 'RECORDA_TU_KEY'}
          </h1>
          <div className="w-12 h-1 bg-red-600 mx-auto" />
        </div>

        {mode === 'login' && (
          <FormLogin
            tiendaNombre={tiendaNombre}
            onGoRegistro={() => setMode('register')}
            onGoOlvide={() => setMode('recovery')}
            onLoginSuccess={() => onLoginSuccess()}
          />
        )}

        {mode === 'register' && (
          <FormRegistro
            tiendaNombre={tiendaNombre}
            onGoLogin={() => setMode('login')}
            onRegistroSuccess={() => setMode('login')}
          />
        )}

        {mode === 'recovery' && (
          <div className="bg-zinc-950 border border-zinc-900 p-10">
            {recoverySent ? (
              <div className="text-center space-y-6">
                <div className="text-red-600 text-5xl mb-4">✉️</div>
                <p className="text-white text-xs font-black uppercase tracking-widest leading-relaxed">
                  Si el email coincide con un usuario de {tiendaNombre}, recibirás instrucciones en
                  breve.
                </p>
                <button
                  onClick={() => setMode('login')}
                  className="text-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest bg-transparent border-none cursor-pointer underline"
                >
                  Volver al login
                </button>
              </div>
            ) : (
              <form onSubmit={handleRecovery} className="space-y-8">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest text-center leading-loose">
                  Ingresá tu email para recibir un link de restauración.
                </p>
                <div className="space-y-2">
                  <label className="text-zinc-600 text-[10px] font-black uppercase tracking-widest ml-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    className="w-full bg-black border border-zinc-900 text-white px-5 py-4 focus:outline-none focus:border-red-600 transition text-sm"
                    placeholder="TU@EMAIL.COM"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isRecoveryLoading}
                  className="w-full bg-white text-black hover:bg-red-600 hover:text-white font-black py-4 uppercase tracking-widest transition duration-500 text-[10px] border-none cursor-pointer"
                >
                  {isRecoveryLoading ? 'ENVIANDO...' : 'SOLICITAR_NUEVA_KEY'}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="w-full text-zinc-500 hover:text-white text-[9px] font-black uppercase tracking-widest bg-transparent border-none cursor-pointer"
                >
                  Cancelar
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
