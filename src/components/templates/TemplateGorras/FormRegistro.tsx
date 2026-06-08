import type { CSSProperties, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { useRegisterCliente } from '../../../hooks/useCliente';
import { useTiendaIDStore } from '../../../store/useTiendaIDStore';
import type { IClient } from '../../../types/clients.type';
import type { FormRegistroProps } from './Types';

// ── Variables CSS del tema ────────────────────────────────────────────────────
const ACENTO  = 'var(--gor-acento)';
const MUTED   = 'var(--gor-muted)';
const BTN_TXT = 'var(--gor-btn-txt)';
const BORDER  = 'var(--gor-border)';
const SURFACE = 'var(--gor-surface)';
const TXT     = 'var(--gor-txt)';

// ── Tipos internos ────────────────────────────────────────────────────────────

/** Datos del formulario: campos de IClient + confirmación de contraseña */
type FormData = IClient & { confirmar: string };

interface FieldGroupProps {
  label: string;
  error?: string;
  children: ReactNode;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Solo el borde varía dinámicamente (error vs. normal) */
function fieldStyle(hasError: boolean): CSSProperties {
  return {
    border: `1.5px solid ${hasError ? '#ef4444' : BORDER}`,
    background: SURFACE,
    color: TXT,
  };
}

/** Wrapper de campo: label + input + mensaje de error */
function FieldGroup({ label, error, children }: FieldGroupProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[.75rem] font-semibold tracking-[.03em]"
        style={{ color: MUTED, fontFamily: "'DM Sans',sans-serif" }}
      >
        {label}
      </label>
      {children}
      {error && (
        <span className="text-[.7rem] text-red-500" style={{ fontFamily: "'DM Sans',sans-serif" }}>
          {error}
        </span>
      )}
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function FormRegistro({ tiendaNombre, onGoLogin }: FormRegistroProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onBlur' });

  //ID Global de la tienda, necesario para asociar el nuevo cliente a la tienda correcta en el backend
  const { tiendaId } = useTiendaIDStore();

  //TQUERY para manejar la peticion
  const { mutate: postRegister, isPending } = useRegisterCliente();

  // watch solo el campo que necesitamos para la validación cruzada
  const passwordActual = watch('password');

  const handleSubmitForm = (data: FormData) => {
    postRegister({
      nombre:    data.nombre,
      apellido:  data.apellido,
      email:     data.email,
      telefono:  data.telefono,
      password:  data.password,
      tiendaId:  Number(tiendaId ?? 0),
    });
  };

  return (
    <div className="flex flex-col">

      {/* Descripción */}
      <p
        className="text-[.95rem] leading-[1.6] mb-8"
        style={{ color: MUTED, fontFamily: "'DM Sans',sans-serif" }}
      >
        Creá tu cuenta en{' '}
        <strong className="font-bold" style={{ color: ACENTO }}>{tiendaNombre}</strong>{' '}
        para hacer seguimiento de tus pedidos.
      </p>

      {/* Campos */}
      <div className="flex flex-col gap-4 mb-6">

        {/* Nombre + Apellido */}
        <div className="grid grid-cols-2 gap-4">
          <FieldGroup label="Nombre" error={errors.nombre?.message}>
            <input
              {...register('nombre', { required: 'Requerido' })}
              placeholder="Juan"
              className="w-full px-4 py-3 rounded-lg text-[.88rem] outline-none transition-colors duration-200"
              style={fieldStyle(!!errors.nombre)}
            />
          </FieldGroup>

          <FieldGroup label="Apellido" error={errors.apellido?.message}>
            <input
              {...register('apellido', { required: 'Requerido' })}
              placeholder="García"
              className="w-full px-4 py-3 rounded-lg text-[.88rem] outline-none transition-colors duration-200"
              style={fieldStyle(!!errors.apellido)}
            />
          </FieldGroup>
        </div>

        <FieldGroup label="Email" error={errors.email?.message}>
          <input
            {...register('email', {
              required: 'El email es requerido',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' },
            })}
            type="email"
            placeholder="tucorreo@email.com"
            className="w-full px-4 py-3 rounded-lg text-[.88rem] outline-none transition-colors duration-200"
            style={fieldStyle(!!errors.email)}
          />
        </FieldGroup>

        <FieldGroup label="Teléfono" error={errors.telefono?.message}>
          <input
            {...register('telefono', { required: 'El teléfono es requerido' })}
            type="tel"
            placeholder="381 123-4567"
            className="w-full px-4 py-3 rounded-lg text-[.88rem] outline-none transition-colors duration-200"
            style={fieldStyle(!!errors.telefono)}
          />
        </FieldGroup>

        <FieldGroup label="Contraseña" error={errors.password?.message}>
          <input
            {...register('password', {
              required: 'La contraseña es requerida',
              minLength: { value: 8, message: 'Mínimo 8 caracteres' },
            })}
            type="password"
            placeholder="Mínimo 8 caracteres"
            className="w-full px-4 py-3 rounded-lg text-[.88rem] outline-none transition-colors duration-200"
            style={fieldStyle(!!errors.password)}
          />
        </FieldGroup>

        <FieldGroup label="Confirmar contraseña" error={errors.confirmar?.message}>
          <input
            {...register('confirmar', {
              required: 'Confirmá tu contraseña',
              validate: (v) => v === passwordActual || 'Las contraseñas no coinciden',
            })}
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-lg text-[.88rem] outline-none transition-colors duration-200"
            style={fieldStyle(!!errors.confirmar)}
          />
        </FieldGroup>

      </div>

      {/* Botón submit */}
      <button
        onClick={handleSubmit(handleSubmitForm)}
        disabled={isPending}
        className="w-full py-3.5 rounded-full text-[.78rem] font-bold tracking-wide uppercase border-none transition-opacity duration-200"
        style={{
          background:  isPending ? `${ACENTO}80` : ACENTO,
          color:       BTN_TXT,
          cursor:      isPending ? 'not-allowed' : 'pointer',
          fontFamily:  "'DM Sans',sans-serif",
        }}
        onMouseEnter={(e) => { if (!isPending) e.currentTarget.style.opacity = '.85'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
      >
        {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      {/* Link a login */}
      <p
        className="text-[.85rem] text-center mt-7"
        style={{ color: MUTED, fontFamily: "'DM Sans',sans-serif" }}
      >
        ¿Ya tenés cuenta?{' '}
        <button
          onClick={onGoLogin}
          className="bg-transparent border-none text-[.85rem] font-semibold cursor-pointer p-0 underline"
          style={{ color: ACENTO, fontFamily: "'DM Sans',sans-serif" }}
        >
          Iniciá sesión
        </button>
      </p>

    </div>
  );
}