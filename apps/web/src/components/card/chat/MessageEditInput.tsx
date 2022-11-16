import { editMessage, EditMessageBody, Message } from '@omagize/api';
import { Box, Button, ButtonGroup, Flex } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useMutation } from '@tanstack/react-query';
import { useMessageProvider } from 'views/admin/chat/components/ChatView';
import MessageInput from 'components/editor/MessageInput';
import { useRef, useState } from 'react';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import { parseDraft } from 'utils/markdown/parser';

export function MessageEditInput({ message, onClose }: { message: Message; onClose: () => void }) {
  const input = useMessageProvider().useInput();
  const suggestionRef = useRef();
  const [value, setValue] = useState(
    EditorState.createWithContent(ContentState.createFromText(message.content))
  );
  const editMutation = useMutation(
    (body: EditMessageBody) => editMessage(message.id, message.channel, body),
    {
      onSuccess: onClose,
    }
  );

  const onSave = () => {
    const parsed = parseDraft(convertToRaw(value.getCurrentContent()));

    editMutation.mutate({
      content: parsed.markdown,
      mentions: parsed.mentions,
    });
  };

  return (
    <Flex direction="column" gap={2} w="full">
      <Box ref={suggestionRef} w="full" />
      <MessageInput
        value={value}
        onChange={(v) => setValue(v)}
        editor={{
          placeholder: 'Input your message here...',
        }}
        mentionSuggestions={{
          portal: suggestionRef,
          onSearch: input.setSearch,
          suggestions: input.suggestions,
        }}
      />
      <ButtonGroup>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="action"
          leftIcon={<EditIcon />}
          isLoading={editMutation.isLoading}
          onClick={onSave}
        >
          Edit
        </Button>
      </ButtonGroup>
    </Flex>
  );
}
