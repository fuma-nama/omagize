import { deleteMessage, Message, useSelfUser } from '@omagize/api';
import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  MenuItem,
  MenuList,
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
import { useState } from 'react';
import { useContextMenu } from 'components/menu/ContextMenu';
import { MessageEditInput } from './MessageEditInput';

export function useMessageMenu(message: Message, onEdit: () => void) {
  const { globalBg, brand } = useColors();
  const deleteMutation = useMessageDeleteMutation(message);

  return useContextMenu<HTMLDivElement>(
    <MenuList bg={globalBg} border={0}>
      <MenuItem icon={<EditIcon color={brand} />} onClick={onEdit}>
        Edit Message
      </MenuItem>
      <MenuItem color="red.400" onClick={() => deleteMutation.mutate()} icon={<DeleteIcon />}>
        Delete
      </MenuItem>
    </MenuList>
  );
}

export default function MessageItem({ message }: { message: Message }) {
  const author = message.author;
  //colors
  const { brand, textColorPrimary } = useColors();
  const hoverBg = useColorModeValue('white', 'navy.800');

  const [edit, setEdit] = useState(false);
  const user = useSelfUser();
  const mentioned = message.everyone || message.mentions.some((m) => m.id === user.id);
  const menu = useMessageMenu(message, () => setEdit(true));

  return (
    <UserPopup user={author.id}>
      {menu.menu}
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
        ref={menu.targetRef}
      >
        {mentioned && <Box bg={brand} pos="absolute" top={0} left={0} w={1} h="full" />}
        <MessageActions
          onEdit={() => setEdit(true)}
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
          <HStack color={textColorPrimary}>
            <PopoverTrigger>
              <Text fontWeight="bold" fontSize="lg" cursor="pointer">
                {author.username}
              </Text>
            </PopoverTrigger>
            <Text fontSize="sm">- {stringOfTime(message.timestamp)}</Text>
          </HStack>
          {edit ? (
            <MessageEditInput message={message} onClose={() => setEdit(false)} />
          ) : (
            <MarkdownContent message={message} />
          )}
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

export function MessageActions({
  message,
  onEdit,
  ...props
}: { message: Message; onEdit: () => void } & StackProps) {
  const deleteMutation = useMessageDeleteMutation(message);

  return (
    <HStack {...props}>
      <IconButton aria-label="edit" icon={<EditIcon />} onClick={onEdit} />
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

export function useMessageDeleteMutation(message: Message) {
  return useMutation(['delete_message', message.id], () =>
    deleteMessage(message.id, message.channel)
  );
}
