import { useUserStore } from 'stores/UserStore';
import {
  addGroupEvent,
  addMessage,
  client,
  dispatchUser,
  EventType,
  GatewayMessage,
  Group,
  GroupAddedEvent,
  GroupDetail,
  GroupEvent,
  Keys,
  Message,
  OpCode,
  RawGroupDetail,
  RawGroupEvent,
  RawMemberClip,
  RawMessage,
  RawSelfUser,
  SelfUser,
} from '@omagize/api';

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

  useUserStore.getState().updateGroup(updated);

  client.setQueryData<GroupDetail>(Keys.groupDetail(updated.id), updated);
}

function onGroupAdded(event: GatewayMessage<GroupAddedEvent>) {
  const group = Group(event.d.group);

  return useUserStore.getState().addGroup(group);
}

function onGroupRemoved(event: GatewayMessage<RawMemberClip>) {
  const clip = event.d;

  useUserStore.getState().removeGroup(clip.group);
}
