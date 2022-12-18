import { Avatar, HStack, IconButton, Text } from '@chakra-ui/react';
import { BiLeftArrow } from 'react-icons/bi';
import { SidebarTrigger, ThemeSwitch, UserMenu } from '@omagize/ui/components';
import { useSelected } from '@omagize/utils/route-utils';
import { useNavbarColors } from '@omagize/ui/theme';
import { useGroup } from '@omagize/data-access-store';
import { NavbarBox, NavbarLinksBox } from '@omagize/views/shared';

export function GroupNavbar({ isRoot }: { isRoot?: boolean }) {
  const { selectedGroup, setSelectedGroup } = useSelected();
  const group = useGroup(selectedGroup);

  return (
    <NavbarBox>
      <HStack>
        {!isRoot && (
          <IconButton
            icon={<BiLeftArrow />}
            onClick={() => setSelectedGroup(selectedGroup)}
            variant="link"
            aria-label="back"
          />
        )}
        <Avatar src={group?.iconUrl} name={group?.name} />
        <Text fontWeight="600" fontSize="xl">
          {group?.name}
        </Text>
      </HStack>
      <GroupNavbarLinks />
    </NavbarBox>
  );
}

function GroupNavbarLinks() {
  const { iconColor, textColorPrimary, menuBg, shadow } = useNavbarColors();
  const icon = { base: textColorPrimary, '2sm': iconColor };

  return (
    <NavbarLinksBox>
      <SidebarTrigger color={icon} />
      <ThemeSwitch color={icon} />
      <UserMenu color={textColorPrimary} shadow={shadow} bg={menuBg} />
    </NavbarLinksBox>
  );
}
