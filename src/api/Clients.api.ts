import type { IClient } from "../types/clients.type";
import { api } from "./apiBase";


//funcion para registrar un cliente
export const postRegisterClientFn = async (data: IClient) => {
  const response = await api.post('/clientes/registro', data);
  return response.data;
};

//funcion para loguear un cliente
export const postLoginClienteFn = async (email: string, password: string, tiendaId: number) => {
  const response = await api.post('/clientes/login', { email, password, tiendaId });
  console.log('Respuesta del login:', response.data); // Log para verificar la respuesta del backend
  return response.data;
}
