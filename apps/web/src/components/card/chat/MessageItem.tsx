import { deleteMessage, Message, useSelfUser } from '@omagize/api';
import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  MenuItem,
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
import { CopyIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useMutation } from '@tanstack/react-query';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { MouseEvent, useState } from 'react';
import { useContextMenu } from 'components/menu/ContextMenu';
import { MessageEditInput } from './MessageEditInput';

export type MessagePermission = {
  edit: boolean;
  delete: boolean;
};

export function useMessageMenu(
  message: Message,
  permission: MessagePermission,
  onEdit: () => void
) {
  const { brand } = useColors();
  const deleteMutation = useMessageDeleteMutation(message);

  return useContextMenu<HTMLDivElement>(
    <>
      <MenuItem
        icon={<CopyIcon color={brand} />}
        onClick={() => navigator.clipboard.writeText(message.content)}
      >
        Copy Message
      </MenuItem>
      {permission.edit && (
        <MenuItem icon={<EditIcon color={brand} />} onClick={onEdit}>
          Edit Message
        </MenuItem>
      )}
      {permission.delete && (
        <MenuItem color="red.400" onClick={() => deleteMutation.mutate()} icon={<DeleteIcon />}>
          Delete
        </MenuItem>
      )}
    </>
  );
}

export default function MessageItem({ message }: { message: Message }) {
  const author = message.author;
  //colors
  const { brand, textColorPrimary } = useColors();
  const hoverBg = useColorModeValue('white', 'navy.800');

  const [edit, setEdit] = useState(false);
  const user = useSelfUser();
  const permission: MessagePermission = {
    edit: message.author.id === user.id,
    delete: message.author.id === user.id,
  };
  const menu = useMessageMenu(message, permission, () => setEdit(true));

  const selected = menu.isOpen || edit;
  const mentioned = message.everyone || message.mentions.some((m) => m.id === user.id);

  return (
    <UserPopup user={author.id}>
      {menu.menu}
      <Flex
        className="message-item"
        pos="relative"
        direction="row"
        bg={selected && hoverBg}
        _hover={{ bg: hoverBg }}
        transition="all 0.2s"
        rounded="xl"
        p={3}
        gap={3}
        role="group"
        ref={menu.targetRef}
      >
        {mentioned && (
          <Box bg={brand} pos="absolute" top={0} left={0} w={1} h="full" roundedLeft="xl" />
        )}
        <MessageActions
          message={message}
          onEdit={() => setEdit(true)}
          onOpenMenu={(e) => menu.open(e.pageX, e.pageY)}
          permission={permission}
          display={{ base: 'none', '3sm': selected && 'flex' }}
          _groupHover={{ display: { '3sm': 'flex' } }}
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
  onOpenMenu,
  permission,
  ...props
}: {
  message: Message;
  permission: MessagePermission;
  onEdit: () => void;
  onOpenMenu: (e: MouseEvent) => void;
} & StackProps) {
  const deleteMutation = useMessageDeleteMutation(message);

  return (
    <HStack pos="absolute" top={0} right={0} {...props}>
      {permission.edit && <IconButton aria-label="edit" icon={<EditIcon />} onClick={onEdit} />}
      {permission.delete && (
        <IconButton
          aria-label="delete"
          icon={<DeleteIcon />}
          isLoading={deleteMutation.isLoading}
          onClick={() => deleteMutation.mutate()}
        />
      )}
      <IconButton
        aria-label="options"
        icon={<BiDotsVerticalRounded />}
        onClick={(e) => onOpenMenu(e)}
      />
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
