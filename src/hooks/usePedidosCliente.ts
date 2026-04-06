import { useQuery } from '@tanstack/react-query';
import { getMisPedidos } from '../api/pedidos.api';
import { useAuthSessionStore } from '../store/useAuthSession';

export const usePedidosCliente = (tiendaId: number) => {
  const cliente = useAuthSessionStore((s) => s.cliente);
  const token = useAuthSessionStore((s) => s.token);

  return useQuery({
    queryKey: ['mis-pedidos', tiendaId, cliente?.id],
    queryFn: () => getMisPedidos(cliente?.id!),
    enabled: !!token && !!cliente?.id && !!tiendaId,
  });
};
