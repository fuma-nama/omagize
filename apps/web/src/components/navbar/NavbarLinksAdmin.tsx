// Chakra Imports
import { Flex, FlexProps } from '@chakra-ui/react';
// Custom Components
import { SearchBar } from 'components/navbar/searchBar/SearchBar';
import { SidebarResponsive } from 'components/sidebar/Sidebar';

import items from 'sidebar';
import { UserMenu } from './menu/UserMenu';
import ThemeSwitch from './components/ThemeSwitch';
import NotificationsMenu from './menu/NotificationsMenu';
import { useNavbarColors } from '../../variables/colors';

export default function HeaderLinks() {
  return (
    <NavbarLinksBox>
      <SearchBar mb="unset" me="10px" />
      <NavbarDefaultItems />
    </NavbarLinksBox>
  );
}

export function NavbarDefaultItems() {
  const { iconColor, textColorPrimary, menuBg, shadow } = useNavbarColors();

  return (
    <>
      <SidebarResponsive items={items} />
      <NotificationsMenu />
      <ThemeSwitch color={iconColor} />
      <UserMenu color={textColorPrimary} shadow={shadow} bg={menuBg} />
    </>
  );
}

export function NavbarLinksBox(props: FlexProps) {
  // Chakra Color Mode
  const { menuBg, shadow } = useNavbarColors();

  return (
    <Flex
      w={{ base: '100%', md: 'auto' }}
      alignItems="center"
      direction="row"
      bg={menuBg}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
      {...props}
    />
  );
}
