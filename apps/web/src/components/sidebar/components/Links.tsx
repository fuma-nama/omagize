/* eslint-disable */

import { NavLink, useLocation } from 'react-router-dom';
// chakra imports
import { Box, Flex, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { getActiveSidebarItem } from '../../../utils/RouteUtil';

export function SidebarLinks({ items }: { items: SidebarItem[] }) {
  const location = useLocation();

  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createLinks = (routes: SidebarItem[]) => {
    const active = getActiveSidebarItem(location);

    return routes.map((route: SidebarItem, index: number) => (
      <Link key={index} item={route} active={active === route} />
    ));
  };
  //  BRAND
  return <>{createLinks(items)}</>;
}

function Link(props: { item: SidebarItem; active: boolean }) {
  const { item, active } = props;
  let activeColor = useColorModeValue('gray.700', 'white');
  let activeIcon = useColorModeValue('brand.500', 'white');
  let textColor = useColorModeValue('secondaryGray.500', 'white');
  let brandColor = useColorModeValue('brand.500', 'brand.400');

  return (
    <NavLink to={item.path}>
      <Box>
        <HStack spacing={active ? '22px' : '26px'} py="5px" ps="10px">
          <Flex w="100%" alignItems="center" justifyContent="center">
            <Box color={active ? activeIcon : textColor} me="18px">
              {item.icon}
            </Box>
            <Text
              me="auto"
              color={active ? activeColor : textColor}
              fontWeight={active ? 'bold' : 'normal'}
            >
              {item.name}
            </Text>
          </Flex>
          <Box
            h="36px"
            w="4px"
            bg={active ? brandColor : 'transparent'}
            borderRadius="5px"
          />
        </HStack>
      </Box>
    </NavLink>
  );
}

export default SidebarLinks;
