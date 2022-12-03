import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { deleteFriendRequest, FriendRequestType, replyFriendRequest } from '@omagize/api';
import { AiOutlineClose } from 'react-icons/ai';
import { useMutation } from '@tanstack/react-query';
import { WarningIcon } from '@chakra-ui/icons';
import { FriendRequest } from '@omagize/api';
import { useColors } from '@omagize/ui/theme';
import { CustomCardProps, UserPopup } from '@omagize/ui/components';

export function FriendRequestItem({
  request,
  ...card
}: { request: FriendRequest } & CustomCardProps) {
  switch (request.type) {
    case FriendRequestType.Incoming:
      return <IncomingFriendRequestItem request={request} {...card} />;
    case FriendRequestType.Outgoing:
      return <OutgoingFriendRequestItem request={request} {...card} />;
  }
}

function IncomingFriendRequestItem({
  request,
  ...card
}: { request: FriendRequest } & CustomCardProps) {
  const reply = useMutation(
    ['accept_friend_request', request.user.id],
    (reply: 'accept' | 'deny') => replyFriendRequest(request.user.id, reply)
  );

  const { cardBg, brand } = useColors();
  const breakpoint = '3sm';

  return (
    <Flex
      rounded="2xl"
      overflow="hidden"
      direction={{ base: 'column', [breakpoint]: 'row' }}
      {...card}
    >
      <Box bg={cardBg} flex={1} p={5}>
        <HStack mb={3} color="yellow.500">
          <WarningIcon />
          <Text>Friend Request</Text>
        </HStack>
        <Content request={request} />
      </Box>
      <HStack
        align="end"
        justify="end"
        p={2}
        flexShrink={0}
        minW="fit-content"
        w={{ [breakpoint]: '40%' }}
        h={{ [breakpoint]: 'full' }}
        bg={brand}
      >
        <Button
          color="white"
          colorScheme="brandScheme"
          disabled={reply.isLoading}
          isLoading={reply.isLoading && reply.variables === 'accept'}
          onClick={() => reply.mutate('accept')}
        >
          Accept
        </Button>
        <IconButton
          disabled={reply.isLoading}
          isLoading={reply.isLoading && reply.variables === 'deny'}
          onClick={() => reply.mutate('deny')}
          aria-label="deny"
          icon={<AiOutlineClose />}
          variant="danger"
        />
      </HStack>
    </Flex>
  );
}

function OutgoingFriendRequestItem({
  request,
  ...card
}: { request: FriendRequest } & CustomCardProps) {
  const { cardBg } = useColors();
  const deleteMutation = useMutation(() => deleteFriendRequest(request.user.id));

  return (
    <Flex rounded="2xl" bg={cardBg} p={5} direction="row" {...card}>
      <Flex direction="column">
        <HStack mb={3}>
          <WarningIcon />
          <Text>Outgoing Friend Request</Text>
        </HStack>
        <Content request={request} />
      </Flex>
      <IconButton
        ml="auto"
        isLoading={deleteMutation.isLoading}
        onClick={() => deleteMutation.mutate()}
        aria-label="delete"
        icon={<AiOutlineClose />}
        variant="danger"
      />
    </Flex>
  );
}

function Content({ request }: { request: FriendRequest }) {
  const { textColorPrimary, textColorSecondary } = useColors();
  const user = request.user;

  return (
    <UserPopup user={user.id}>
      <HStack gap={2} align="start">
        <PopoverTrigger>
          <Avatar name={user.username} src={user.avatarUrl} variant="normal" cursor="pointer" />
        </PopoverTrigger>
        <Flex direction="column">
          <PopoverTrigger>
            <Text color={textColorPrimary} fontSize="xl" fontWeight="bold" cursor="pointer">
              {user.username}
            </Text>
          </PopoverTrigger>
          <Text color={textColorSecondary}>{request.message}</Text>
        </Flex>
      </HStack>
    </UserPopup>
  );
}
