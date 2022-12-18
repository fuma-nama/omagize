// Chakra Imports
import { Flex, FlexProps } from '@chakra-ui/react';
import { SidebarTrigger, ThemeSwitch, UserMenu } from '@omagize/ui/components';
import { useNavbarColors } from '@omagize/ui/theme';
// Custom Components

import { NotificationsMenu } from '../menu/NotificationsMenu';

export default function AdminNavbarLinks() {
  return (
    <NavbarLinksBox>
      <NavbarDefaultItems />
    </NavbarLinksBox>
  );
}

export function NavbarDefaultItems() {
  const { iconColor, textColorPrimary, menuBg, shadow } = useNavbarColors();
  const icon = { base: textColorPrimary, '2sm': iconColor };

  return (
    <>
      <SidebarTrigger color={icon} />
      <NotificationsMenu color={icon} />
      <ThemeSwitch color={icon} />
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
      bg={{ '2sm': menuBg }}
      p={{ '2sm': '7px' }}
      boxShadow={{ '2sm': shadow }}
      borderRadius="30px"
      gap="10px"
      {...props}
    />
  );
}
