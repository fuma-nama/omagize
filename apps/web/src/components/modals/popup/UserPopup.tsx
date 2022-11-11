import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import {
  sendFriendRequest,
  Snowflake,
  useMemberQuery,
  User,
  useSelfUser,
  useUserInfo,
} from '@omagize/api';
import { useMutation } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { BiChat } from 'react-icons/bi';
import { FaUserFriends } from 'react-icons/fa';
import { useUserStore } from 'stores/UserStore';
import { useColors } from 'variables/colors';
import { Popup } from './Popup';

export function UserPopup(props: {
  user: Snowflake;
  group?: Snowflake;
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { textColorPrimary, textColorSecondary } = useColors();
  const query = useUserInfo(props.user, isOpen);

  const user = query.data;
  return (
    <Popup root={props.children} popover={{ isOpen, onOpen, onClose }}>
      {query.isLoading && <Spinner />}
      <Banner
        banner={user?.bannerUrl}
        avatar={user?.avatarUrl}
        name={user?.username}
      />
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

export function MemberPopup(props: {
  user: Snowflake;
  group: Snowflake;
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { textColorPrimary, textColorSecondary } = useColors();
  const query = useMemberQuery(props.group, props.user, isOpen);

  const user = query.data;
  return (
    <Popup root={props.children} popover={{ isOpen, onOpen, onClose }}>
      <Banner
        banner={user?.bannerUrl}
        avatar={user?.avatarUrl}
        name={user?.username}
      />
      <Flex direction="column" p={2} pb={4} ml={4}>
        <Text fontSize="xl" fontWeight="600" color={textColorPrimary}>
          {user?.username}
        </Text>
        <Text color={textColorSecondary}>{user?.description}</Text>
        <HStack mt={3}>{user && <FriendActions user={user} />}</HStack>
      </Flex>
    </Popup>
  );
}
function FriendActions({ user }: { user: User }) {
  const self = useSelfUser();
  const friends = useUserStore((s) => s.friends);
  const isFriend =
    friends != null && friends.some((u) => u.user.id === user.id);
  const mutation = useMutation(() => sendFriendRequest(user.id, ''));

  if (self.id === user.id) return <></>;
  return (
    <>
      {isFriend ? (
        <Button leftIcon={<BiChat />} variant="brand">
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
      )}
    </>
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
