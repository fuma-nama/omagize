import {
  Button,
  Flex,
  HStack,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Friend, FriendRequest } from '@omagize/api';
import {
  FriendItem,
  FriendRequestItem,
  UserItemSkeleton,
} from 'components/card/UserItem';
import { Holder, Placeholder } from 'components/layout/Container';
import AddFriendModal from 'components/modals/AddFriendModal';
import { useUserStore } from 'stores/UserStore';

export default function Friends() {
  const friends = useUserStore((s) => s.friends);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex direction="column" gap={3}>
      <HStack>
        <Text fontSize="2xl" fontWeight="700">
          Your Friends
        </Text>
        <Button onClick={onOpen} variant="brand">
          Add
        </Button>
        <AddFriendModal isOpen={isOpen} onClose={onClose} />
      </HStack>
      <Content friends={friends} />
    </Flex>
  );
}

function Content({ friends }: { friends: Friend[] }) {
  if (friends != null && friends.length === 0) {
    return <Placeholder>You don't have a Friend yet</Placeholder>;
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
        {[].map((request: FriendRequest) => (
          <FriendRequestItem key={request.user.id} request={request} />
        ))}
        {friends?.map((friend) => (
          <FriendItem key={friend.user.id} friend={friend} />
        ))}
      </Holder>
    </SimpleGrid>
  );
}
