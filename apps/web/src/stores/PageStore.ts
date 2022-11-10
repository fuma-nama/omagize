import create from 'zustand';

export type NavbarInfo = {
  title: string;
};
export type PageStore = {
  navbar: NavbarInfo | null;
  updateNavbar: (info: NavbarInfo) => void;
};
export const usePageStore = create<PageStore>((set) => ({
  navbar: null,
  updateNavbar: (info) =>
    set({
      navbar: info,
    }),
}));
