import { api } from './apiBase';

// Interfaz que puede coincidir con lo que devuelve el backend
export interface CarritoItem {
  id: number;
  cantidad: number;
  precioUnit: number | string;
  subtotal: number | string;
  producto: any;
  variante: any | null;
}

export interface CarritoResponse {
  id: number;
  sessionId: string;
  clienteId: number | null;
  items: CarritoItem[];
  total: number | string;
  cantidad: number;
}

export const fetchCarritoFn = async (tiendaId: number, sessionId: string): Promise<CarritoResponse> => {
  const rs = await api.get(`/carrito/${tiendaId}/${sessionId}`);
  return rs.data.datos;
};

export const agregarAlCarritoFn = async (data: {
  tiendaId: number;
  sessionId: string;
  productoId: number;
  varianteId?: number | null;
  cantidad: number;
}): Promise<CarritoResponse> => {
  const rs = await api.post('/carrito/items', data, {
    headers: { 'x-session-id': data.sessionId }
  });
  return rs.data.datos;
};

export const actualizarCantidadFn = async (data: {
  tiendaId: number;
  sessionId: string;
  itemId: number;
  cantidad: number;
}): Promise<CarritoResponse> => {
  const rs = await api.put('/carrito/items', data, {
    headers: { 'x-session-id': data.sessionId }
  });
  return rs.data.datos;
};

export const eliminarDelCarritoFn = async (data: {
  tiendaId: number;
  sessionId: string;
  itemId: number;
}): Promise<CarritoResponse> => {
  const rs = await api.delete(`/carrito/items/${data.itemId}`, {
    headers: { 'x-session-id': data.sessionId },
    data: { tiendaId: data.tiendaId, sessionId: data.sessionId }
  });
  return rs.data.datos;
};

export const vaciarCarritoFn = async (tiendaId: number, sessionId: string): Promise<CarritoResponse> => {
  const rs = await api.delete(`/carrito/${tiendaId}/${sessionId}`);
  return rs.data.datos;
};
