import { api } from './apiBase';

export type TipoPopup = 'OFERTA' | 'NEWSLETTER' | 'INFO' | 'IMAGEN_CTA';
export type FrecuenciaPopup = 'SIEMPRE' | 'UNA_VEZ_SESION' | 'UNA_VEZ_DIA';

export interface PopupData {
  id: number;
  tipo: TipoPopup;
  activo: boolean;
  titulo: string;
  mensaje?: string;
  imagenUrl?: string;
  ctaTexto?: string;
  ctaUrl?: string;
  colorFondo?: string;
  delay: number;
  frecuencia: FrecuenciaPopup;
  codigoDesc?: string;
  porcentajeDesc?: number;
}

export const getPopupActivoFn = async (tiendaId: number): Promise<PopupData | null> => {
  const { data } = await api.get(`/tiendas/${tiendaId}/popup`);
  return data.datos;
};
