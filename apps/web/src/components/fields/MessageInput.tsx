import { EditorState, EditorProps } from 'draft-js';
import TextEditor from './editor/TextEditor';
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from '@draft-js-plugins/mention';
import { useState, useCallback, ReactNode } from 'react';
import { EntryComponentProps } from '@draft-js-plugins/mention/lib/MentionSuggestions/Entry/Entry';
import { Avatar, Box, HStack, Portal, Text } from '@chakra-ui/react';
import mentions from './editor/mentions';
import CustomCard, { CardButton } from '../card/Card';
import { SubMentionComponentProps } from '@draft-js-plugins/mention/lib/Mention';
import { useColors } from '../../variables/colors';

const mentionPlugin = createMentionPlugin({
  entityMutability: 'IMMUTABLE',
  supportWhitespace: true,
  mentionComponent: Mention,
});
const { MentionSuggestions } = mentionPlugin;
const plugins = [mentionPlugin];

export type MessageInputProps = {
  editor?: Partial<EditorProps>;
  suggestionPortal?: React.RefObject<HTMLElement | null>;
};
/**
 * Input field that Supports mentions, markdown, suggestions
 */
export default function MessageInput({
  editor,
  suggestionPortal,
}: MessageInputProps) {
  const [editorState, setEditorState] = useState<EditorState>(() =>
    EditorState.createEmpty()
  );
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(mentions);

  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open);
  }, []);
  const onSearchChange = useCallback(({ value }: { value: string }) => {
    setSuggestions(defaultSuggestionsFilter(value, mentions));
  }, []);
  console.log(editorState.values);

  return (
    <>
      <TextEditor
        editorState={editorState}
        onChange={setEditorState}
        plugins={plugins}
        {...editor}
        box={{
          w: 'full',
        }}
      />
      <MentionSuggestions
        open={open}
        onOpenChange={onOpenChange}
        suggestions={suggestions}
        onSearchChange={onSearchChange}
        onAddMention={() => {
          // get the mention object selected
        }}
        entryComponent={Entry}
        popoverContainer={({ children }) => (
          <Portal containerRef={suggestionPortal}>
            <Suggestions>{children}</Suggestions>
          </Portal>
        )}
      />
    </>
  );
}

function Mention(props: SubMentionComponentProps) {
  const { brand } = useColors();
  const name = props.mention.name;
  const avatar = props.mention.avatar;

  return (
    <HStack
      bg={brand}
      rounded="full"
      color="white"
      px={2}
      py={1}
      fontWeight="600"
      display="inline-flex"
      fontSize="sm"
      cursor="pointer"
    >
      <Avatar src={avatar} name={name} w={5} h={5} />
      <span>{name}</span>
    </HStack>
  );
}

function Suggestions({ children }: { children: ReactNode }) {
  const { textColorPrimary } = useColors();
  return (
    <CustomCard overflow="auto" maxH="400px" p={2} color={textColorPrimary}>
      <Box mx={4} my={1}>
        <Text fontWeight="600">Mention</Text>
      </Box>
      {children}
    </CustomCard>
  );
}

function Entry(props: EntryComponentProps) {
  const {
    mention,
    theme,
    searchValue, // eslint-disable-line @typescript-eslint/no-unused-vars
    isFocused, // eslint-disable-line @typescript-eslint/no-unused-vars
    ...parentProps
  } = props;

  return (
    <CardButton {...parentProps} p={2}>
      <HStack>
        <Avatar src={mention.avatar} />
        <Text>{mention.name}</Text>
      </HStack>
    </CardButton>
  );
}
