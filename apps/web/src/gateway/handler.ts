import {
  FriendRequest,
  Group,
  GroupDetail,
  GroupEvent,
  LoginPayload,
  Message,
  RawGroupDetail,
  RawGroupEvent,
  RawMemberClip,
  RawMessage,
  RawSelfUser,
  SelfUser,
  User,
  FriendRequestType,
  Relation,
  RelationShip,
  toIconUrl,
  toBannerUrl,
} from '@omagize/api';
import { client, Keys, addMessage, dispatchUser, addGroupEvent } from '@omagize/data-access-api';
import { useUserStore } from '@omagize/data-access-store';
import {
  GatewayMessage,
  OpCode,
  EventType,
  GroupAddedEvent,
  FriendRequestAddedEvent,
  FriendRequestRepliedEvent,
  FriendRemovedEvent,
  MessageRemovedEvent,
  GroupUpdatedEvent,
} from '@omagize/gateway';
import { InfiniteData } from '@tanstack/react-query';

export function handleEvent(message: GatewayMessage<unknown>) {
  if (message.op !== OpCode.Dispatch) return;

  switch (message.t) {
    case EventType.GroupUpdated: {
      onGroupUpdate(message as GatewayMessage<GroupUpdatedEvent>);
      break;
    }
    case EventType.GroupAdded: {
      onGroupAdded(message as GatewayMessage<GroupAddedEvent>);
      break;
    }
    case EventType.UserUpdated: {
      onUserUpdated(message as GatewayMessage<RawSelfUser>);
      break;
    }
    case EventType.GroupEventCreated: {
      onGroupEvent(message as GatewayMessage<RawGroupEvent>);
      break;
    }
    case EventType.GroupRemoved: {
      onGroupRemoved(message as GatewayMessage<RawMemberClip>);
      break;
    }
    case EventType.MessageCreated: {
      onReceiveMessage(message as GatewayMessage<RawMessage>);
      break;
    }
    case EventType.FriendRequestAdded: {
      onFriendRequestAdded(message as GatewayMessage<FriendRequestAddedEvent>);
      break;
    }
    case EventType.FriendRequestReplied: {
      onFriendRequestReplied(message as GatewayMessage<FriendRequestRepliedEvent>);
      break;
    }
    case EventType.FriendRemoved: {
      const event = (message as GatewayMessage<FriendRemovedEvent>).d;

      useUserStore.setState((prev) => ({
        relations: prev.relations.map((f) =>
          f.user.id === event.user ? { ...f, type: RelationShip.None } : f
        ),
      }));
      break;
    }
    case EventType.MessageUpdated: {
      const updated = Message((message as GatewayMessage<RawMessage>).d);

      client.setQueryData<InfiniteData<Message[]>>(
        Keys.messages(updated.channel),
        ({ pages, ...prev }) => {
          return {
            ...prev,
            pages: pages.map((page) =>
              page.map((message) => (message.id === updated.id ? updated : message))
            ),
          };
        }
      );
      break;
    }
    case EventType.MessageDeleted: {
      const payload = (message as GatewayMessage<MessageRemovedEvent>).d;

      client.setQueryData<InfiniteData<Message[]>>(
        Keys.messages(payload.channel),
        ({ pages, ...prev }) => {
          return {
            ...prev,
            pages: pages.map((page) => page.filter((message) => message.id !== payload.id)),
          };
        }
      );
      break;
    }
    default: {
      console.log(`Unknown event ${message.t}`);
    }
  }
}

function onFriendRequestAdded(event: GatewayMessage<FriendRequestAddedEvent>) {
  const self = client.getQueryData<LoginPayload>(Keys.login).user;
  const raw = event.d;
  const incoming = self.id !== raw.from.id;

  const request: FriendRequest = {
    user: new User(incoming ? raw.from : raw.to),
    message: event.d.message,
    type: incoming ? FriendRequestType.Incoming : FriendRequestType.Outgoing,
  };
  useUserStore.getState().addFriendRequest(request);
}

function onFriendRequestReplied(event: GatewayMessage<FriendRequestRepliedEvent>) {
  const data = event.d;

  useUserStore.setState((prev) => {
    let relations: Relation[] = prev.relations;

    if (data.relation != null) {
      //update or add new relation
      const update = relations.findIndex((r) => r.id === data.relation.id);

      if (update !== -1) {
        relations = [...relations];
        relations[update] = Relation(data.relation);
      } else {
        relations = [...relations, Relation(data.relation)];
      }
    }

    return {
      friendRequests: prev.friendRequests.filter((request) => {
        if (request.type === FriendRequestType.Incoming) {
          return request.user.id !== data.from;
        } else {
          return request.user.id !== data.to;
        }
      }),
      relations: relations,
    };
  });
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

function onGroupUpdate(event: GatewayMessage<GroupUpdatedEvent>) {
  const { group, ...raw } = event.d;
  const updated = {
    ...raw,
    iconUrl: toIconUrl(group, raw.iconHash),
    bannerUrl: toBannerUrl(group, raw.bannerHash),
  };

  const { groups, updateGroup } = useUserStore.getState();
  const prev = groups.find((g) => g.id === group);

  updateGroup({ ...prev, ...updated });
  client.setQueryData<GroupDetail>(Keys.groupDetail(group), (prev) => ({
    ...prev,
    ...updated,
  }));
}

function onGroupAdded(event: GatewayMessage<GroupAddedEvent>) {
  const group = Group(event.d.group);

  return useUserStore.getState().addGroup(group);
}

function onGroupRemoved(event: GatewayMessage<RawMemberClip>) {
  const clip = event.d;

  useUserStore.getState().removeGroup(clip.group);
}
