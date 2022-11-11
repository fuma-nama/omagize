import { RawFriend, RawFriendRequest } from '../UserAPI';
import { Snowflake } from './common';
import { User } from './user';

export type FriendRequest = {
  user: User;
  message?: string;
  type: FriendRequestType;
};

export function FriendRequest(raw: RawFriendRequest): FriendRequest {
  return {
    ...raw,
    user: new User(raw.user),
    type: raw.type as FriendRequestType,
  };
}

export type Friend = {
  user: User;
  channel: Snowflake;
};
export function Friend(raw: RawFriend): Friend {
  return {
    ...raw,
    user: new User(raw.user),
  };
}

export enum FriendRequestType {
  Incoming = 'incoming',
  Outgoing = 'outgoing',
}
