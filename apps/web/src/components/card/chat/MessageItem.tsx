import { deleteMessage, editMessage, EditMessageBody, Message, useSelfUser } from '@omagize/api';
import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  SkeletonCircle,
  SkeletonText,
  StackProps,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { AttachmentItem } from './AttachmentItem';
import { stringOfTime } from 'utils/DateUtils';
import MarkdownContent from './MarkdownContent';
import { useColors } from 'variables/colors';
import { UserPopup } from 'components/modals/popup/UserPopup';
import { PopoverTrigger } from 'components/PopoverTrigger';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useMutation } from '@tanstack/react-query';
import { BiDotsVerticalRounded } from 'react-icons/bi';

export default function MessageItem({ message }: { message: Message }) {
  const author = message.author;
  const { brand } = useColors();
  const secondaryText = useColorModeValue('gray.400', 'white');
  const hoverBg = useColorModeValue('white', 'navy.800');
  const user = useSelfUser();
  const mentioned = message.everyone || message.mentions.some((m) => m.id === user.id);

  return (
    <UserPopup user={author.id}>
      <Flex
        className="message-item"
        pos="relative"
        direction="row"
        _hover={{ bg: hoverBg }}
        transition="all 0.2s"
        rounded="xl"
        p={3}
        gap={3}
        overflow="hidden"
        role="group"
      >
        {mentioned && <Box bg={brand} pos="absolute" top={0} left={0} w={1} h="full" />}
        <MessageActions
          pos="absolute"
          top={0}
          right={0}
          display="none"
          _groupHover={{ display: { '3sm': 'flex' } }}
          message={message}
        />
        <PopoverTrigger>
          <Avatar cursor="pointer" name={author.username} src={author.avatarUrl} />
        </PopoverTrigger>
        <Flex direction="column" align="start" ml={2} flex={1} w={0} wordBreak="break-word">
          <HStack>
            <PopoverTrigger>
              <Text fontWeight="bold" fontSize="lg" cursor="pointer">
                {author.username}
              </Text>
            </PopoverTrigger>
            <Text textColor={secondaryText} fontSize="sm">
              - {stringOfTime(message.timestamp)}
            </Text>
          </HStack>
          <MarkdownContent message={message} />
          <Flex direction="column" gap={2} w="full">
            {message.attachments.map((a) => (
              <AttachmentItem key={a.id} attachment={a} />
            ))}
          </Flex>
        </Flex>
      </Flex>
    </UserPopup>
  );
}

export function MessageActions({ message, ...props }: { message: Message } & StackProps) {
  const editMutation = useMutation((body: EditMessageBody) =>
    editMessage(message.id, message.channel, body)
  );
  const deleteMutation = useMutation(() => deleteMessage(message.id, message.channel));

  return (
    <HStack {...props}>
      <IconButton aria-label="edit" icon={<EditIcon />} />
      <IconButton
        aria-label="delete"
        icon={<DeleteIcon />}
        isLoading={deleteMutation.isLoading}
        onClick={() => deleteMutation.mutate()}
      />
      <IconButton aria-label="options" icon={<BiDotsVerticalRounded />} />
    </HStack>
  );
}

export function MessageItemSkeleton(props: { noOfLines: number }) {
  return (
    <Flex direction="row" p={7} transition="all 0.2s" rounded="xl">
      <SkeletonCircle w="50px" h="50px" />
      <Flex direction="column" align="start" ml={2} gap={5} w="full" maxW="500px">
        <SkeletonText w="46%" noOfLines={1} />
        <SkeletonText w="full" noOfLines={props.noOfLines} />
      </Flex>
    </Flex>
  );
}
