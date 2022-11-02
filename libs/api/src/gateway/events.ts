import { RawGroup } from '../GroupAPI';
export type GatewayEvent<T> = {
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
export function IdentityEvent(token: string): GatewayEvent<IdentityMessage> {
  return {
    op: OpCode.Identity,
    d: {
      token,
    },
  };
}

export type GroupAddedEvent = {
  group: RawGroup;
};
