import { useQuery } from "@tanstack/react-query";
import { getPublicShopFn, listarTiendasPublicasFn } from "../api/shop.api";
import type { FiltrosTiendas } from "../api/shop.api";

export const usePublicShop = (slug: string) => {
  return useQuery({
    queryKey: ['publicShop', slug],
    queryFn: () => getPublicShopFn(slug),
    enabled: !!slug,
  });
};

export const useListarTiendas = (filtros?: FiltrosTiendas) => {
  return useQuery({
    queryKey: ['tiendas', filtros],
    queryFn: () => listarTiendasPublicasFn(filtros),
    staleTime: 1000 * 60 * 2, // 2 minutos de cache
  });
};
