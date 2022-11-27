import React from 'react';

// chakra imports
import {
  Box,
  Flex,
  Drawer,
  DrawerBody,
  Icon,
  useColorModeValue,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import Content from 'components/sidebar/components/Content';
import { renderThumb, renderTrack, renderView } from 'components/layout/Scrollbar';

// Assets
import { IoMenuOutline } from 'react-icons/io5';
import { usePageStore } from 'stores/PageStore';

function Sidebar({ items }: { items: SidebarItem[]; [x: string]: any }) {
  let variantChange = '0.2s linear';
  let shadow = useColorModeValue('14px 17px 40px 4px rgba(112, 144, 176, 0.08)', 'unset');
  // Chakra Color Mode
  let sidebarBg = useColorModeValue('white', 'navy.800');
  let sidebarMargins = '0px';

  // SIDEBAR
  return (
    <Box display={{ base: 'none', xl: 'block' }} minH="100%">
      <Box
        bg={sidebarBg}
        transition={variantChange}
        w="300px"
        h="100vh"
        m={sidebarMargins}
        minH="100%"
        overflowX="hidden"
        boxShadow={shadow}
      >
          <Content items={items} />
      </Box>
    </Box>
  );
}

export function SidebarTrigger() {
  const menuColor = useColorModeValue('gray.400', 'white');
  const setOpen = usePageStore((s) => s.setSidebarIsOpen);

  return (
    <Flex display={{ sm: 'flex', xl: 'none' }} alignItems="center">
      <Flex w="max-content" h="max-content" onClick={() => setOpen(true)}>
        <Icon
          as={IoMenuOutline}
          color={menuColor}
          my="auto"
          w="20px"
          h="20px"
          me="10px"
          _hover={{ cursor: 'pointer' }}
        />
      </Flex>
    </Flex>
  );
}

// FUNCTIONS
export function SidebarResponsive({ items }: { items: SidebarItem[] }) {
  let sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  const [isOpen, setOpen] = usePageStore((s) => [s.sidebarIsOpen, s.setSidebarIsOpen]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      placement={document.documentElement.dir === 'rtl' ? 'right' : 'left'}
    >
      <DrawerOverlay />
      <DrawerContent w="285px" maxW="285px" bg={sidebarBackgroundColor}>
        <DrawerCloseButton
          zIndex="3"
          onClick={() => setOpen(false)}
          _focus={{ boxShadow: 'none' }}
          _hover={{ boxShadow: 'none' }}
        />
        <DrawerBody maxW="285px" px="0rem" pb="0">
            <Content items={items} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
// PROPS

export default Sidebar;
