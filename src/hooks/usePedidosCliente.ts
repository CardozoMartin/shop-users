import { useQuery } from '@tanstack/react-query';
import { getMisPedidos } from '../api/pedidos.api';
import { useAuthSessionStore } from '../store/useAuthSession';

export const usePedidosCliente = () => {
  const cliente = useAuthSessionStore((s) => s.cliente);
  const token = useAuthSessionStore((s) => s.token);

  return useQuery({
    queryKey: ['mis-pedidos', cliente?.id],
    queryFn: () => getMisPedidos(),
    enabled: !!token && !!cliente?.id,
  });
};
