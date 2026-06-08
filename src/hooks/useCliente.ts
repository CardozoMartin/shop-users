import { useMutation, useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import { 
  getPerfilClienteFn, 
  postLoginClienteFn, 
  postRegisterClientFn,
  postOlvidePasswordClienteFn,
  postResetPasswordClienteFn,
} from '../api/Clients.api';
import type { IErrorResponse, ISuccessResponse } from '../types/api.type';
import type { IClient } from '../types/clients.type';

import { useAuthSessionStore } from '../store/useAuthSession';

const getErrorMessage = (error: AxiosError<IErrorResponse>): string => {
  const data = error.response?.data;
  return data?.errores?.join(' · ') ?? data?.mensaje ?? 'Error inesperado';
};

//hook para registar un cliente nuevo
export const useRegisterCliente = () => {
  return useMutation({
    mutationFn: postRegisterClientFn,
    onSuccess: (data: ISuccessResponse<IClient>) => {
      // Handle successful client registration
      toast.success(data.mensaje);
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      const errorMessage = getErrorMessage(error);
      // Handle error (e.g., display error message)
      toast.error(errorMessage);
    },
  });
};

//hook para loguear un cliente existente
export const useLoginCliente = () => {
  const setToken = useAuthSessionStore((state) => state.setToken);
  const setCliente = useAuthSessionStore((state) => state.setCliente);

  return useMutation({
    mutationFn: ({ email, password, tiendaId }: { email: string; password: string; tiendaId: number }) =>
      postLoginClienteFn(email, password, tiendaId),
    onSuccess: (res: any) => {
      // Según el formato solicitado: res.datos contiene token y datos del cliente
      const { token, ...clienteData } = res.datos;
      
      // Guardamos en el store global
      setToken(token);
      setCliente(clienteData);
      
      toast.success(res.mensaje || 'Login exitoso');
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    },
  });
};

export const usePerfilCliente = (enabled: boolean) => {
  return useQuery({
    queryKey: ['perfil-cliente'],
    queryFn: getPerfilClienteFn,
    enabled,
  });
};

//hook para solicitar el reset de password
export const useOlvidePasswordCliente = () => {
  return useMutation({
    mutationFn: ({ email, tiendaId }: { email: string; tiendaId: number }) =>
      postOlvidePasswordClienteFn(email, tiendaId),
    onSuccess: (data: any) => {
      toast.success(data.mensaje || 'Instrucciones enviadas a tu email');
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    },
  });
};

//hook para confirmar el reset de password
export const useResetPasswordCliente = () => {
  return useMutation({
    mutationFn: postResetPasswordClienteFn,
    onSuccess: (data: any) => {
      toast.success(data.mensaje || 'Contraseña restablecida correctamente');
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    },
  });
};
