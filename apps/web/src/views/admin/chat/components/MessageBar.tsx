import { Box, Flex, HStack, IconButton, SlideFade, useDisclosure } from '@chakra-ui/react';
import { searchMembers, sendMessage, Snowflake } from '@omagize/api';
import { RefObject, useRef, useState } from 'react';
import Card from '../../../../components/card/Card';
import { FiFile, FiSend } from 'react-icons/fi';
import { GrEmoji } from 'react-icons/gr';
import { useMutation, useQuery } from '@tanstack/react-query';
import useFilePicker from 'components/picker/FilePicker';
import { FileUploadItem } from './FileUploadItem';
import { CustomCardProps } from 'theme/theme';
import MessageInput, { ValueProps } from 'components/editor/MessageInput';
import { convertToRaw, EditorState } from 'draft-js';
import { Toolbar } from '../../../../components/editor/Toolbar';
import { createDefault } from 'components/editor/TextEditor';
import { parseDraft } from 'utils/markdown/parser';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';

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
  channel,
  messageBar,
}: {
  channel: Snowflake;
  messageBar?: CustomCardProps;
}) {
  const suggestionRef = useRef<HTMLDivElement>();
  const { content, resetContent, dispatch } = useOptionState();
  const { isOpen: showToolbar, onToggle: toggleToolbar } = useDisclosure();
  const sendMutation = useSendMutation(channel);
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
          channel={channel}
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
  channel,
  onChange,
  suggestionRef,
}: ValueProps & {
  channel: Snowflake;
  suggestionRef: RefObject<HTMLDivElement>;
}) {
  const [search, setSearch] = useState<string | null>(null);
  const query = useQuery(
    ['search_member', channel, search],
    () => searchMembers(channel, search, 10),
    {
      enabled: search != null,
    }
  );

  return (
    <MessageInput
      value={value}
      onChange={onChange}
      editor={{
        placeholder: 'Input your message here...',
      }}
      mentionSuggestions={{
        portal: suggestionRef,
        onSearch: setSearch,
        suggestions: query.data?.map((member) => ({
          id: member.id,
          name: member.username,
          avatar: member.avatarUrl,
        })),
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
