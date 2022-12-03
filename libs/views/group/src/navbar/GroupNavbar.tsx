import { Avatar, Button, HStack, Text } from '@chakra-ui/react';
import { BiArrowBack } from 'react-icons/bi';
import {
  NavbarBox,
  NavbarLinksBox,
  SearchBar,
  SidebarTrigger,
  ThemeSwitch,
  UserMenu,
} from '@omagize/ui/components';
import { useSelected } from '@omagize/utils/route-utils';
import { useNavbarColors } from '@omagize/ui/theme';
import { useGroup } from '@omagize/data-access-store';

export function GroupNavbar({ isRoot }: { isRoot?: boolean }) {
  const { selectedGroup } = useSelected();
  const group = useGroup(selectedGroup);

  return (
    <NavbarBox>
      <HStack>
        <Avatar src={group?.iconUrl} name={group?.name} />
        <Text fontWeight="600" fontSize="xl">
          {group?.name}
        </Text>
      </HStack>
      <GroupNavbarLinks isRoot={isRoot} />
    </NavbarBox>
  );
}

export default function GroupNavbarLinks({ isRoot }: { isRoot?: boolean }) {
  const { iconColor, textColorPrimary, menuBg, shadow } = useNavbarColors();
  const { selectedGroup, setSelectedGroup } = useSelected();

  return (
    <NavbarLinksBox alignItems="start" direction="column">
      {!isRoot && (
        <HStack ml={2}>
          <Button
            leftIcon={<BiArrowBack />}
            onClick={() => setSelectedGroup(selectedGroup)}
            variant="link"
          >
            Back
          </Button>
        </HStack>
      )}
      <HStack w="full" align="center">
        <SearchBar mb="unset" me="10px" w="full" />
        <SidebarTrigger />

        <ThemeSwitch color={iconColor} />
        <UserMenu color={textColorPrimary} shadow={shadow} bg={menuBg} />
      </HStack>
    </NavbarLinksBox>
  );
}
