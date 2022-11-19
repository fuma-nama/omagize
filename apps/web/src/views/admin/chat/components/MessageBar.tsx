import { Box, Flex, HStack, IconButton, SlideFade, useDisclosure } from '@chakra-ui/react';
import { sendMessage, Snowflake } from '@omagize/api';
import { RefObject, useRef, useState } from 'react';
import Card from '../../../../components/card/Card';
import { FiFile, FiSend } from 'react-icons/fi';
import { GrEmoji } from 'react-icons/gr';
import { useMutation } from '@tanstack/react-query';
import useFilePicker from 'components/picker/FilePicker';
import { FileUploadItem } from './FileUploadItem';
import { CustomCardProps } from 'theme/theme';
import MessageInput, { ValueProps } from 'components/editor/MessageInput';
import { convertToRaw, EditorState } from 'draft-js';
import { Toolbar } from 'components/editor/Toolbar';
import { createDefault } from 'components/editor/TextEditor';
import { parseDraft } from 'utils/markdown/parser';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { MessageProvider } from './ChatView';
import { MentionData } from 'components/editor/MarkdownPlugin';

export interface InputProvider {
  search: string;
  setSearch: (search: string) => void;
  suggestions: MentionData[];
}

export type MessageOptions = {
  message: EditorState;
  attachments: File[];
};
function useOptionState() {
  const [content, setContent] = useState<MessageOptions>(() => ({
    message: createDefault(),
    attachments: [],
  }));

  return {
    content,
    setContent,
    resetContent: () =>
      setContent({
        attachments: [],
        message: createDefault(),
      }),
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
  const suggestionRef = useRef<HTMLDivElement>();
  const { content, resetContent, dispatch } = useOptionState();
  const { isOpen: showToolbar, onToggle: toggleToolbar } = useDisclosure();
  const sendMutation = useSendMutation(provider.channel);
  const picker = useFilePicker((f) =>
    dispatch((prev) => ({
      attachments: [...prev.attachments, f],
    }))
  );

  const send = () => {
    sendMutation.mutate(content);
    resetContent();
  };

  const canSend =
    (content.attachments.length !== 0 || !content.message.isEmpty) && !sendMutation.isLoading;

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
      <HStack pos="absolute" maxW="full" h="50px" top="-50px" right={0}>
        <SlideFade in={showToolbar} unmountOnExit>
          <Toolbar value={content.message} onChange={(m) => dispatch(() => ({ message: m }))} />
        </SlideFade>
        <IconButton
          icon={showToolbar ? <ArrowDownIcon /> : <ArrowUpIcon />}
          onClick={toggleToolbar}
          aria-label="open-toolbar"
          variant="ghost"
        />
      </HStack>

      <Card
        flexDirection="row"
        alignItems="center"
        gap={2}
        px={{ base: 2, md: '20px' }}
        {...messageBar}
      >
        {picker.component}
        <IconButton aria-label="add-file" icon={<FiFile />} onClick={picker.pick} />
        <IconButton aria-label="add-emoji" icon={<GrEmoji />} />
        <Input
          provider={provider}
          suggestionRef={suggestionRef}
          value={content.message}
          onChange={(v) =>
            dispatch(() => ({
              message: v,
            }))
          }
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

function Input({
  value,
  onChange,
  provider,
  suggestionRef,
}: ValueProps & {
  provider: MessageProvider;
  suggestionRef: RefObject<HTMLDivElement>;
}) {
  const input = provider.useInput();

  return (
    <MessageInput
      value={value}
      onChange={onChange}
      editor={{
        placeholder: 'Input your message here...',
      }}
      mentionSuggestions={{
        portal: suggestionRef,
        onSearch: input.setSearch,
        suggestions: input.suggestions,
      }}
    />
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
    const raw = convertToRaw(content.message.getCurrentContent());
    const parsed = parseDraft(raw);

    return await sendMessage(channel, parsed.markdown, content.attachments, parsed.mentions);
  });
}
