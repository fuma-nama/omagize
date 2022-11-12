import { Box, Flex } from '@chakra-ui/react';
import { useSelected } from 'utils/navigate';
import { useInfiniteMessageQuery } from '@omagize/api';
import MessageItem, {
  MessageItemSkeleton,
} from 'components/card/chat/MessageItem';
import { QueryErrorPanel } from 'components/panel/ErrorPanel';
import { Holder } from 'components/layout/Container';

export function MessagesPreview() {
  const { selectedGroup } = useSelected();
  const query = useInfiniteMessageQuery(selectedGroup);

  if (query.error) {
    return (
      <Box flexGrow={1}>
        <QueryErrorPanel query={query} />
      </Box>
    );
  }

  return (
    <Flex direction="column-reverse" maxH="1000px" overflow="auto" gap={5}>
      <Holder
        isLoading={query.isLoading}
        skeleton={
          <>
            <MessageItemSkeleton noOfLines={4} />
            <MessageItemSkeleton noOfLines={2} />
            <MessageItemSkeleton noOfLines={6} />
            <MessageItemSkeleton noOfLines={1} />
          </>
        }
      >
        {() => {
          const pages = query.data.pages;
          const lastPage = pages[pages.length - 1];

          return lastPage
            .slice(lastPage.length - 8, lastPage.length - 1)
            .map((message) => (
              <MessageItem key={message.id} message={message} />
            ));
        }}
      </Holder>
    </Flex>
  );
}
