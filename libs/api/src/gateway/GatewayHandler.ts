import { GroupDetail } from '../mappers';
import { dispatchGroupDetail } from '../query';
import { RawGroupDetail } from './../GroupAPI';
import { GatewayEvent } from './Gateway';

export const GatewayCode = {
  Connected: 10,
  GroupUpdated: 20,
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
    default:
      console.log(`[Gateway] unknown op code ${event.op}`);
  }
}

function onGroupUpdate(event: GatewayEvent<RawGroupDetail>) {
  const updated = GroupDetail(event.d);

  return dispatchGroupDetail(updated);
}
