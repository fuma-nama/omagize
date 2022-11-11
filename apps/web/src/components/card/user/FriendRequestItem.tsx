import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { useColors } from '../../../variables/colors';
import { replyFriendRequest } from '@omagize/api';
import { CustomCardProps } from 'theme/theme';
import { AiOutlineClose } from 'react-icons/ai';
import { useMutation } from '@tanstack/react-query';
import { WarningIcon } from '@chakra-ui/icons';
import { FriendRequest } from '@omagize/api';

export function FriendRequestItem({
  request,
  ...card
}: { request: FriendRequest } & CustomCardProps) {
  const user = request.user;
  const image = user.bannerUrl ?? user.avatarUrl;
  const reply = useMutation(
    ['accept_friend_request', request.user.id],
    (reply: 'accept' | 'deny') => replyFriendRequest(request.user.id, reply)
  );

  const { textColorPrimary, textColorSecondary, cardBg, brand } = useColors();
  const breakpoint = '3sm';

  return (
    <Flex
      rounded="2xl"
      overflow="hidden"
      direction={{ base: 'column', [breakpoint]: 'row' }}
      {...card}
    >
      <Box bg={cardBg} flex={1} p="21px">
        <HStack mb={3}>
          <WarningIcon />
          <Text>Friend Request</Text>
        </HStack>
        <HStack gap="10px" align="start">
          <Avatar name={user.username} src={user.avatarUrl} variant="normal" />
          <Flex direction="column">
            <Text color={textColorPrimary} fontSize="xl" fontWeight="bold">
              {user.username}
            </Text>
            <Text color={textColorSecondary}>{request.message}</Text>
          </Flex>
        </HStack>
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
        bgImg={image}
        bgSize="cover"
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
