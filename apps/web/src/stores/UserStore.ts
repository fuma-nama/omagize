import {
  Relation,
  FriendRequest,
  Group,
  LoginPayload,
  ReadyPayload,
  SelfUser,
  Snowflake,
} from '@omagize/api';
import create from 'zustand';
import { Reset, withReset } from './utils';

export type UserStore = {
  groups: Group[] | null;
  relations: Relation[] | null;
  user: SelfUser | null;
  friendRequests: FriendRequest[] | null;
  updateUser: (payload: LoginPayload) => void;
  acceptPayload: (payload: ReadyPayload) => void;
  addGroup: (group: Group) => void;
  updateGroup: (group: Group) => void;
  removeGroup: (group: Snowflake) => void;
  addFriendRequest: (request: FriendRequest) => void;
};

export const useUserStore = create<Reset<UserStore>>((set, get) =>
  withReset(
    {
      relations: null,
      friendRequests: null,
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
          friendRequests: payload.friendRequests,
          relations: payload.relations,
          groups: payload.groups,
        }),
      addFriendRequest: (friend: FriendRequest) =>
        set((g) => ({
          friendRequests: [...g.friendRequests, friend],
        })),
    },
    (initial) => set((prev) => ({ ...initial, reset: prev.reset }), true)
  )
);
