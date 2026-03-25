import { useQuery } from "@tanstack/react-query";
import { getPublicShopFn } from "../api/shop.api";



export const usePublicShop = (slug: string) => {
  return useQuery({
    queryKey: ['publicShop', slug],
    queryFn: () => getPublicShopFn(slug),
    enabled: !!slug,
  });
};
