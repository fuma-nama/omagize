import { User } from '@omagize/api';
import create from 'zustand';

export type NavbarInfo = {
  title: string;
};
export type PageStore = {
  navbar: NavbarInfo | null;
  updateNavbar: (info: NavbarInfo) => void;
  dm?: User;
  setDM: (user: User | null) => void;
};
export const usePageStore = create<PageStore>((set) => ({
  navbar: null,
  updateNavbar: (info) =>
    set({
      navbar: info,
    }),
  setDM: (user) =>
    set({
      dm: user,
    }),
}));
