import { Box, Flex } from '@chakra-ui/react';
import { Message, useInfiniteMessageQuery } from '@omagize/api';
import { useContext, useRef } from 'react';
import { PageContext } from '../../../../contexts/PageContext';
import MessageItem, {
  MessageItemSkeleton,
} from 'components/card/chat/MessageItem';
import ErrorPanel from '../../../../components/card/ErrorPanel';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect } from 'react';
import { MessageBar } from './MessageBar';

function mapPage(messages: Message[]) {
  return messages.map((message) => (
    <MessageItem key={message.id} message={message} />
  ));
}

export default function ChatView() {
  const { selectedGroup } = useContext(PageContext);
  const {
    data,
    error,
    fetchPreviousPage,
    hasPreviousPage,
    isLoading,
    refetch,
  } = useInfiniteMessageQuery(selectedGroup);

  const { endMessage } = useBottomScroll(data?.pages);

  if (error) {
    return <ErrorPanel error={error} retry={refetch} />;
  }

  const items = data?.pages.flatMap((a) => mapPage(a)) ?? [];

  return (
    <Box h="full" overflow="auto" id="chat_view">
      <InfiniteScroll
        dataLength={items.length}
        next={() => !isLoading && fetchPreviousPage()}
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: '20px',
          padding: '0px 20px',
        }}
        inverse={true}
        hasMore={hasPreviousPage}
        loader={<LoadingBlock />}
        scrollableTarget="chat_view"
      >
        <Box ref={endMessage} />

        {items.reverse()}
      </InfiniteScroll>
      <Box
        position="sticky"
        bottom={0}
        w="full"
        px={{ '3sm': 4 }}
        pb={{ '3sm': 4 }}
      >
        <MessageBar group={selectedGroup} />
      </Box>
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

function LoadingBlock(props: {}) {
  return (
    <Flex gap={2} direction="column">
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
