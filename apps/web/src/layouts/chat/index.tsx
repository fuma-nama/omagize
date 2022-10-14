// Chakra imports
import { Box, Flex } from '@chakra-ui/react';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin';
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { PageContext } from 'contexts/PageContext';
import { useActiveSidebarItem } from 'utils/RouteUtil';

export default function ChatLayout() {
  document.documentElement.dir = 'ltr';

  const { info } = useContext(PageContext);
  const active = useActiveSidebarItem();

  return (
    <Flex
      direction="column"
      float="right"
      overflow="hidden"
      position="relative"
      w="full"
      h="full"
      transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
      transitionDuration=".2s, .2s, .35s"
      transitionProperty="top, bottom, width"
      transitionTimingFunction="linear, linear, ease"
    >
      <Box pos="sticky" top={0} px="20px" py="10px" w="full">
        <Navbar brandText={active?.name || info?.title} />
      </Box>
      <Outlet />
    </Flex>
  );
}
