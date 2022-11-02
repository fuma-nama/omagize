import { Group, GroupDetail, GroupEvent, SelfUser } from '../types';
import { Message } from '../types/message';
import { RawMessage } from '../MessageAPI';
import {
  addGroup,
  addGroupEvent,
  addMessage,
  dispatchGroupDetail,
  dispatchUser,
  removeGroup,
} from '../query';
import { RawSelfUser } from '../UserAPI';
import { RawGroupDetail, RawGroupEvent, RawMemberClip } from './../GroupAPI';
import { EventType, GatewayEvent, OpCode, GroupAddedEvent } from './events';

export function handleGateway(event: GatewayEvent<unknown>) {
  if (event.op !== OpCode.Dispatch) return;

  switch (event.t) {
    case EventType.GroupUpdated: {
      onGroupUpdate(event as GatewayEvent<RawGroupDetail>);
      break;
    }
    case EventType.GroupAdded: {
      onGroupAdded(event as GatewayEvent<GroupAddedEvent>);
      break;
    }
    case EventType.UserUpdated: {
      onUserUpdated(event as GatewayEvent<RawSelfUser>);
      break;
    }
    case EventType.GroupEventCreated: {
      onGroupEvent(event as GatewayEvent<RawGroupEvent>);
      break;
    }
    case EventType.GroupRemoved: {
      onGroupRemoved(event as GatewayEvent<RawMemberClip>);
      break;
    }
    case EventType.MessageCreated: {
      onReceiveMessage(event as GatewayEvent<RawMessage>);
      break;
    }
    default: {
      console.log(`Unknown event ${event.t}`);
    }
  }
}

function onReceiveMessage(event: GatewayEvent<RawMessage>) {
  const message = Message(event.d);

  return addMessage(message);
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

function onGroupAdded(event: GatewayEvent<GroupAddedEvent>) {
  const updated = Group(event.d.group);

  return addGroup(updated);
}

function onGroupRemoved(event: GatewayEvent<RawMemberClip>) {
  const clip = event.d;
  removeGroup(clip.group);
}
