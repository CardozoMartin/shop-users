import { api } from "./apiBase";

export const getPublicShopFn = async (slug: string) => {
  const { data } = await api.get(`/tiendas/${slug}/`);
  return data.datos;
};

export interface FiltrosTiendas {
  pagina?: number;
  limite?: number;
  busqueda?: string;
  ciudad?: string;
  provincia?: string;
  orden?: 'nombre' | 'vistas' | 'creadoEn';
  direccion?: 'asc' | 'desc';
}

export const listarTiendasPublicasFn = async (filtros?: FiltrosTiendas) => {
  const { data } = await api.get('/tiendas/', { params: filtros });
  return data;
};
