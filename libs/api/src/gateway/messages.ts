import { RawFriendRequest, RawUser } from './../UserAPI';
import { RawGroup } from '../GroupAPI';
import {
  Relation,
  FriendRequest,
  Group,
  Snowflake,
  RawRelation,
  Assets,
  RawAssets,
} from '../types';

export type GatewayMessage<T> = {
  op: OpCode;
  d: T;
  t?: EventType;
};

export enum OpCode {
  Identity = 0,
  Ready = 1,
  Dispatch = 3,
}

export enum EventType {
  GroupAdded = 'group_added',
  GroupRemoved = 'group_removed',
  GroupUpdated = 'group_updated',
  GroupEventCreated = 'group_event_created',
  UserUpdated = 'user_updated',
  MessageCreated = 'message_created',
  MessageUpdated = 'message_updated',
  MessageDeleted = 'message_deleted',
  FriendRequestAdded = 'friend_request_added',
  FriendRequestReplied = 'friend_request_replied',
  FriendRemoved = 'friend_removed',
}

type IdentityMessage = {
  token: string;
};
export function IdentityEvent(token: string): GatewayMessage<IdentityMessage> {
  return {
    op: OpCode.Identity,
    d: {
      token,
    },
  };
}

export type ReadyPayload = {
  relations: Relation[];
  groups: Group[];
  friendRequests: FriendRequest[];
  favorite_assets: Assets;
};
export type RawReadyPayload = {
  relations: RawRelation[];
  groups: RawGroup[];
  friendRequests: RawFriendRequest[];
  favorite_assets: RawAssets;
};
export function ReadyPayload(raw: RawReadyPayload): ReadyPayload {
  return {
    relations: raw.relations.map((f) => Relation(f)),
    groups: raw.groups.map((g) => Group(g)),
    friendRequests: raw.friendRequests.map((r) => FriendRequest(r)),
    favorite_assets: Assets(raw.favorite_assets),
  };
}

export type GroupAddedEvent = {
  group: RawGroup;
};

export type FriendRequestAddedEvent = {
  from: RawUser;
  to: RawUser;
  message?: string;
};

export enum FriendRequestReply {
  Accepted = 'accept',
  Deny = 'deny',
  Deleted = 'deleted',
}

export type FriendRequestRepliedEvent = {
  from: Snowflake;
  to: Snowflake;
  reply: FriendRequestReply;
  relation?: RawRelation;
};

export type FriendRemovedEvent = {
  user: Snowflake;
};

export type MessageRemovedEvent = {
  id: Snowflake;
  channel: Snowflake;
};
