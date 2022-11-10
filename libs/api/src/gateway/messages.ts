import { RawFriend } from '../UserAPI';
import { RawGroup } from '../GroupAPI';
import { Friend, Group } from '../types';
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
  friends: Friend[];
  groups: Group[];
};
export type RawReadyPayload = {
  friends: RawFriend[];
  groups: RawGroup[];
};
export function ReadyPayload(raw: RawReadyPayload): ReadyPayload {
  return {
    friends: raw.friends.map((f) => Friend(f)),
    groups: raw.groups.map((g) => Group(g)),
  };
}

export type GroupAddedEvent = {
  group: RawGroup;
};