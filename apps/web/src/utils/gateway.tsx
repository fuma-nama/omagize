import { HStack, Slide, Text } from '@chakra-ui/react';
import {
  GatewayStatus,
  Keys,
  startGateway,
  useGatewayStatus,
  useLoginQuery,
} from '@omagize/api';
import { useQuery } from '@tanstack/react-query';
import { Auth } from 'firebase/auth';
import ReconnectingWebSocket from 'reconnecting-websocket';

export function WebsocketConnect() {
  useGatewayQuery();
  const query = useGatewayStatus();
  const failed = query.isSuccess && query?.data === GatewayStatus.Disconnected;

  return (
    <Slide in={failed} direction="top">
      <HStack bg="red.500" justify="center" color="white">
        <Text fontWeight="500">Failed to Connect Websocket</Text>
      </HStack>
    </Slide>
  );
}

export function initGateway(auth: Auth) {
  auth.onAuthStateChanged((user) => {
    console.log('refresh', user?.getIdToken());
  });
}

export type GatewayData = ReconnectingWebSocket;

export function useGatewayQuery() {
  const login = useLoginQuery();

  return useQuery<GatewayData>(Keys.ws.connect, () => startGateway(), {
    enabled: login.isSuccess,
  });
}
