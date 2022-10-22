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
      <Flex direction="column" align="start" ml={2}>
        <HStack>
          <Text fontWeight="bold" fontSize="lg">
            {author.username}
          </Text>
          <Text textColor={secondaryText}>
            - {message.timestamp.toLocaleTimeString()}
          </Text>
        </HStack>

        <Text>{message.content}</Text>

        <HStack wrap="wrap" spacing={0} gap={2}>
          {message.attachments.map((a) => (
            <AttachmentItem key={a.id} attachment={a} />
          ))}
        </HStack>
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
