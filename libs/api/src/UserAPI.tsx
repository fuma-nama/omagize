import { delay, users } from './model';
import { Reset } from './AccountAPI';
import { DateObject, Snowflake } from './types/common';
import { callReturn } from './utils/core';
import { toFormData } from './utils/common';
import { SelfUser } from './types/account';
import { FriendsData } from './types/Friend';
import { GroupEvent } from './types/group';
import { RawGroupEvent } from './GroupAPI';

export type RawUser = {
  id: Snowflake;
  username: string;
  bannerHash?: number;
  avatarHash?: number;
  description?: string;
  createdAt: DateObject;
};

export type RawFriend = RawUser;
export type RawFriendRequest = {
  user: RawUser;
  message?: string;
};

export type RawFriendsData = {
  friends: RawFriend[];
  requests: RawFriendRequest[];
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

export function fetchFriends(): FriendsData {
  return new FriendsData({
    friends: [...users],
    requests: [
      {
        user: users[0],
        message: 'I seen you in Gay Party',
      },
    ],
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
