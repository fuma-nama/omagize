import { Box, Flex, HStack, IconButton, SlideFade, useDisclosure } from '@chakra-ui/react';
import { sendMessage, Snowflake } from '@omagize/api';
import { RefObject, useRef, useState } from 'react';
import Card from 'components/card/Card';
import { FiFile, FiSend } from 'react-icons/fi';
import { GrEmoji } from 'react-icons/gr';
import { useMutation } from '@tanstack/react-query';
import useFilePicker from 'components/picker/FilePicker';
import { FileUploadItem } from './FileUploadItem';
import { CustomCardProps } from 'theme/theme';
import { useMessageInputPlugin } from 'components/editor/plugins/plugins';
import { Toolbar } from 'components/editor/Toolbar';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { MessageProvider } from './ChatView';
import { MentionData } from 'utils/markdown/mention';
import { Descendant, Editor, Transforms } from 'slate';
import { isEmpty, slateToMarkdown } from 'components/editor/markdown';
import { createSlateEditor, initialValue, SlateEditor } from 'components/editor/editor';
import { ReactEditor, Slate } from 'slate-react';
import EmojiPicker from 'components/picker/emoji';
import { PopoverTrigger } from 'components/PopoverTrigger';

export interface InputProvider {
  search: string;
  setSearch: (search: string) => void;
  suggestions: MentionData[];
}

export type MessageOptions = {
  editor: Editor;
  message: Descendant[];
  attachments: File[];
};

function useOptionState() {
  const [content, setContent] = useState<MessageOptions>(() => ({
    editor: createSlateEditor(),
    message: initialValue,
    attachments: [],
  }));

  return {
    content,
    setContent,
    resetContent: () => {
      setContent((prev) => {
        Transforms.select(prev.editor, Editor.start(prev.editor, []));
        prev.editor.children = initialValue;

        return {
          editor: prev.editor,
          message: prev.editor.children,
          attachments: [],
        };
      });
    },
    dispatch: (v: (prev: MessageOptions) => Partial<MessageOptions>) => {
      return setContent((prev) => ({ ...prev, ...v(prev) }));
    },
  };
}

export function MessageBar({
  provider,
  messageBar,
}: {
  provider: MessageProvider;
  messageBar?: CustomCardProps;
}) {
  const { content, resetContent, dispatch } = useOptionState();
  const suggestionRef = useRef<HTMLDivElement>();
  const sendMutation = useSendMutation(provider.channel);
  const picker = useFilePicker((f) =>
    dispatch((prev) => ({
      attachments: [...prev.attachments, f],
    }))
  );

  const send = async () => {
    await sendMutation.mutateAsync(content);
    resetContent();
  };

  const canSend =
    (content.attachments.length !== 0 || !isEmpty(content.editor)) && !sendMutation.isLoading;

  return (
    <Flex pos="relative" direction="column" w="full" gap={2}>
      <Attachments
        value={content.attachments}
        onRemove={(f) =>
          dispatch((prev) => ({
            attachments: prev.attachments.filter((file) => file !== f),
          }))
        }
      />
      <Box ref={suggestionRef} />
      <Tools editor={content.editor} />
      <Card
        flexDirection="row"
        alignItems="center"
        gap={2}
        px={{ base: 2, md: '20px' }}
        {...messageBar}
      >
        {picker.component}
        <IconButton aria-label="add-file" icon={<FiFile />} onClick={picker.pick} />
        <EmojiPicker editor={content.editor}>
          <PopoverTrigger>
            <IconButton aria-label="add-emoji" icon={<GrEmoji />} />
          </PopoverTrigger>
        </EmojiPicker>
        <Input
          provider={provider}
          suggestionRef={suggestionRef}
          editor={content.editor}
          value={content.message}
          onChange={(v) => {
            dispatch(() => ({
              message: v,
            }));
          }}
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

function Tools({ editor }: { editor: Editor }) {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <HStack pos="absolute" maxW="full" h="50px" top="-50px" right={0}>
      <SlideFade in={isOpen} unmountOnExit>
        <Toolbar editor={editor} />
      </SlideFade>
      <IconButton
        icon={isOpen ? <ArrowDownIcon /> : <ArrowUpIcon />}
        onClick={onToggle}
        aria-label="open-toolbar"
        variant="ghost"
      />
    </HStack>
  );
}

function Input({
  editor,
  value,
  onChange,
  provider,
  suggestionRef,
}: {
  editor: Editor;
  value: Descendant[];
  onChange: (v: Descendant[]) => void;
  provider: MessageProvider;
  suggestionRef: RefObject<HTMLDivElement>;
}) {
  const input = provider.useInput();
  const plugin = useMessageInputPlugin(editor, {
    portal: suggestionRef,
    onSearch: input.setSearch,
    suggestions: input.suggestions,
  });

  return (
    <Slate
      value={value}
      onChange={(v) => {
        plugin.onChange(v);
        onChange(v);
      }}
      editor={editor}
    >
      <SlateEditor suggestions={plugin.suggestions} suggestionControl={plugin.suggestionControl} />
    </Slate>
  );
}

function Attachments(props: { value: File[]; onRemove: (remove: File) => void }) {
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

function useSendMutation(channel: Snowflake) {
  return useMutation(['send_message', channel], async (content: MessageOptions) => {
    const parsed = slateToMarkdown(content.editor);

    return await sendMessage(channel, parsed.markdown, content.attachments, parsed.mentions);
  });
}
