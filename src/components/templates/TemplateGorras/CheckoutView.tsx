import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Tienda, Carrito } from './Types';
import { createPedido } from '../../../api/pedidos.api';

interface CheckoutViewProps {
  tienda: Tienda;
  carrito: Carrito;
  onClose: () => void;
  onSuccess: (orderId: number) => void;
  sessionId: string;
}

type CheckoutStep = 'datos' | 'entrega' | 'pago' | 'resumen';

interface CheckoutFormValues {
  nombre: string;
  email: string;
  tel: string;
  calle: string;
  numero: string;
  ciudad: string;
  provincia: string;
  metodoEntregaId: number;
  metodoPagoId: number;
  notas: string;
}

// -- CSS vars --------------------------------------------------
const ACENTO = 'var(--gor-acento)';
const TXT = 'var(--gor-txt)';
const MUTED = 'var(--gor-muted)';
const BORDER = 'var(--gor-border)';
const SURFACE = 'var(--gor-surface)';
const BTN_TXT = 'var(--gor-btn-txt)';

export default function CheckoutView({ tienda, carrito, onClose, onSuccess, sessionId }: CheckoutViewProps) {
  const [step, setStep] = useState<CheckoutStep>('datos');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      nombre: '',
      email: '',
      tel: '',
      calle: '',
      numero: '',
      ciudad: '',
      provincia: '',
      metodoEntregaId: 0,
      metodoPagoId: 0,
      notas: '',
    },
  });

  const watched = watch();

  const subtotal = useMemo(() => carrito.items.reduce((acc, item) => acc + Number(item.precioUnit) * item.cantidad, 0), [carrito]);

  const advanceStep = async () => {
    if (step === 'datos') {
      const ok = await trigger(['nombre', 'email', 'tel', 'calle', 'ciudad', 'provincia']);
      if (!ok) {
        setError('Por favor completa los campos obligatorios');
        return;
      }
      setError('');
      setStep('entrega');
      return;
    }

    if (step === 'entrega') {
      const ok = await trigger('metodoEntregaId');
      if (!ok) {
        setError('Selecciona un m�todo de entrega');
        return;
      }
      setError('');
      setStep('pago');
      return;
    }

    if (step === 'pago') {
      const ok = await trigger('metodoPagoId');
      if (!ok) {
        setError('Selecciona un m�todo de pago');
        return;
      }
      setError('');
      setStep('resumen');
      return;
    }
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        compradorNombre: data.nombre,
        compradorEmail: data.email,
        compradorTel: data.tel,
        metodoEntregaId: data.metodoEntregaId,
        direccionCalle: data.calle,
        direccionNumero: data.numero,
        direccionCiudad: data.ciudad,
        direccionProv: data.provincia,
        metodoPagoId: data.metodoPagoId,
        notasCliente: data.notas,
      };
      const res = await createPedido(tienda.id!, sessionId, payload);
      onSuccess(res.id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 'datos') {
      onClose();
      return;
    }
    if (step === 'entrega') {
      setStep('datos');
      return;
    }
    if (step === 'pago') {
      setStep('entrega');
      return;
    }
    if (step === 'resumen') {
      setStep('pago');
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-12 min-h-[80vh] flex flex-col">
      <div className="max-w-[600px] mx-auto w-full flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-10">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-2 bg-transparent border-none text-[.85rem] font-medium cursor-pointer p-0 transition-colors duration-200"
            style={{ color: MUTED, fontFamily: "'DM Sans',sans-serif" }}
          >
            <span className="text-xl">?</span> {step === 'datos' ? 'Volver al carrito' : 'Volver atr�s'}
          </button>
          <span className="text-[.75rem] font-bold uppercase tracking-widest" style={{ color: ACENTO }}>
            Paso {step === 'datos' ? '1' : step === 'entrega' ? '2' : step === 'pago' ? '3' : '4'} de 4
          </span>
        </div>

        <h1
          className="font-bold leading-[1.1] mb-6"
          style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: TXT }}
        >
          {step === 'datos' && 'Datos de env�o'}
          {step === 'entrega' && 'M�todo de env�o'}
          {step === 'pago' && 'M�todo de pago'}
          {step === 'resumen' && 'Resumen de tu pedido'}
        </h1>

        <div className="w-10 h-[3px] rounded-sm mb-10" style={{ background: ACENTO }} />

        {error && <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-[.85rem] border border-red-100">{error}</div>}

        <div className="flex-1">
          {step === 'datos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              // ... inputs for datos as above (same code) ...
            </div>
          )}

          {step === 'entrega' && (
            <div className="flex flex-col gap-4">
              // ... radios de entrega ...
            </div>
          )}

          {step === 'pago' && (
            <div className="flex flex-col gap-4">
              // ... radios de pago ...
            </div>
          )}

          {step === 'resumen' && (
            <div className="flex flex-col gap-8">
              // ... resumen de pedido ...
            </div>
          )}
        </div>

        <div className="mt-12 flex flex-col gap-4">
          <button
            type={step === 'resumen' ? 'submit' : 'button'}
            onClick={step !== 'resumen' ? advanceStep : undefined}
            disabled={loading}
            className="w-full py-4 rounded-[12px] text-[1rem] font-bold border-none transition-all active:scale-[0.98] disabled:opacity-50"
            style={{ background: ACENTO, color: BTN_TXT, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: `0 8px 24px -6px ${ACENTO}66` }}
          >
            {loading ? 'Procesando...' : step === 'resumen' ? 'Finalizar Pedido' : 'Siguiente'}
          </button>
          <p className="text-[.75rem] text-center" style={{ color: MUTED }}>
            {step === 'resumen'
              ? 'Al hacer clic en finalizar, tu pedido ser� registrado y nos pondremos en contacto.'
              : 'Todos tus datos est�n protegidos y son necesarios para procesar la compra.'}
          </p>
        </div>
      </div>
    </form>
  );
}
