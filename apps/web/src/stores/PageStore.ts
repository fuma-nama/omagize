import { User } from '@omagize/api';
import create from 'zustand';

export type PageStore = {
  dm?: User;
  setDM: (user: User | null) => void;
};
export const usePageStore = create<PageStore>((set) => ({
  setDM: (user) =>
    set({
      dm: user,
    }),
}));
