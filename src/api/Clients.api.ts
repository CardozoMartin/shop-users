import type { IClient } from "../types/clients.type";
import { api } from "./apiBase";


//funcion para registrar un cliente
export const postRegisterClientFn = async (data: IClient) => {
  const response = await api.post('/clientes/registro', data);
  return response.data;
};

export const postLoginClienteFn = async (email: string, password: string, tiendaId: number) => {
  const response = await api.post('/clientes/login', { email, password, tiendaId });
  return response.data;
}

export const getPerfilClienteFn = async () => {
  const response = await api.get('/clientes/perfil');
  return response.data.datos;
};

export const postOlvidePasswordClienteFn = async (email: string, tiendaId: number) => {
  const response = await api.post('/clientes/olvide-password', { email, tiendaId });
  return response.data;
};

export const postResetPasswordClienteFn = async (data: any) => {
  const response = await api.post('/clientes/reset-password', data);
  return response.data;
};

export const getVerificarEmailClienteFn = async (token: string) => {
  const response = await api.get(`/clientes/verificar-email/${token}`);
  return response.data;
};

// ── Reseñas de Tienda ──

export const getResenasTiendaFn = async (tiendaId: number) => {
  const response = await api.get(`/tiendas/${tiendaId}/resenas?soloAprobadas=true&limite=20`);
  return response.data;
};

export const getEstadisticasResenaTiendaFn = async (tiendaId: number) => {
  const response = await api.get(`/tiendas/${tiendaId}/resenas/estadisticas`);
  return response.data.datos;
};

export const postCrearResenaTiendaFn = async (
  tiendaId: number,
  data: { calificacion: number; comentario?: string }
) => {
  const response = await api.post(`/tiendas/${tiendaId}/resenas`, data);
  return response.data;
};

// ── Reseñas de Producto ──

export const getResenasProductoFn = async (productoId: number) => {
  const response = await api.get(`/mis-productos/${productoId}/resenas?soloAprobadas=true&limite=20`);
  return response.data;
};

export const getEstadisticasResenaProductoFn = async (productoId: number) => {
  const response = await api.get(`/mis-productos/${productoId}/resenas/estadisticas`);
  return response.data.datos;
};

export const postCrearResenaProductoFn = async (
  productoId: number,
  data: { calificacion: number; comentario?: string; imagen?: File | null }
) => {
  // Usamos FormData para soportar imagen opcional
  const formData = new FormData();
  formData.append('calificacion', String(data.calificacion));
  if (data.comentario) formData.append('comentario', data.comentario);
  if (data.imagen) formData.append('imagen', data.imagen);

  const response = await api.post(`/mis-productos/${productoId}/resenas`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
