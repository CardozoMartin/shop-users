import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Datos del cliente autenticado
export interface IAuthCliente {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  emailVerificado: boolean;
}

// Estado de la sesión del usuario (cliente)
interface AuthSessionState {
  token: string | null;
  cliente: IAuthCliente | null;
  setToken: (token: string | null) => void;
  setCliente: (cliente: IAuthCliente | null) => void;
  logout: () => void;
}

export const useAuthSessionStore = create<AuthSessionState>()(
  persist(
    (set) => ({
      token: null,
      cliente: null,
      setToken: (token) => set({ token }),
      setCliente: (cliente) => set({ cliente }),
      logout: () => set({ token: null, cliente: null }),
    }),
    {
      name: 'auth-session-storage',
    }
  )
);


