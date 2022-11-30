import { Flex } from '@chakra-ui/react';
import { Message, Snowflake, useInfiniteMessageQuery } from '@omagize/api';
import MessageItem, { MessageItemSkeleton } from 'components/card/chat/MessageItem';
import { QueryStatus } from 'components/panel/QueryPanel';
import { useMemo } from 'react';

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

  console.log(messages);
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
          <MessageItem message={message} />
        ))}
      </QueryStatus>
    </Flex>
  );
}
