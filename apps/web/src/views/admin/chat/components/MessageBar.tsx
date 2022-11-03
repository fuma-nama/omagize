import { Box, Flex, HStack, IconButton } from '@chakra-ui/react';
import { sendMessage, Snowflake } from '@omagize/api';
import { useRef, useState } from 'react';
import Card from '../../../../components/card/Card';
import { FiFile, FiSend } from 'react-icons/fi';
import { GrEmoji } from 'react-icons/gr';
import { useMutation } from '@tanstack/react-query';
import useFilePicker from 'components/picker/FilePicker';
import { FileUploadItem } from './FileUploadItem';
import { CustomCardProps } from 'theme/theme';
import MessageInput from 'components/fields/MessageInput';

export type MessageOptions = {
  message: string;
  attachments: File[];
};

export function MessageBar({
  group,
  messageBar,
}: {
  group: Snowflake;
  messageBar?: CustomCardProps;
}) {
  const suggestionRef = useRef<HTMLDivElement>();
  const [content, setContent] = useState<MessageOptions>({
    message: '',
    attachments: [],
  });

  const picker = useFilePicker((f) =>
    setContent((prev) => ({
      ...prev,
      attachments: [...prev.attachments, f],
    }))
  );
  const sendMutation = useSendMutation(group);

  const send = () => {
    sendMutation.mutate(content);

    setContent({
      message: '',
      attachments: [],
    });
  };

  const canSend =
    (content.attachments.length !== 0 || content.message.length !== 0) &&
    !sendMutation.isLoading;

  return (
    <Flex direction="column" w="full" gap={2}>
      <Attachments
        value={content.attachments}
        onRemove={(f) =>
          setContent((prev) => ({
            ...prev,
            attachments: prev.attachments.filter((file) => file !== f),
          }))
        }
      />
      <Box ref={suggestionRef} />
      <Card
        flexDirection="row"
        alignItems="center"
        gap={2}
        px={{ base: 2, md: '20px' }}
        {...messageBar}
      >
        {picker.component}
        <IconButton
          aria-label="add-file"
          icon={<FiFile />}
          onClick={picker.pick}
        />
        <IconButton aria-label="add-emoji" icon={<GrEmoji />} />
        <MessageInput
          editor={{
            placeholder: 'Input your message here...',
          }}
          suggestionPortal={suggestionRef}
        />
        <IconButton
          onClick={send}
          isLoading={sendMutation.isLoading}
          disabled={!canSend}
          variant="brand"
          aria-label="send"
          icon={<FiSend />}
        />
      </Card>
    </Flex>
  );
}

function Attachments(props: {
  value: File[];
  onRemove: (remove: File) => void;
}) {
  const { value, onRemove } = props;

  return (
    <HStack w="full" overflow="auto">
      {value.map((a, i) => (
        <FileUploadItem
          key={`${i}-${a.webkitRelativePath}`}
          file={a}
          onRemove={() => onRemove(a)}
          card={{
            flexShrink: 0,
          }}
        />
      ))}
    </HStack>
  );
}

function useSendMutation(group: Snowflake) {
  return useMutation(['send_message', group], (content: MessageOptions) =>
    sendMessage(group, content.message, content.attachments)
  );
}

/*
value: content.message,
            onChange: (e) => {
              setContent((prev) => ({ ...prev, message: e.target.value }));
            },
            variant: 'message',
*/
