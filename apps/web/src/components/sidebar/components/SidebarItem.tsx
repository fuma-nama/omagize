/* eslint-disable */

import { NavLink } from 'react-router-dom';
// chakra imports
import { Box, Flex, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { SidebarItem as SidebarItemType } from '@omagize/utils/route-utils';

export function SidebarItem(props: { item: SidebarItemType; active: boolean }) {
  const { item, active } = props;
  let activeColor = useColorModeValue('gray.700', 'white');
  let textColor = useColorModeValue('secondaryGray.500', 'navy.200');
  let brandColor = useColorModeValue('brand.500', 'brand.400');

  return (
    <NavLink to={item.path}>
      <HStack spacing={active ? '22px' : '26px'} py="3px">
        <Flex w="100%" alignItems="center" justifyContent="center">
          <Box
            p={1}
            color={active ? 'white' : textColor}
            bg={active && 'brand.400'}
            me="8px"
            rounded="lg"
          >
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
        <Box h="36px" w="4px" bg={active ? brandColor : 'transparent'} borderRadius="5px" />
      </HStack>
    </NavLink>
  );
}
