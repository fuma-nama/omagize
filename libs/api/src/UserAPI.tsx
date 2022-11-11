import { Reset } from './AccountAPI';
import { DateObject, Snowflake } from './types/common';
import { callDefault, callReturn } from './utils/core';
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
  type: string;
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

export async function sendFriendRequest(friendID: string, message?: string) {
  await callDefault(`/user/friends/requests`, {
    method: 'POST',
    body: JSON.stringify({
      user: friendID,
      message,
    }),
  });
}

export async function replyFriendRequest(
  friendID: string,
  reply: 'accept' | 'deny'
) {
  await callDefault(`/user/friends/requests`, {
    method: 'PATCH',
    body: JSON.stringify({
      user: friendID,
      accept: reply === 'accept',
    }),
  });
}

export async function deleteFriendRequest(friendID: Snowflake) {
  await callDefault(`/user/friends/requests/${friendID}`, {
    method: 'DELETE',
  });
}
