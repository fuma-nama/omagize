import { Message } from '@omagize/api';
import {
  Avatar,
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

export default function MessageItem({ message }: { message: Message }) {
  const author = message.author;
  const secondaryText = useColorModeValue('gray.400', 'white');
  const hoverBg = useColorModeValue('white', 'navy.800');

  return (
    <Flex
      direction="row"
      _hover={{ bg: hoverBg }}
      transition="all 0.2s"
      rounded="xl"
      p={3}
      gap={3}
    >
      <Avatar name={author.username} src={author.avatarUrl} />
      <Flex direction="column" align="start" ml={2} flex={1} w={0}>
        <HStack>
          <Text fontWeight="bold" fontSize="lg">
            {author.username}
          </Text>
          <Text textColor={secondaryText}>
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
