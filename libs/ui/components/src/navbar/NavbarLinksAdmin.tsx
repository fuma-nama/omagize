// Chakra Imports
import { Flex, FlexProps } from '@chakra-ui/react';
import { useNavbarColors } from '@omagize/ui/theme';
import { SearchBar } from '../fields/SearchBar';
import { SidebarTrigger } from '../fields/SidebarTrigger';
// Custom Components

import { ThemeSwitch } from '../fields/ThemeSwitch';
import NotificationsMenu from '../menu/NotificationsMenu';
import { UserMenu } from '../menu/UserMenu';

export default function AdminNavbarLinks() {
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
      <SidebarTrigger />
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
