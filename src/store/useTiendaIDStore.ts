import { create } from "zustand";


//vamos a crear un store para guardar el id de la tienda seleccionada
interface TiendaIDState {
  tiendaId: number | null;
  setTiendaId: (id: number) => void;
}

export const useTiendaIDStore = create<TiendaIDState>((set) => ({
  tiendaId: null,
  setTiendaId: (id: number) => set({ tiendaId: id }),
}));
