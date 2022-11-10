import { Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import items from '../sidebar';
import { Outlet } from 'react-router-dom';
import WebsocketConnect from 'gateway/WebsocketConnect';

export default function PageLayout(props: { sidebar?: ReactNode }) {
  return (
    <Flex direction="row" h="full">
      {props.sidebar || <Sidebar items={items} display="none" />}
      <Outlet />
      <WebsocketConnect />
    </Flex>
  );
}
