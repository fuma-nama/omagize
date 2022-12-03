import { Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';
import items from '../sidebar';
import { Outlet } from 'react-router-dom';
import WebsocketConnect from '../gateway/WebsocketConnect';
import { SidebarResponsive, Sidebar } from '../components/sidebar';

export default function PageLayout(props: { sidebar?: ReactNode }) {
  return (
    <Flex direction="row" h="full">
      {props.sidebar || <Sidebar items={items} />}
      <SidebarResponsive items={items} />
      <Outlet />
      <WebsocketConnect />
    </Flex>
  );
}
