// Chakra imports
import { Box, Flex } from '@chakra-ui/react';
import { AdminNavbar } from '@omagize/views/shared';
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
    <Flex direction="column" overflow="hidden" position="relative" w="full" h="full">
      <AdminNavbar layoutes={layouts} brandText={active?.name} />
      <Box flex={1} h={0}>
        <Outlet />
      </Box>
    </Flex>
  );
}
