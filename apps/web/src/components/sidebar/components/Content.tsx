// chakra imports
import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Spacer,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
//   Custom components
import Brand from './Brand';
import { getActiveSidebarItem, SidebarItem as SidebarItemType } from '@omagize/utils/route-utils';
import { useUserStore } from '@omagize/data-access-store';
import { Snowflake } from '@omagize/api';
import { AddGroupModal, ChatGroupItem, ChatGroupSkeleton } from '@omagize/views/shared';
import { HSeparator, Repeat } from '@omagize/ui/components';
import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarItem } from './SidebarItem';
import { AddIcon } from '@chakra-ui/icons';
import { useSelfUser } from '@omagize/data-access-api';

function SidebarContent({
  items,
  selected: selectedGroup,
  onSelect,
}: {
  items: SidebarItemType[];
  selected: Snowflake;
  onSelect: (id: Snowflake) => void;
}) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const groups = useUserStore((s) => s.groups);
  const location = useLocation();
  const active = getActiveSidebarItem(items, location);

  // SIDEBAR
  return (
    <Flex direction="column" height="100%" pt="25px" borderRadius="30px" overflow="auto">
      <AddGroupModal isOpen={isOpen} onClose={onClose} />

      <Brand />
      <Stack direction="column" mt="18px" mb="auto">
        <Box ps="10px">
          {items.map((route: SidebarItem, index: number) => (
            <SidebarItem key={index} item={route} active={active === route} />
          ))}
        </Box>
        <Flex direction="column" px="10px" gap={3}>
          <HStack>
            <HSeparator /> <Text color="secondaryGray.500">Groups</Text> <HSeparator />
          </HStack>
          {groups != null ? (
            groups.map((group) => (
              <ChatGroupItem
                key={group.id}
                group={group}
                active={selectedGroup === group.id}
                onSelect={() => onSelect(group.id)}
              />
            ))
          ) : (
            <Repeat times={2}>
              <ChatGroupSkeleton />
            </Repeat>
          )}
        </Flex>
      </Stack>
      <HStack pos="sticky" bottom={0} pl="10px" pr="15px" mt="60px" mb="20px">
        <UserProfile />
        <Spacer />
        <Tooltip label="Add Group">
          <IconButton
            icon={<AddIcon />}
            aria-label="Add Group"
            variant="brand"
            rounded="full"
            onClick={onOpen}
          />
        </Tooltip>
      </HStack>
    </Flex>
  );
}

function UserProfile() {
  const navigate = useNavigate();
  const user = useSelfUser();

  return (
    <HStack
      w="full"
      _light={{ bg: 'gray.100' }}
      _dark={{ bg: 'navy.700' }}
      rounded="full"
      p={2}
      cursor="pointer"
      onClick={() => navigate('/user/profile')}
    >
      <Avatar size="sm" name={user.username} src={user.avatarUrl} />
      <Text fontWeight="600">{user.username}</Text>
    </HStack>
  );
}

export default SidebarContent;
