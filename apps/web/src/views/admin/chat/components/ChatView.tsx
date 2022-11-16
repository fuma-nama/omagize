import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { Message, Snowflake, useInfiniteMessageQuery } from '@omagize/api';
import { createContext, useContext, useRef } from 'react';
import MessageItem, { MessageItemSkeleton } from 'components/card/chat/MessageItem';
import { SmallErrorPanel as ErrorPanel } from 'components/panel/ErrorPanel';
import { InputProvider, MessageBar } from './MessageBar';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { LegacyRef } from 'react';
import { useColors } from 'variables/colors';
import { BiMessageX } from 'react-icons/bi';
import React from 'react';
import { parseError } from 'utils/APIUtils';

function mapPage(messages: Message[]) {
  return messages.map((message) => <MessageItem key={message.id} message={message} />);
}

export const MessageContext = createContext<MessageProvider>(undefined);
export function useMessageProvider(): MessageProvider {
  return useContext(MessageContext);
}

export interface MessageProvider {
  useInput: () => InputProvider;
  channel: Snowflake;
}

export default function ChatView({ provider }: { provider: MessageProvider }) {
  return (
    <MessageContext.Provider value={provider}>
      <Flex pos="relative" h="full" direction="column">
        <Box flex={1} h={0}>
          <MessageView channel={provider.channel} />
        </Box>

        <Box w="full" p={{ '3sm': 4 }} pt={{ '3sm': 0 }}>
          <MessageBar
            provider={provider}
            messageBar={{
              gap: { base: 1, '3sm': 2 },
              rounded: { base: 'none', '3sm': 'xl' },
            }}
          />
        </Box>
      </Flex>
    </MessageContext.Provider>
  );
}

export function MessageView({ channel }: { channel: string }) {
  const { data, error, isError, fetchPreviousPage, hasPreviousPage, isLoading, refetch } =
    useInfiniteMessageQuery(channel);
  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasPreviousPage,
    onLoadMore: () => fetchPreviousPage(),
    disabled: isError,
    rootMargin: '0px 0px 0px 0px',
  });
  const { endMessage, rootRefSetter, handleRootScroll } = useBottomScroll(rootRef, data?.pages);

  if (error) {
    return <ErrorPanel error={parseError(error, 'Failed to read messages')} retry={refetch} />;
  }

  const items = data?.pages.flatMap((a) => mapPage(a)) ?? [];
  return (
    <Box
      w="full"
      h="full"
      px={{ base: 0, '3sm': 5 }}
      overflow="auto"
      ref={rootRefSetter}
      onScroll={handleRootScroll}
    >
      <Flex direction="column" gap={5}>
        {hasPreviousPage || isLoading ? <LoadingBlock sentryRef={sentryRef} /> : <StartBox />}
        {items}
        <Box ref={endMessage} />
      </Flex>
    </Box>
  );
}

function StartBox() {
  const { textColorPrimary, textColorSecondary, brand } = useColors();
  return (
    <Box px={3}>
      <Text fontSize={24} fontWeight="600" color={textColorPrimary}>
        This is the Start of the Chat!
        <Icon as={BiMessageX} w={10} h={10} ml={1} color={brand} />
      </Text>
      <Text color={textColorSecondary}>Yayyyyyy</Text>
    </Box>
  );
}

function useBottomScroll(rootRef: (e: HTMLDivElement) => void, dependencies: React.DependencyList) {
  const scrollableRootRef = React.useRef<HTMLDivElement | null>(null);
  const lastScrollDistanceToBottomRef = React.useRef<number>();

  React.useEffect(() => {
    const scrollableRoot = scrollableRootRef.current;
    const lastScrollDistanceToBottom = lastScrollDistanceToBottomRef.current ?? 0;
    if (scrollableRoot) {
      scrollableRoot.scrollTop = scrollableRoot.scrollHeight - lastScrollDistanceToBottom;
    }
  }, [dependencies, rootRef]);

  const rootRefSetter = React.useCallback(
    (node: HTMLDivElement) => {
      rootRef(node);
      scrollableRootRef.current = node;
    },
    [rootRef]
  );

  const handleRootScroll = React.useCallback(() => {
    const rootNode = scrollableRootRef.current;
    if (rootNode) {
      const scrollDistanceToBottom = rootNode.scrollHeight - rootNode.scrollTop;
      lastScrollDistanceToBottomRef.current = scrollDistanceToBottom;
    }
  }, []);
  const endMessage = useRef<HTMLDivElement>();

  const scroll = () => {
    endMessage.current?.scrollIntoView();
  };

  return { endMessage, scroll, rootRefSetter, handleRootScroll };
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
