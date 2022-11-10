import { LoginPayload } from './../../../../libs/api/src/types/account';
import { Friend, Group, ReadyPayload, SelfUser } from '@omagize/api';
import create from 'zustand';

export type UserStore = {
  groups: Group[] | null;
  friends: Friend[] | null;
  user: SelfUser | null;
  updateUser: (payload: LoginPayload) => void;
  acceptPayload: (payload: ReadyPayload) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  friends: null,
  groups: null,
  user: null,
  updateUser: (payload) =>
    set({
      user: payload.user,
    }),
  acceptPayload: (payload) =>
    set({
      friends: payload.friends,
      groups: payload.groups,
    }),
}));
