// Chakra imports
import { Box, Flex } from '@chakra-ui/react';
import { AdminNavbar } from '@omagize/ui/components';
// Layout components
import { Outlet, useLocation } from 'react-router-dom';
import { getActiveSidebarItem } from '@omagize/utils/route-utils';
import items from '../../sidebar';
import { layouts } from '../../layouts';
export default function ChatLayout() {
  document.documentElement.dir = 'ltr';
  const location = useLocation();
  const active = getActiveSidebarItem(items, location);

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
      <Box px={{ '3sm': '10px' }} py={{ '3sm': '10px' }} w="full">
        <AdminNavbar layoutes={layouts} brandText={active?.name} />
      </Box>
      <Box flex={1} h={0}>
        <Outlet />
      </Box>
    </Flex>
  );
}
