import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  actualizarCantidadFn,
  agregarAlCarritoFn,
  eliminarDelCarritoFn,
  fetchCarritoFn,
  vaciarCarritoFn,
} from '../api/carrito.api';

const CARRITO_KEY = 'carrito';

export const useCarrito = (tiendaId: number) => {
  const queryClient = useQueryClient();
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Recuperar o generar sessionId en localStorage cuando se monte el hook
    // Solo ocurre en el cliente
    if (typeof window !== 'undefined') {
      let currentSessionId = localStorage.getItem('cz_session_id') as string | null;
      if (!currentSessionId) {
        currentSessionId = crypto.randomUUID();
        localStorage.setItem('cz_session_id', currentSessionId);
      }
      setSessionId(currentSessionId);
    }
  }, []);

  // QUERY: Obtener el carrito actual
  const carritoQuery = useQuery({
    queryKey: [CARRITO_KEY, tiendaId, sessionId],
    queryFn: () => fetchCarritoFn(tiendaId, sessionId),
    enabled: !!tiendaId && !!sessionId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // MUTATION: Agregar producto
  const agregarMutation = useMutation({
    mutationFn: (data: { productoId: number; varianteId?: number | null; cantidad: number }) => {
      return agregarAlCarritoFn({ ...data, tiendaId, sessionId });
    },
    onSuccess: (nuevoCarrito) => {
      queryClient.setQueryData([CARRITO_KEY, tiendaId, sessionId], nuevoCarrito);
    },
  });

  // MUTATION: Actualizar cantidad
  const actualizarCantidadMutation = useMutation({
    mutationFn: (data: { itemId: number; cantidad: number }) => {
      return actualizarCantidadFn({ ...data, tiendaId, sessionId });
    },
    onSuccess: (nuevoCarrito) => {
      queryClient.setQueryData([CARRITO_KEY, tiendaId, sessionId], nuevoCarrito);
    },
  });

  // MUTATION: Eliminar item
  const eliminarItemMutation = useMutation({
    mutationFn: (itemId: number) => {
      return eliminarDelCarritoFn({ tiendaId, sessionId, itemId });
    },
    onSuccess: (nuevoCarrito) => {
      queryClient.setQueryData([CARRITO_KEY, tiendaId, sessionId], nuevoCarrito);
    },
  });

  // MUTATION: Vaciar carrito completo
  const vaciarCarritoMutation = useMutation({
    mutationFn: () => {
      return vaciarCarritoFn(tiendaId, sessionId);
    },
    onSuccess: (nuevoCarrito) => {
      queryClient.setQueryData([CARRITO_KEY, tiendaId, sessionId], nuevoCarrito);
    },
  });

  return {
    carrito: carritoQuery.data,
    isLoading: carritoQuery.isLoading,
    sessionId,
    agregarAlCarrito: agregarMutation.mutateAsync,
    isAgregando: agregarMutation.isPending,
    actualizarCantidad: actualizarCantidadMutation.mutateAsync,
    isActualizando: actualizarCantidadMutation.isPending,
    eliminarItem: eliminarItemMutation.mutateAsync,
    isEliminando: eliminarItemMutation.isPending,
    vaciarCarrito: vaciarCarritoMutation.mutateAsync,
    isVaciando: vaciarCarritoMutation.isPending,
  };
};
