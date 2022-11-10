import {
  Friend,
  Group,
  LoginPayload,
  ReadyPayload,
  SelfUser,
  Snowflake,
} from '@omagize/api';
import create from 'zustand';

export type UserStore = {
  groups: Group[] | null;
  friends: Friend[] | null;
  user: SelfUser | null;
  updateUser: (payload: LoginPayload) => void;
  acceptPayload: (payload: ReadyPayload) => void;
  addGroup: (group: Group) => void;
  updateGroup: (group: Group) => void;
  removeGroup: (group: Snowflake) => void;
};

export const useUserStore = create<UserStore>((set, get) => ({
  friends: null,
  groups: null,
  user: null,
  addGroup: (group) => {
    const groups = get().groups;
    const contains = groups.some((g) => g.id === group.id);

    set({
      groups: contains ? groups : [...groups, group],
    });
  },
  updateGroup: (group) =>
    set({
      groups: get().groups?.map((g) => (g.id === group.id ? group : g)),
    }),
  removeGroup: (group) =>
    set({
      groups: get().groups.filter((g) => g.id !== group),
    }),
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
