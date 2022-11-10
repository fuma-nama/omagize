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
import { EventType, GatewayMessage, OpCode, GroupAddedEvent } from './messages';

export function handleEvent(event: GatewayMessage<unknown>) {
  if (event.op !== OpCode.Dispatch) return;

  switch (event.t) {
    case EventType.GroupUpdated: {
      onGroupUpdate(event as GatewayMessage<RawGroupDetail>);
      break;
    }
    case EventType.GroupAdded: {
      onGroupAdded(event as GatewayMessage<GroupAddedEvent>);
      break;
    }
    case EventType.UserUpdated: {
      onUserUpdated(event as GatewayMessage<RawSelfUser>);
      break;
    }
    case EventType.GroupEventCreated: {
      onGroupEvent(event as GatewayMessage<RawGroupEvent>);
      break;
    }
    case EventType.GroupRemoved: {
      onGroupRemoved(event as GatewayMessage<RawMemberClip>);
      break;
    }
    case EventType.MessageCreated: {
      onReceiveMessage(event as GatewayMessage<RawMessage>);
      break;
    }
    default: {
      console.log(`Unknown event ${event.t}`);
    }
  }
}

function onReceiveMessage(event: GatewayMessage<RawMessage>) {
  const message = Message(event.d);

  return addMessage(message);
}

function onUserUpdated(event: GatewayMessage<RawSelfUser>) {
  const user = new SelfUser(event.d);

  return dispatchUser(user);
}

function onGroupEvent(event: GatewayMessage<RawGroupEvent>) {
  const e = GroupEvent(event.d);

  return addGroupEvent(e);
}

function onGroupUpdate(event: GatewayMessage<RawGroupDetail>) {
  const updated = GroupDetail(event.d);

  return dispatchGroupDetail(updated);
}

function onGroupAdded(event: GatewayMessage<GroupAddedEvent>) {
  const updated = Group(event.d.group);

  return addGroup(updated);
}

function onGroupRemoved(event: GatewayMessage<RawMemberClip>) {
  const clip = event.d;
  removeGroup(clip.group);
}
