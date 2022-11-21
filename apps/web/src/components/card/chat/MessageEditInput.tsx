import { editMessage, EditMessageBody, Message } from '@omagize/api';
import { Box, Button, ButtonGroup, Flex } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useMutation } from '@tanstack/react-query';
import { useMessageProvider } from 'views/admin/chat/components/ChatView';
import { useMemo, useRef, useState } from 'react';
import { useMessageInputPlugin } from 'components/editor/plugins/plugins';
import { createSlateEditor, SlateEditor } from 'components/editor/editor';
import { Descendant } from 'slate';
import { slateToMarkdown } from 'components/editor/markdown';
import { Slate } from 'slate-react';

export function MessageEditInput({ message, onClose }: { message: Message; onClose: () => void }) {
  const editor = useMemo(() => createSlateEditor(), []);
  const input = useMessageProvider().useInput();
  const suggestionRef = useRef();
  const plugin = useMessageInputPlugin(editor, {
    portal: suggestionRef,
    onSearch: input.setSearch,
    suggestions: input.suggestions,
  });
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: message.content }],
    },
  ]);
  const editMutation = useMutation(
    (body: EditMessageBody) => editMessage(message.id, message.channel, body),
    {
      onSuccess: onClose,
    }
  );

  const onSave = () => {
    const parsed = slateToMarkdown(editor);

    editMutation.mutate({
      content: parsed.markdown,
      mentions: parsed.mentions,
    });
  };

  return (
    <Flex direction="column" gap={2} w="full">
      <Box ref={suggestionRef} w="full" />
      <Slate
        editor={editor}
        value={value}
        onChange={(v) => {
          setValue(v);
          plugin.onChange(v);
        }}
      >
        <SlateEditor
          suggestions={plugin.suggestions}
          suggestionControl={plugin.suggestionControl}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onClose();
              e.stopPropagation();
              e.preventDefault();
            }
          }}
        />
      </Slate>
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
