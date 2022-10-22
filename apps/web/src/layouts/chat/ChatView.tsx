import { Box, Flex, IconButton, Input } from '@chakra-ui/react';
import {
  Message,
  sendMessage,
  Snowflake,
  useInfiniteMessageQuery,
} from '@omagize/api';
import { MutableRefObject, useContext, useMemo, useRef, useState } from 'react';
import { PageContext } from '../../contexts/PageContext';
import { useInView } from 'react-intersection-observer';
import MessageItem, {
  MessageItemSkeleton,
} from 'components/card/chat/MessageItem';
import ErrorPanel from '../../components/card/ErrorPanel';
import Card from '../../components/card/Card';
import { FiFile, FiSend } from 'react-icons/fi';
import { GrEmoji } from 'react-icons/gr';
import { useMutation } from '@tanstack/react-query';
import useFilePicker from 'components/picker/FilePicker';

export default function ChatView() {
  const { selectedGroup } = useContext(PageContext);

  const [ready, ref] = useBottomScroll();
  const {
    data,
    error,
    isLoading,
    fetchPreviousPage,
    hasPreviousPage,
    isFetching,
    refetch,
  } = useInfiniteMessageQuery(selectedGroup);

  function mapPage(messages: Message[]) {
    return messages.map((message) => (
      <MessageItem key={message.id} message={message} />
    ));
  }
  if (error) {
    return <ErrorPanel error={error} retry={refetch} />;
  }

  return (
    <Box overflow="auto" ref={ref}>
      <Flex direction="column-reverse" gap={5} px={4}>
        {data == null ? null : [].concat(...data.pages.map(mapPage)).reverse()}
        {(isLoading || hasPreviousPage) && (
          <LoadingBlock
            isFetching={isFetching || !ready}
            onFetch={() => fetchPreviousPage()}
          />
        )}
      </Flex>
      <Box position="sticky" bottom={0} w="full" p={{ '3sm': 4 }}>
        <MessageBar group={selectedGroup} />
      </Box>
    </Box>
  );
}

function MessageBar({ group }: { group: Snowflake }) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Blob[]>([]);
  const picker = useFilePicker((f) => setAttachments((prev) => [...prev, f]));
  const sendMutation = useMutation(['send_message', group], () =>
    sendMessage(group, message, attachments)
  );

  return (
    <Card
      w="full"
      flexDirection="row"
      alignItems="center"
      gap={{ base: 1, md: 2 }}
      px={{ base: 2, md: '20px' }}
    >
      {picker.component}
      <IconButton
        aria-label="add-file"
        icon={<FiFile />}
        onClick={picker.pick}
      />
      <IconButton aria-label="add-emoji" icon={<GrEmoji />} />
      <Input
        mx={{ md: 3 }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rounded="full"
        variant="message"
        placeholder="Input your message here..."
      />
      <IconButton
        onClick={() => sendMutation.mutate()}
        isLoading={sendMutation.isLoading}
        disabled={message.length === 0 || sendMutation.isLoading}
        variant="brand"
        aria-label="send"
        icon={<FiSend />}
      />
    </Card>
  );
}

function useBottomScroll(): [
  boolean,
  MutableRefObject<HTMLDivElement>,
  () => void
] {
  const ref = useRef<HTMLDivElement>();
  const scroll = () => {
    const element = ref.current;
    if (element) {
      element.scrollTo(element.scrollLeft, element.scrollHeight);
    }
  };
  const ready = useMemo<boolean>(() => {
    scroll();
    return !!ref.current;
  }, [ref.current]);

  return [ready, ref, scroll];
}

function LoadingBlock(props: { isFetching: boolean; onFetch: () => void }) {
  const { ref } = useInView({
    onChange(inView, entry) {
      if (inView && !props.isFetching) {
        props.onFetch();
      }
    },
  });
  return (
    <Flex gap={2} direction="column" ref={ref}>
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
