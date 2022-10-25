import { Flex, HStack, IconButton, Input } from '@chakra-ui/react';
import { sendMessage, Snowflake } from '@omagize/api';
import { useState } from 'react';
import Card from '../../../../components/card/Card';
import { FiFile, FiSend } from 'react-icons/fi';
import { GrEmoji } from 'react-icons/gr';
import { useMutation } from '@tanstack/react-query';
import useFilePicker from 'components/picker/FilePicker';
import { FileUploadItem } from './FileUploadItem';
import { CustomCardProps } from 'theme/theme';

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
  const sendMutation = useMutation(['send_message', group], () =>
    sendMessage(group, content.message, content.attachments)
  );
  const send = () => {
    setContent({
      message: '',
      attachments: [],
    });

    return sendMutation.mutate();
  };

  const canSend =
    (content.attachments.length !== 0 || content.message.length !== 0) &&
    !sendMutation.isLoading;

  return (
    <Flex direction="column" w="full">
      <HStack w="full" mb="10px" overflow="auto">
        {content.attachments.map((a, i) => (
          <FileUploadItem
            key={`${i}-${a.webkitRelativePath}`}
            file={a}
            onRemove={() =>
              setContent((prev) => ({
                ...prev,
                attachments: prev.attachments.filter((file) => file !== a),
              }))
            }
            card={{
              flexShrink: 0,
            }}
          />
        ))}
      </HStack>
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
        <Input
          value={content.message}
          onChange={(e) =>
            setContent((prev) => ({ ...prev, message: e.target.value }))
          }
          rounded="full"
          variant="message"
          placeholder="Input your message here..."
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
