import { api } from './apiBase';

export const createPedido = async (tiendaId: number, sessionId: string, data: any) => {
  const response = await api.post(`/tiendas/${tiendaId}/pedidos`, data, {
    headers: {
      'x-session-id': sessionId,
    },
  });
  return response.data;
};

/**
 * Obtiene los pedidos del cliente autenticado.
 * Usa el JWT de cliente (tipo: 'cliente') en el interceptor de apiBase.
 * El endpoint GET /clientes/mis-pedidos filtra automáticamente por el clienteId del token.
 */
export const getMisPedidos = async (params: any = {}) => {
  const response = await api.get('/clientes/mis-pedidos', { params });
  // La API responde con { ok, datos: { datos: [], total, ... }, mensaje }
  return response.data?.datos?.datos ?? response.data?.datos ?? [];
};
