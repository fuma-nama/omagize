import { RawFriendRequest, RawUser } from '../UserAPI';
import { Snowflake } from './common';
import { Channel, RawChannel } from './message';
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

export type RawRelation = {
  id: Snowflake;
  user: RawUser;
  channel?: RawChannel;
  type: RelationShip;
};

export type Relation = {
  id: Snowflake;
  user: User;
  channel?: Channel;
  type: RelationShip;
};

export enum RelationShip {
  None = 'none',
  Friend = 'friend',
}

export function Relation(raw: RawRelation): Relation {
  return {
    ...raw,
    user: new User(raw.user),
    channel: raw.channel != null ? Channel(raw.channel) : null,
  };
}

export enum FriendRequestType {
  Incoming = 'incoming',
  Outgoing = 'outgoing',
}
