import { HStack, Slide, Text } from '@chakra-ui/react';
import { client, Gateway, Keys, useLoginQuery } from '@omagize/api';
import { useQuery } from '@tanstack/react-query';
import { Auth } from 'firebase/auth';
import ReconnectingWebSocket from 'reconnecting-websocket';

export function WebsocketConnect() {
  const query = useGatewayQuery();

  return (
    <Slide in={!query.isSuccess} direction="top">
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

export type GatewayData = {
  socket: ReconnectingWebSocket;
  connected: boolean;
};

function updateGatewayConnected(connected: boolean) {
  return client.setQueryData<GatewayData>(Keys.ws.connect, (prev) => ({
    ...prev,
    connected,
  }));
}

export function useGatewayQuery() {
  const login = useLoginQuery();

  return useQuery<GatewayData>(
    Keys.ws.connect,
    async () => ({
      socket: await Gateway.connect({ debug: true }),
      connected: false,
    }),
    {
      enabled: login.isSuccess,
      onSuccess({ socket }) {
        socket.addEventListener('open', () => {
          updateGatewayConnected(true);
        });
        socket.addEventListener('close', () => {
          updateGatewayConnected(false);
        });
        socket.addEventListener('error', () => {
          updateGatewayConnected(false);
        });
      },
    }
  );
}
