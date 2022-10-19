// Chakra imports
import { Box, Flex } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin';
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { PageContext } from 'contexts/PageContext';
import { useActiveSidebarItem } from 'utils/RouteUtil';

export default function Dashboard() {
  document.documentElement.dir = 'ltr';

  const { info } = useContext(PageContext);
  const activeItem = useActiveSidebarItem();

  return (
    <Flex
      direction="column"
      float="right"
      height="100%"
      overflow="auto"
      position="relative"
      p={{ base: '10px', md: '30px' }}
      w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
      maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
      maxHeight="100%"
      transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
      transitionDuration=".2s, .2s, .35s"
      transitionProperty="top, bottom, width"
      transitionTimingFunction="linear, linear, ease"
    >
      <Navbar brandText={activeItem?.name || info?.title} />
      <Box mx="auto" w="full" pe="20px" padding={0} flex="1 1" mt="50px">
        <Outlet />
      </Box>
      <Box>
        <Footer />
      </Box>
    </Flex>
  );
}
