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
  //10*: Basic
  Connected: 100,

  //20x: Account, User
  UserUpdated: 200,

  //30x: Group
  GroupAdded: 301,
  GroupUpdated: 302,
  GroupRemoved: 303,

  //31x: GroupEvent
  GroupEventAdded: 311,
};

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
    case GatewayCode.GroupEventAdded: {
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
  const e = GroupEvent(event.d);

  return addGroupEvent(e);
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
