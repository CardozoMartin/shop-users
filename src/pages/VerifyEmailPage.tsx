import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getVerificarEmailClienteFn } from '../api/Clients.api';
import { motion } from 'framer-motion';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando tu cuenta...');
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de verificación no encontrado.');
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    const verificar = async () => {
      try {
        await getVerificarEmailClienteFn(token);
        setStatus('success');
        setMessage('¡Tu cuenta ha sido verificada exitosamente!');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.mensaje || 'Error al verificar la cuenta. El enlace puede haber expirado.');
      }
    };

    verificar();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-slate-100"
      >
        <div className="mb-8 flex justify-center">
          {status === 'loading' && (
            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          )}
          {status === 'success' && (
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-4xl text-emerald-500 border border-emerald-100 shadow-sm">
              ✓
            </div>
          )}
          {status === 'error' && (
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-4xl text-red-500 border border-red-100 shadow-sm">
              ✕
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
          {status === 'loading' ? 'Verificación en curso' : 
           status === 'success' ? '¡Email verificado!' : 'Error de verificación'}
        </h1>
        
        <p className="text-slate-500 mb-10 leading-relaxed text-[17px]">
          {message}
        </p>

        {status !== 'loading' && (
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold transition-all shadow-lg shadow-indigo-200"
          >
            Volver a la tienda
          </button>
        )}
      </motion.div>
    </div>
  );
}
