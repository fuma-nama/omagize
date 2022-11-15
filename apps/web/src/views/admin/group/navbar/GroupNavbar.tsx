import { Avatar, Box, Button, HStack, Text } from '@chakra-ui/react';
import { SearchBar } from 'components/navbar/searchBar/SearchBar';
import { SidebarResponsive } from 'components/sidebar/Sidebar';
import items from 'sidebar';
import ThemeSwitch from 'components/navbar/components/ThemeSwitch';
import { UserMenu } from 'components/navbar/menu/UserMenu';
import { BiArrowBack } from 'react-icons/bi';
import { useSelected } from 'utils/navigate';
import { NavbarLinksBox } from 'components/navbar/NavbarLinksAdmin';
import { NavbarBox } from 'components/navbar/NavbarAdmin';
import { useGroup } from 'stores/hooks';
import { useNavbarColors } from 'variables/colors';

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
      <Box ms="auto" w={{ sm: '100%', md: 'unset' }}>
        <GroupNavbarLinks isRoot={isRoot} />
      </Box>
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
        <SidebarResponsive items={items} />

        <ThemeSwitch color={iconColor} />
        <UserMenu color={textColorPrimary} shadow={shadow} bg={menuBg} />
      </HStack>
    </NavbarLinksBox>
  );
}
