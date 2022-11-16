import { User } from '@omagize/api';
import create from 'zustand';

export type PageStore = {
  dm?: User;
  setDM: (user: User | null) => void;
  sidebarIsOpen: boolean;
  setSidebarIsOpen: (v: boolean) => void;
};
export const usePageStore = create<PageStore>((set) => ({
  sidebarIsOpen: false,
  setSidebarIsOpen: (v) => set({ sidebarIsOpen: v }),
  setDM: (user) =>
    set({
      dm: user,
    }),
}));
