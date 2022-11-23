import { HStack, Slide, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { applyReadyPayload } from 'stores/hooks';
import { useGatewayQuery, useGatewayListener } from './index';

export default function WebsocketConnect() {
  useGatewayQuery();
  const [failed, setFailed] = useState<boolean>(false);
  useGatewayListener({
    onReady(payload) {
      setFailed(false);
      applyReadyPayload(payload);
    },
    onClose: () => setFailed(true),
    onError: () => setFailed(true),
  });

  return (
    <Slide in={failed} direction="top">
      <HStack bg="red.500" justify="center" color="white">
        <Text fontWeight="500">Failed to Connect Websocket</Text>
      </HStack>
    </Slide>
  );
}
