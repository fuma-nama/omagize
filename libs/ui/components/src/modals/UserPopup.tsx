import { ChevronDownIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { Role, sendFriendRequest, Snowflake, User } from '@omagize/api';
import {
  useUserInfo,
  useMemberQuery,
  useSelfUser,
  useGroupDetailQuery,
  useUpdateMemberMutation,
} from '@omagize/data-access-api';
import { useUserStore, usePageStore } from '@omagize/data-access-store';
import { useColors } from '@omagize/ui/theme';
import { useMutation } from '@tanstack/react-query';
import { createContext, ReactNode, useContext } from 'react';
import { BiChat } from 'react-icons/bi';
import { BsPeople } from 'react-icons/bs';
import { FaUserFriends } from 'react-icons/fa';
import { Popup } from './Popup';

export type UserPopupContext =
  | {
      type: 'member';
      group: Snowflake;
    }
  | {
      type: 'user';
    };

export const UserPopupContext = createContext<UserPopupContext>({
  type: 'user',
});

export function UserPopup(props: { user: Snowflake; children: ReactNode }) {
  const context = useContext(UserPopupContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { textColorPrimary, textColorSecondary } = useColors();
  const query = useUserInfo(props.user, isOpen);

  if (context.type === 'member') {
    return <MemberPopup {...props} group={context.group} />;
  }

  const user = query.data;
  return (
    <Popup root={props.children} popover={{ isOpen, onOpen, onClose }}>
      <Banner banner={user?.bannerUrl} avatar={user?.avatarUrl} name={user?.username} />
      <Flex direction="column" p={2} ml={4}>
        <Text fontSize="xl" fontWeight="600" color={textColorPrimary}>
          {user?.username}
        </Text>
        <Text color={textColorSecondary}>{user?.description}</Text>
        <HStack mt={3}>{user && <FriendActions user={user} />}</HStack>
      </Flex>
    </Popup>
  );
}

export function MemberPopup(props: { user: Snowflake; group: Snowflake; children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { textColorPrimary, textColorSecondary } = useColors();
  const groupQuery = useGroupDetailQuery(props.group);
  const query = useMemberQuery(props.group, props.user, isOpen);
  const updateMutation = useUpdateMemberMutation();
  const user = query.data;

  const updateRole = (role: Role) => {
    if (user.role != null && user.role.id === role.id) return;

    return updateMutation.mutate({
      group: props.group,
      user: user.id,
      options: {
        role: role.id,
      },
    });
  };

  const removeRole = () => {
    if (user.role == null) return;

    return updateMutation.mutate({
      group: props.group,
      user: user.id,
      options: {
        removeRole: true,
      },
    });
  };

  return (
    <Popup root={props.children} popover={{ isOpen, onOpen, onClose }}>
      <Banner banner={user?.bannerUrl} avatar={user?.avatarUrl} name={user?.username} />
      <Flex direction="column" p={2} pb={4} mx={4}>
        <Text fontSize="xl" fontWeight="600" color={textColorPrimary}>
          {user?.username}
        </Text>
        <Text color={textColorSecondary}>{user?.description}</Text>
        <Text mt={3} color={textColorSecondary} fontWeight="600">
          Role
        </Text>
        <Menu>
          <ButtonGroup isDisabled={groupQuery.isLoading || updateMutation.isLoading}>
            <MenuButton
              w="full"
              as={Button}
              rightIcon={<ChevronDownIcon />}
              isLoading={groupQuery.isLoading || updateMutation.isLoading}
            >
              {user?.role?.name ?? <Text color={textColorSecondary}>Select a Role</Text>}
            </MenuButton>
            {user?.role != null && (
              <Tooltip label="Remove Role">
                <IconButton
                  icon={<CloseIcon />}
                  aria-label="Close"
                  variant="danger"
                  onClick={removeRole}
                />
              </Tooltip>
            )}
          </ButtonGroup>

          <MenuList>
            {groupQuery.data?.roles.map((role) => (
              <MenuItem key={role.id} icon={<BsPeople />} onClick={() => updateRole(role)}>
                {role.name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <HStack mt={3}>{user && <FriendActions user={user} />}</HStack>
      </Flex>
    </Popup>
  );
}

function FriendActions({ user }: { user: User }) {
  const self = useSelfUser();
  const friends = useUserStore((s) => s.relations);
  const setDM = usePageStore((s) => s.setDM);

  const isFriend = friends != null && friends.some((u) => u.user.id === user.id);
  const mutation = useMutation(() => sendFriendRequest(user.id, ''));

  if (self.id === user.id) return <></>;
  return isFriend ? (
    <Button leftIcon={<BiChat />} variant="action" onClick={() => setDM(user)}>
      Chat
    </Button>
  ) : (
    <Button
      colorScheme="green"
      leftIcon={<FaUserFriends />}
      isLoading={mutation.isLoading}
      onClick={() => mutation.mutate()}
    >
      Add Friend
    </Button>
  );
}

function Banner(props: { banner?: string; avatar?: string; name?: string }) {
  const { brand, cardBg } = useColors();

  return (
    <>
      {props.banner != null ? (
        <Image src={props.banner} w="full" h={100} objectFit="cover" />
      ) : (
        <Box bg={brand} w="full" h={100} />
      )}
      <Avatar
        src={props.avatar}
        name={props.name}
        borderColor={cardBg}
        borderWidth={3}
        ml={5}
        mt={-10}
        w={20}
        h={20}
      />
    </>
  );
}
