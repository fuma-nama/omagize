import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Icon,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { FriendRequest } from '@omagize/api';
import {
  FriendItem,
  FriendRequestItem,
  UserItemSkeleton,
} from 'components/card/UserItem';
import { Holder, Placeholder } from 'components/layout/Container';
import AddFriendModal from 'components/modals/AddFriendModal';
import { BiSad } from 'react-icons/bi';
import { useUserStore } from 'stores/UserStore';
import { useColors } from 'variables/colors';

function CTab(props: { count: number; children: string }) {
  const { textColorPrimary, textColorSecondary, brand, cardBg } = useColors();

  return (
    <Tab
      color={textColorSecondary}
      rounded="xl"
      _focus={{ boxShadow: 'none' }}
      _selected={{ color: textColorPrimary, bg: cardBg }}
      py={1}
    >
      {props.children}
      <Box bg={brand} color="white" rounded="full" px={2} py={1} ml={2}>
        {props.count}
      </Box>
    </Tab>
  );
}

export default function Friends() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [friends, friendRequests] = useUserStore((s) => [
    s.friends,
    s.friendRequests,
  ]);

  return (
    <Flex direction="column" gap={3}>
      <AddFriendModal isOpen={isOpen} onClose={onClose} />
      <Tabs isLazy variant="soft-rounded">
        <TabList gap={2}>
          <Text fontSize="2xl" fontWeight="700" mr={2}>
            Your Friends
          </Text>
          <CTab count={friends.length}>All</CTab>
          <CTab count={friendRequests.length}>Pending</CTab>
          <Button onClick={onOpen} colorScheme="green" leftIcon={<AddIcon />}>
            Add
          </Button>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <All />
          </TabPanel>
          <TabPanel px={0}>
            <Pending />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

function All() {
  const friends = useUserStore((s) => s.friends);

  if (friends != null && friends.length === 0) {
    return <FriendsPlaceholder />;
  }

  return (
    <SimpleGrid columns={{ base: 1, lg: 2, '2xl': 3 }} gap={5}>
      <Holder
        isLoading={friends == null}
        skeleton={
          <>
            <UserItemSkeleton />
            <UserItemSkeleton />
            <UserItemSkeleton />
          </>
        }
      >
        {friends?.map((friend) => (
          <FriendItem key={friend.user.id} friend={friend} />
        ))}
      </Holder>
    </SimpleGrid>
  );
}

function Pending() {
  const friendRequests = useUserStore((s) => s.friendRequests);

  if (friendRequests != null && friendRequests.length === 0) {
    return <FriendsPlaceholder />;
  }

  return (
    <SimpleGrid columns={{ base: 1, lg: 2, '2xl': 3 }} gap={5}>
      <Holder
        isLoading={friendRequests == null}
        skeleton={
          <>
            <UserItemSkeleton />
            <UserItemSkeleton />
            <UserItemSkeleton />
          </>
        }
      >
        {friendRequests?.map((request: FriendRequest) => (
          <FriendRequestItem key={request.user.id} request={request} />
        ))}
      </Holder>
    </SimpleGrid>
  );
}

function FriendsPlaceholder() {
  return (
    <Placeholder icon={<Icon as={BiSad} w={20} h={20} />}>
      You don't have a Friend yet
    </Placeholder>
  );
}
