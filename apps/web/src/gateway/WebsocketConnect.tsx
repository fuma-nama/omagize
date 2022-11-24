import { HStack, Slide, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useGatewayListener } from './index';

export default function WebsocketConnect() {
  const [failed, setFailed] = useState<boolean>(false);
  useGatewayListener({
    onReady: () => setFailed(false),
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
