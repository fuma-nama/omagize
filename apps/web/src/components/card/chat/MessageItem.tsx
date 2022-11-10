import { Message, useSelfUser } from '@omagize/api';
import {
  Avatar,
  Box,
  Flex,
  HStack,
  SkeletonCircle,
  SkeletonText,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { AttachmentItem } from './AttachmentItem';
import { stringOfTime } from 'utils/DateUtils';
import MarkdownContent from './MarkdownContent';
import { useColors } from 'variables/colors';
import { MemberPopup } from 'components/modals/popup/UserPopup';

export default function MessageItem({ message }: { message: Message }) {
  const author = message.author;
  const { brand } = useColors();
  const secondaryText = useColorModeValue('gray.400', 'white');
  const hoverBg = useColorModeValue('white', 'navy.800');
  const user = useSelfUser();
  const mentioned =
    message.everyone || message.mentions.some((m) => m.id === user.id);

  return (
    <Flex
      pos="relative"
      direction="row"
      _hover={{ bg: hoverBg }}
      transition="all 0.2s"
      rounded="xl"
      p={3}
      gap={3}
      overflow="hidden"
    >
      {mentioned && (
        <Box bg={brand} pos="absolute" top={0} left={0} w={1} h="full" />
      )}
      <MemberPopup user={author.id} group={message.group}>
        <Avatar
          cursor="pointer"
          name={author.username}
          src={author.avatarUrl}
        />
      </MemberPopup>
      <Flex
        direction="column"
        align="start"
        ml={2}
        flex={1}
        w={0}
        wordBreak="break-word"
      >
        <HStack>
          <Text fontWeight="bold" fontSize="lg">
            {author.username}
          </Text>
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
  );
}

export function MessageItemSkeleton(props: { noOfLines: number }) {
  return (
    <Flex direction="row" p={7} transition="all 0.2s" rounded="xl">
      <SkeletonCircle w="50px" h="50px" />
      <Flex
        direction="column"
        align="start"
        ml={2}
        gap={5}
        w="full"
        maxW="500px"
      >
        <SkeletonText w="46%" noOfLines={1} />
        <SkeletonText w="full" noOfLines={props.noOfLines} />
      </Flex>
    </Flex>
  );
}
