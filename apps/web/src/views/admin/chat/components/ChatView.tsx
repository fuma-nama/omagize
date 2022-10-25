import { Box, Flex, Text } from '@chakra-ui/react';
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
    fetchPreviousPage,
    hasPreviousPage,
    isLoading,
    refetch,
  } = useInfiniteMessageQuery(group);
  const { endMessage } = useBottomScroll(data?.pages);

  if (error) {
    return <ErrorPanel error={error} retry={refetch} />;
  }

  const items = data?.pages.flatMap((a) => mapPage(a)) ?? [];
  return (
    <Box w="full" h="full" overflow="auto" id="chat_view">
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
        endMessage={
          <Box>
            <Text fontSize="sm" fontWeight="600">
              This is the Start of the Chat!
            </Text>
            <Text>Yayyyyyy</Text>
          </Box>
        }
        hasMore={hasPreviousPage}
        loader={<LoadingBlock />}
        scrollableTarget="chat_view"
      >
        <Box ref={endMessage} />

        {items.reverse()}
      </InfiniteScroll>
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
