import { Group, GroupDetail } from '../mappers';
import { addGroup, dispatchGroupDetail } from '../query';
import { RawGroup, RawGroupDetail } from './../GroupAPI';
import { GatewayEvent } from './Gateway';

export const GatewayCode = {
  Connected: 10,
  GroupUpdated: 20,
  UserUpdated: 12,
  GroupEvent: 21,

  /**
   * When user join a group
   */
  GroupAdded: 19,
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
    default:
      console.log(`[Gateway] unknown op code ${event.op}`);
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
