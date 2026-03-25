import { create } from 'zustand';


//aqui vamos a manejar el estado de la sesion del usuario, el token y el logout
interface AuthSessionState {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthSessionStore = create<AuthSessionState>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
  logout: () => set({ token: null }),
}));


