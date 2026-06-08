import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useResetPasswordCliente } from '../hooks/useCliente';
import { motion } from 'framer-motion';

export default function ResetPassPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { mutate: resetPassword, isPending } = useResetPasswordCliente();
  
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 text-center shadow-xl">
          <p className="text-red-500 font-semibold mb-6">Enlace de restablecimiento inválido.</p>
          <button onClick={() => navigate('/')} className="px-6 py-2 bg-slate-800 text-white rounded-xl">Volver</button>
        </div>
      </div>
    );
  }

  const onSubmit = (data: any) => {
    resetPassword({
      token,
      passwordNueva: data.password,
      passwordConfirmar: data.confirmPassword,
    }, {
      onSuccess: () => setSuccess(true),
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-white rounded-3xl p-10 text-center shadow-2xl">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">✓</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">¡Contraseña actualizada!</h1>
          <p className="text-slate-500 mb-8">Tu contraseña ha sido restablecida con éxito. Ya podés iniciar sesión con tu nueva clave.</p>
          <button onClick={() => navigate('/')} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100">Ir al inicio</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Nueva contraseña</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">Crea una nueva contraseña segura para tu cuenta.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Contraseña nueva</label>
            <input 
              {...register('password', { 
                required: 'La contraseña es requerida',
                minLength: { value: 8, message: 'Mínimo 8 caracteres' }
              })}
              type="password" 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{(errors.password as any).message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Confirmar contraseña</label>
            <input 
              {...register('confirmPassword', { 
                validate: (val) => val === watch('password') || 'Las contraseñas no coinciden'
              })}
              type="password" 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{(errors.confirmPassword as any).message}</p>}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
          >
            {isPending ? 'Actualizando...' : 'Actualizar contraseña'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
