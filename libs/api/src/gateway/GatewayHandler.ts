import { QueryClient } from '@tanstack/react-query';
import { GroupDetail } from '../mappers';
import { RawGroupDetail } from './../GroupAPI';
import { GroupDetailKey } from './../GroupDetailKey';
import { GatewayEvent } from './Gateway';

export const GatewayCode = {
  Connected: 10,
  GroupUpdated: 20,
};

export function handleGateway(client: QueryClient, eventJson: string) {
  const event: GatewayEvent<unknown> = JSON.parse(eventJson);

  switch (event.op) {
    case GatewayCode.Connected:
      break;
    case GatewayCode.GroupUpdated: {
      onGroupUpdate(client, event as GatewayEvent<RawGroupDetail>);
      break;
    }
    default:
      console.log(`[Gateway] unknown op code ${event.op}`);
  }
}

function onGroupUpdate(
  client: QueryClient,
  event: GatewayEvent<RawGroupDetail>
) {
  const group = event.d;
  return client.setQueryData(GroupDetailKey(group.id), GroupDetail(group));
}
