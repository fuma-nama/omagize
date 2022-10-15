import { PageContextProvider } from '../contexts/PageContext';
import { SidebarContext } from '../contexts/SidebarContext';
import { Flex, HStack, Slide, Text } from '@chakra-ui/react';
import { ReactNode, useEffect, useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import items from '../sidebar';
import { Outlet } from 'react-router-dom';
import { Gateway } from '@omagize/api';
import { useQueryClient } from '@tanstack/react-query';

export default function PageLayout(props: { sidebar?: ReactNode }) {
  const client = useQueryClient();
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    Gateway.connect({ client }, (socket) => {
      socket.addEventListener('open', () => setConnected(true));
      socket.addEventListener('close', () => setConnected(false));
      socket.addEventListener('error', () => setConnected(false));
    });
  }, [client]);

  return (
    <>
      <Flex direction="row" h="full">
        <PageContextProvider>
          <SidebarContext.Provider
            value={{
              toggleSidebar,
              setToggleSidebar,
            }}
          >
            {props.sidebar || <Sidebar items={items} display="none" />}
            <Outlet />
          </SidebarContext.Provider>
        </PageContextProvider>
      </Flex>
      <Slide in={!connected} direction="top">
        <HStack bg="red.500" justify="center" color="white">
          <Text fontWeight="500">Failed to Connect Websocket</Text>
        </HStack>
      </Slide>
    </>
  );
}
