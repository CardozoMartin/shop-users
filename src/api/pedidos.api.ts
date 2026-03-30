import { api } from './apiBase';

export const createPedido = async (tiendaId: number, sessionId: string, data: any) => {
  const response = await api.post(`/tiendas/${tiendaId}/pedidos`, data, {
    headers: {
      'x-session-id': sessionId,
    },
  });
  return response.data;
};

export const getMisPedidos = async (clienteId: number) => {
  const response = await api.get(`/pedidos`, {
    params: { clienteId }
  });
  return response.data;
};
