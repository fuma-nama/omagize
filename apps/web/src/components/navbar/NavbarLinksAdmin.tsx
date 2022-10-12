// Chakra Imports
import { Flex } from '@chakra-ui/react';
// Custom Components
import { SearchBar } from 'components/navbar/searchBar/SearchBar';
import { SidebarResponsive } from 'components/sidebar/Sidebar';
import React from 'react';

import routes from 'routes';
import { UserMenu } from './menu/UserMenu';
import ThemeSwitch from './components/ThemeSwitch';
import NotificationsMenu from './menu/NotificationsMenu';
import { useNavbarColors } from '../../variables/colors';

export default function HeaderLinks() {
  // Chakra Color Mode
  const { iconColor, textColorPrimary, menuBg, shadow } = useNavbarColors();

  return (
    <Flex
      w={{ base: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <SearchBar mb="unset" me="10px" borderRadius="30px" />
      <SidebarResponsive routes={routes} />
      <NotificationsMenu />
      <ThemeSwitch color={iconColor} />
      <UserMenu color={textColorPrimary} shadow={shadow} bg={menuBg} />
    </Flex>
  );
}
