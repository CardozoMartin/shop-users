import { api } from './apiBase';

/**
 * Obtiene los productos destacados de una tienda de forma pública.
 */
export const getStorefrontDestacadosFn = async (
  tiendaId: number,
  filtros?: { categoriaId?: number; busqueda?: string; page?: number; limit?: number }
) => {
  const { data } = await api.get(`/tiendas/${tiendaId}/productos/destacados`, {
    params: filtros,
  });
  return data.datos;
};

/**
 * Obtiene los productos normales (no destacados) de una tienda de forma pública.
 */
export const getStorefrontNormalesFn = async (
  tiendaId: number,
  filtros?: { categoriaId?: number; busqueda?: string; page?: number; limit?: number }
) => {
  const { data } = await api.get(`/tiendas/${tiendaId}/productos/normales`, {
    params: filtros,
  });
  return data.datos;
};

/**
 * Obtiene todos los productos públicos de una tienda.
 */
export const getStorefrontProductosFn = async (
  tiendaId: number,
  filtros?: { categoriaId?: number; busqueda?: string; page?: number; limit?: number }
) => {
  const { data } = await api.get(`/tiendas/${tiendaId}/productos`, {
    params: filtros,
  });
  return data.datos;
};

/**
 * Obtiene las categorías públicas (que poseen productos activos) de la tienda.
 */
export const getStorefrontCategoriasFn = async (tiendaId: number) => {
  const { data } = await api.get(`/tiendas/${tiendaId}/productos/categorias`);
  return data.datos;
};
