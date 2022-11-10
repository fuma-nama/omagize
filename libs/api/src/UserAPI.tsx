import { delay } from './model';
import { Reset } from './AccountAPI';
import { DateObject, Snowflake } from './types/common';
import { callReturn } from './utils/core';
import { toFormData } from './utils/common';
import { SelfUser } from './types/account';
import { GroupEvent } from './types/group';
import { RawGroupEvent } from './GroupAPI';
import { User } from './types';

export type RawUser = {
  id: Snowflake;
  username: string;
  bannerHash?: number;
  avatarHash?: number;
  description?: string;
  createdAt: DateObject;
};

export type RawFriend = {
  user: RawUser;
  channel: Snowflake;
};
export type RawFriendRequest = {
  user: RawUser;
  message?: string;
};

export type RawSelfUser = RawUser;

export async function updateProfile(
  name?: string,
  avatar?: Blob | Reset,
  banner?: Blob | Reset
): Promise<SelfUser> {
  const data = toFormData({
    name: name,
    avatar: avatar,
    banner: banner,
  });

  return callReturn<RawSelfUser>('/user/profile', {
    method: 'POST',
    body: data,
  }).then((res) => new SelfUser(res));
}

export function fetchGroupEvents(): Promise<GroupEvent[]> {
  return callReturn<RawGroupEvent[]>('/user/events', {
    method: 'GET',
  }).then((res) => res.map((event) => GroupEvent(event)));
}
export function fetchUserInfo(id: Snowflake) {
  return callReturn<User>(`/users/${id}`, {
    method: 'GET',
  });
}

export async function sendFriendRequest(friendID: string) {
  if (friendID === '000000') throw new Error("Friend ID doesn't exist");
  await delay(2000);
}

export async function acceptFriendRequest(friendID: string) {
  await delay(2000);
}

export async function denyFriendRequest(friendID: string) {
  await delay(2000);
}
