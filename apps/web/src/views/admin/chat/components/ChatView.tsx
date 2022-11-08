import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { Message, useInfiniteMessageQuery } from '@omagize/api';
import { useContext, useRef } from 'react';
import { PageContext } from 'contexts/PageContext';
import MessageItem, {
  MessageItemSkeleton,
} from 'components/card/chat/MessageItem';
import ErrorPanel from 'components/card/ErrorPanel';
import { useEffect } from 'react';
import { MessageBar } from './MessageBar';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { LegacyRef } from 'react';
import { useColors } from 'variables/colors';
import { BiMessageX } from 'react-icons/bi';

function mapPage(messages: Message[]) {
  return messages.map((message) => (
    <MessageItem key={message.id} message={message} />
  ));
}

export default function ChatView() {
  const { selectedGroup } = useContext(PageContext);

  return (
    <Flex pos="relative" h="full" direction="column">
      <Box flex={1} h={0}>
        <MessageView group={selectedGroup} />
      </Box>

      <Box w="full" p={{ '3sm': 4 }} pt={{ '3sm': 0 }}>
        <MessageBar
          group={selectedGroup}
          messageBar={{
            gap: { base: 1, '3sm': 2 },
            rounded: { base: 'none', '3sm': 'xl' },
          }}
        />
      </Box>
    </Flex>
  );
}

function MessageView({ group }: { group: string }) {
  const {
    data,
    error,
    isError,
    fetchPreviousPage,
    hasPreviousPage,
    isLoading,
    refetch,
  } = useInfiniteMessageQuery(group);
  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasPreviousPage,
    onLoadMore: () => fetchPreviousPage(),
    disabled: isError,
    rootMargin: '0px 0px 0px 0px',
  });
  const { endMessage } = useBottomScroll(data?.pages);

  if (error) {
    return <ErrorPanel error={error} retry={refetch} />;
  }

  const items = data?.pages.flatMap((a) => mapPage(a)) ?? [];
  return (
    <Box w="full" h="full" overflow="auto" ref={rootRef}>
      <Flex direction="column" px="20px" gap={5}>
        {hasPreviousPage || isLoading ? (
          <LoadingBlock sentryRef={sentryRef} />
        ) : (
          <StartBox />
        )}
        {items}
        <Box ref={endMessage} />
      </Flex>
    </Box>
  );
}

function StartBox() {
  const { textColorPrimary, textColorSecondary, brand } = useColors();
  return (
    <Box>
      <Text fontSize={24} fontWeight="600" color={textColorPrimary}>
        This is the Start of the Chat!
        <Icon as={BiMessageX} w={10} h={10} ml={1} color={brand} />
      </Text>
      <Text color={textColorSecondary}>Yayyyyyy</Text>
    </Box>
  );
}

function useBottomScroll(dependencies: React.DependencyList) {
  const endMessage = useRef<HTMLDivElement>();

  const scroll = () => {
    endMessage.current?.scrollIntoView();
  };

  useEffect(() => {
    console.log('scroll!');
    scroll();
  }, [dependencies]);

  return { endMessage, scroll };
}

function LoadingBlock({ sentryRef }: { sentryRef: LegacyRef<HTMLDivElement> }) {
  return (
    <Flex gap={2} direction="column" ref={sentryRef}>
      <MessageItemSkeleton noOfLines={2} />
      <MessageItemSkeleton noOfLines={1} />
      <MessageItemSkeleton noOfLines={6} />
      <MessageItemSkeleton noOfLines={3} />
      <MessageItemSkeleton noOfLines={2} />
      <MessageItemSkeleton noOfLines={4} />
      <MessageItemSkeleton noOfLines={1} />
      <MessageItemSkeleton noOfLines={6} />
    </Flex>
  );
}
