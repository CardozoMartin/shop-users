import { useForm } from 'react-hook-form';
import { useRegisterCliente } from '../../../hooks/useCliente';
import { useTiendaIDStore } from '../../../store/useTiendaIDStore';
import type { RegistroData } from './Types';

interface FormRegistroProps {
  tiendaNombre: string;
  onGoLogin: () => void;
  onRegistroSuccess: () => void;
}

export default function FormRegistro({ tiendaNombre, onGoLogin, onRegistroSuccess }: FormRegistroProps) {
  const { tiendaId } = useTiendaIDStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistroData>({ mode: 'onBlur' });

  const { mutate: postRegistro, isPending, isError, error } = useRegisterCliente();

  const handleSubmitForm = (data: RegistroData) => {
    postRegistro(
      { 
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        telefono: data.telefono,
        password: data.password,
        tiendaId: tiendaId! 
      },
      { onSuccess: () => onRegistroSuccess() }
    );
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-sm mx-auto">
      <p className="text-zinc-500 text-xs leading-relaxed uppercase tracking-widest text-center" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
        Unite a <span className="text-white font-black">{tiendaNombre}</span>. Formá parte de nuestra comunidad urbana.
      </p>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-zinc-600 text-[10px] font-black uppercase tracking-widest ml-1">First_Name</label>
            <input
              {...register('nombre', { required: 'Requerido' })}
              type="text"
              placeholder="NOMBRE"
              className={`w-full bg-zinc-950 border-2 px-5 py-4 text-white text-sm focus:outline-none transition-all duration-300 ${
                errors.nombre ? 'border-red-600' : 'border-zinc-900 focus:border-white'
              }`}
            />
            {errors.nombre && <span className="text-red-600 text-[9px] font-black uppercase ml-1">{errors.nombre.message}</span>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-zinc-600 text-[10px] font-black uppercase tracking-widest ml-1">Last_Name</label>
            <input
              {...register('apellido', { required: 'Requerido' })}
              type="text"
              placeholder="APELLIDO"
              className={`w-full bg-zinc-950 border-2 px-5 py-4 text-white text-sm focus:outline-none transition-all duration-300 ${
                errors.apellido ? 'border-red-600' : 'border-zinc-900 focus:border-white'
              }`}
            />
            {errors.apellido && <span className="text-red-600 text-[9px] font-black uppercase ml-1">{errors.apellido.message}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-zinc-600 text-[10px] font-black uppercase tracking-widest ml-1">Email</label>
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
          <label className="text-zinc-600 text-[10px] font-black uppercase tracking-widest ml-1">Phone</label>
          <input
            {...register('telefono', { required: 'Teléfono es requerido' })}
            type="tel"
            placeholder="381 000-0000"
            className={`w-full bg-zinc-950 border-2 px-5 py-4 text-white text-sm focus:outline-none transition-all duration-300 ${
              errors.telefono ? 'border-red-600' : 'border-zinc-900 focus:border-white'
            }`}
          />
          {errors.telefono && <span className="text-red-600 text-[9px] font-black uppercase ml-1">{errors.telefono.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-zinc-600 text-[10px] font-black uppercase tracking-widest ml-1">Password</label>
          <input
            {...register('password', { 
                required: 'Contraseña es requerida',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' }
            })}
            type="password"
            placeholder="••••••••"
            className={`w-full bg-zinc-950 border-2 px-5 py-4 text-white text-sm focus:outline-none transition-all duration-300 ${
              errors.password ? 'border-red-600' : 'border-zinc-900 focus:border-white'
            }`}
          />
          {errors.password && <span className="text-red-600 text-[9px] font-black uppercase ml-1">{errors.password.message}</span>}
        </div>
      </div>

      {isError && (
        <div className="bg-red-600 text-white p-4 text-[10px] font-black uppercase tracking-widest text-center">
            { (error as any)?.response?.data?.message || 'Error al crear cuenta' }
        </div>
      )}

      <button
        onClick={handleSubmit(handleSubmitForm)}
        disabled={isPending}
        className="w-full bg-white text-black hover:bg-red-600 hover:text-white font-black py-5 uppercase tracking-[0.2em] transition duration-500 text-xs border-none cursor-pointer disabled:opacity-50"
      >
        {isPending ? 'CREATING...' : 'CREATE_ACCOUNT'}
      </button>

      <div className="h-px bg-zinc-900 w-full mt-4" />

      <p className="text-center text-zinc-600 text-[10px] font-black uppercase tracking-widest">
        ¿Ya tenés cuenta?{' '}
        <button
          onClick={onGoLogin}
          className="text-white hover:text-red-600 transition font-black bg-transparent border-none cursor-pointer underline"
        >
          LOG_IN_AQUÍ
        </button>
      </p>
    </div>
  );
}
