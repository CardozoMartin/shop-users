import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import {
  getResenasProductoFn,
  getEstadisticasResenaProductoFn,
  postCrearResenaProductoFn,
  getResenasTiendaFn,
  getEstadisticasResenaTiendaFn,
  postCrearResenaTiendaFn,
} from '../api/Clients.api';

const getErrorMessage = (error: AxiosError<any>): string => {
  const data = error.response?.data;
  if (error.response?.status === 401) return 'Debés iniciar sesión para dejar una reseña';
  return data?.errores?.join(' · ') ?? data?.mensaje ?? 'Error inesperado';
};

// ── Reseñas de Producto ──

export const useResenasProducto = (productoId: number | undefined) => {
  return useQuery({
    queryKey: ['resenas-producto', productoId],
    queryFn: () => getResenasProductoFn(productoId!),
    enabled: !!productoId,
    select: (data) => data.datos ?? [],
  });
};

export const useEstadisticasResenaProducto = (productoId: number | undefined) => {
  return useQuery({
    queryKey: ['estadisticas-resena-producto', productoId],
    queryFn: () => getEstadisticasResenaProductoFn(productoId!),
    enabled: !!productoId,
  });
};

export const useCrearResenaProducto = (productoId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { calificacion: number; comentario?: string; imagen?: File | null }) =>
      postCrearResenaProductoFn(productoId, data),
    onSuccess: () => {
      toast.success('¡Reseña enviada! Estará visible una vez aprobada.');
      queryClient.invalidateQueries({ queryKey: ['resenas-producto', productoId] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-resena-producto', productoId] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// ── Reseñas de Tienda ──

export const useResenasTienda = (tiendaId: number | undefined) => {
  return useQuery({
    queryKey: ['resenas-tienda', tiendaId],
    queryFn: () => getResenasTiendaFn(tiendaId!),
    enabled: !!tiendaId,
    select: (data) => data.datos ?? [],
  });
};

export const useEstadisticasResenaTienda = (tiendaId: number | undefined) => {
  return useQuery({
    queryKey: ['estadisticas-resena-tienda', tiendaId],
    queryFn: () => getEstadisticasResenaTiendaFn(tiendaId!),
    enabled: !!tiendaId,
  });
};

export const useCrearResenaTienda = (tiendaId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { calificacion: number; comentario?: string }) =>
      postCrearResenaTiendaFn(tiendaId, data),
    onSuccess: () => {
      toast.success('¡Reseña enviada! Estará visible una vez aprobada.');
      queryClient.invalidateQueries({ queryKey: ['resenas-tienda', tiendaId] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-resena-tienda', tiendaId] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(getErrorMessage(error));
    },
  });
};
