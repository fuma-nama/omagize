import { PageContextProvider } from '../contexts/PageContext';
import { SidebarContext } from '../contexts/SidebarContext';
import { Flex } from '@chakra-ui/react';
import { ReactNode, useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import items from '../sidebar';
import { Outlet } from 'react-router-dom';
import WebsocketConnect from 'gateway/WebsocketConnect';

export default function PageLayout(props: { sidebar?: ReactNode }) {
  const [toggleSidebar, setToggleSidebar] = useState(false);

  return (
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
      <WebsocketConnect />
    </Flex>
  );
}
