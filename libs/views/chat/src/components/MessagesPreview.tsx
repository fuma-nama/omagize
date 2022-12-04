import { Flex } from '@chakra-ui/react';
import { Message, Snowflake } from '@omagize/api';
import { useInfiniteMessageQuery } from '@omagize/data-access-api';
import { QueryStatus } from '@omagize/ui/components';
import { useMemo } from 'react';
import { MessageItemSkeleton, MessageItem } from './items';

export function MessagesPreview({ channel, limit }: { channel: Snowflake; limit: number }) {
  const query = useInfiniteMessageQuery(channel);
  const pages = query.data?.pages;
  const messages = useMemo(() => {
    if (pages == null) return null;
    const items: Message[] = [];

    for (const page of pages) {
      for (const message of page) {
        if (items.length > limit) break;

        items.push(message);
      }
    }
    return items;
  }, [pages, limit]);

  return (
    <Flex direction="column-reverse" maxH="1000px" overflow="auto" gap={5}>
      <QueryStatus
        query={query}
        loading={
          <>
            <MessageItemSkeleton noOfLines={4} />
            <MessageItemSkeleton noOfLines={2} />
            <MessageItemSkeleton noOfLines={6} />
            <MessageItemSkeleton noOfLines={1} />
          </>
        }
        error="Failed to load messages"
      >
        {messages?.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </QueryStatus>
    </Flex>
  );
}
