import { api } from './apiBase';

export interface PreferenciaMpResponse {
  preferenceId: string;
  initPoint: string;        // URL de producción
  sandboxInitPoint: string; // URL de sandbox/testing
}

export const postCrearPreferenciaMpFn = async (
  tiendaId: number,
  pedidoId: number
): Promise<PreferenciaMpResponse> => {
  const { data } = await api.post(`/tiendas/${tiendaId}/pedidos/${pedidoId}/pagar`);
  return data.datos;
};
