import { Group, GroupDetail, GroupEvent, SelfUser } from '../mappers';
import {
  addGroup,
  addGroupEvent,
  dispatchGroupDetail,
  dispatchUser,
  removeGroup,
} from '../query';
import { RawSelfUser } from '../UserAPI';
import {
  RawGroup,
  RawGroupDetail,
  RawGroupEvent,
  RawMemberClip,
} from './../GroupAPI';
import { GatewayEvent } from './Gateway';

export const GatewayCode = {
  Connected: 10,
  GroupUpdated: 20,
  UserUpdated: 12,
  GroupEvent: 21,
  GroupRemoved: 22,

  /**
   * When user join a group
   */
  GroupAdded: 19,
};

export enum EventType {
  Added = 'add',
  Updated = 'update',
  Removed = 'remove',
}

export function handleGateway(eventJson: string) {
  const event: GatewayEvent<unknown> = JSON.parse(eventJson);

  switch (event.op) {
    case GatewayCode.Connected:
      break;
    case GatewayCode.GroupUpdated: {
      onGroupUpdate(event as GatewayEvent<RawGroupDetail>);
      break;
    }
    case GatewayCode.GroupAdded: {
      onGroupAdded(event as GatewayEvent<RawGroupDetail>);
      break;
    }
    case GatewayCode.UserUpdated: {
      onUserUpdated(event as GatewayEvent<RawSelfUser>);
      break;
    }
    case GatewayCode.GroupEvent: {
      onGroupEvent(event as GatewayEvent<RawGroupEvent>);
      break;
    }
    case GatewayCode.GroupRemoved: {
      onGroupRemoved(event as GatewayEvent<RawMemberClip>);
      break;
    }
    default:
      console.log(`[Gateway] unknown op code ${event.op}`);
  }
}

function onUserUpdated(event: GatewayEvent<RawSelfUser>) {
  const user = new SelfUser(event.d);

  return dispatchUser(user);
}

function onGroupEvent(event: GatewayEvent<RawGroupEvent>) {
  switch (event.type) {
    case EventType.Added: {
      addGroupEvent(GroupEvent(event.d));
      break;
    }
  }
}

function onGroupUpdate(event: GatewayEvent<RawGroupDetail>) {
  const updated = GroupDetail(event.d);

  return dispatchGroupDetail(updated);
}

function onGroupAdded(event: GatewayEvent<RawGroup>) {
  const updated = Group(event.d);

  return addGroup(updated);
}
function onGroupRemoved(event: GatewayEvent<RawMemberClip>) {
  const clip = event.d;
  removeGroup(clip.group);
}
