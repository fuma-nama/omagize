import { delay, users } from './model';
import { Reset } from './AccountAPI';
import { DateObject, Snowflake } from './mappers/types';
import { callReturn, withDefault, withDefaultForm } from './utils/core';
import { SelfUser } from './mappers/Auth';
import { FriendsData } from './mappers/Friend';
import { GroupEvent } from './mappers/GroupEvents';
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
  const data = new FormData();
  if (name != null) {
    data.append('name', name);
  }
  if (avatar != null) {
    data.append('avatar', avatar);
  }
  if (banner != null) {
    data.append('banner', banner);
  }

  return callReturn<RawSelfUser>(
    '/user/profile',
    withDefaultForm({
      method: 'POST',
      body: data,
    })
  ).then((res) => new SelfUser(res));
}

export function fetchGroupEvents(): Promise<GroupEvent[]> {
  return callReturn<RawGroupEvent[]>(
    '/user/events',
    withDefault({
      method: 'GET',
    })
  ).then((res) => res.map((event) => GroupEvent(event)));
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
