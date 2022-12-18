// Chakra imports
import { Box, Flex } from '@chakra-ui/react';
import { AdminNavbar } from '@omagize/views/shared';
import { getActiveSidebarItem } from '@omagize/utils/route-utils';
// Layout components
import { Outlet, useLocation } from 'react-router-dom';
import { layouts } from '../../layouts';
import items from '../../sidebar';

export default function DashboardLayout() {
  document.documentElement.dir = 'ltr';
  const location = useLocation();
  const activeItem = getActiveSidebarItem(items, location);

  return (
    <Flex
      direction="column"
      height="100%"
      overflow="auto"
      position="relative"
      w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
      maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
      maxHeight="100%"
    >
      <AdminNavbar brandText={activeItem?.name} layoutes={layouts} />
      <Box w="full" padding={0} flex="1 1" p={{ base: '10px', md: '20px 30px' }}>
        <Outlet />
      </Box>
    </Flex>
  );
}
