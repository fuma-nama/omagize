import { RawFriend, RawFriendRequest } from '../UserAPI';
import { Snowflake } from './common';
import { User } from './user';

export class FriendRequest {
  user: User;
  message?: string;

  constructor(raw: RawFriendRequest) {
    this.user = new User(raw.user);
    this.message = raw.message;
  }
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
