import { api } from "./apiBase";

export const getPublicShopFn = async (slug: string) => {
  const { data } = await api.get(`/tiendas/${slug}/`);
  return data.datos;
};
