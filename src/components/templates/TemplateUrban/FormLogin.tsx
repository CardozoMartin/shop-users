import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLoginCliente } from '../../../hooks/useCliente';
import { useTiendaIDStore } from '../../../store/useTiendaIDStore';
import { useAuthSessionStore } from '../../../store/useAuthSession';
import type { LoginData } from './Types';

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

  const { mutate: postLogin, isPending, isError, error } = useLoginCliente();

  const handleSubmitForm = (data: LoginData) => {
    postLogin({ email: data.email, password: data.password, tiendaId: tiendaId! });
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-sm mx-auto">
      <p className="text-zinc-500 text-xs leading-relaxed uppercase tracking-widest text-center" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
        Ingresá a <span className="text-white font-black">{tiendaNombre}</span> para gestionar tus pedidos y envíos.
      </p>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-zinc-600 text-[10px] font-black uppercase tracking-widest ml-1">Email_Address</label>
          <input
            {...register('email', {
              required: 'Email es requerido',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' },
            })}
            type="email"
            placeholder="TU@EMAIL.COM"
            className={`w-full bg-zinc-950 border-2 px-5 py-4 text-white text-sm focus:outline-none transition-all duration-300 ${
              errors.email ? 'border-red-600' : 'border-zinc-900 focus:border-white'
            }`}
          />
          {errors.email && <span className="text-red-600 text-[9px] font-black uppercase ml-1">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-zinc-600 text-[10px] font-black uppercase tracking-widest ml-1">Password</label>
          <input
            {...register('password', { required: 'Contraseña es requerida' })}
            type="password"
            placeholder="••••••••"
            className={`w-full bg-zinc-950 border-2 px-5 py-4 text-white text-sm focus:outline-none transition-all duration-300 ${
              errors.password ? 'border-red-600' : 'border-zinc-900 focus:border-white'
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.password ? (
                <span className="text-red-600 text-[9px] font-black uppercase ml-1">{errors.password.message}</span>
            ) : <div />}
            <button
              onClick={onGoOlvide}
              className="text-zinc-600 hover:text-white text-[9px] font-black uppercase tracking-tighter bg-transparent border-none cursor-pointer transition-colors"
            >
              [ RECOVERY_MODE ]
            </button>
          </div>
        </div>
      </div>

      {isError && (
        <div className="bg-red-600 text-white p-4 text-[10px] font-black uppercase tracking-widest text-center">
            { (error as any)?.response?.data?.message || 'Error de autenticación' }
        </div>
      )}

      <button
        onClick={handleSubmit(handleSubmitForm)}
        disabled={isPending}
        className="w-full bg-red-600 hover:bg-white hover:text-black text-white font-black py-5 uppercase tracking-[0.2em] transition duration-500 text-xs border-none cursor-pointer disabled:opacity-50"
      >
        {isPending ? 'PROCESSING...' : 'ESTABLISH_SESSION'}
      </button>

      <div className="h-px bg-zinc-900 w-full mt-4" />

      <p className="text-center text-zinc-600 text-[10px] font-black uppercase tracking-widest">
        ¿No sos usuario?{' '}
        <button
          onClick={onGoRegistro}
          className="text-white hover:text-red-600 transition font-black bg-transparent border-none cursor-pointer underline"
        >
          REGISTRATE_AHORA
        </button>
      </p>
    </div>
  );
}
