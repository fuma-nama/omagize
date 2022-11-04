import { EditorState, EditorProps } from 'draft-js';
import TextEditor from './editor/TextEditor';
import createMentionPlugin, { MentionData } from '@draft-js-plugins/mention';
import React, { useState, ReactNode, useMemo } from 'react';
import { EntryComponentProps } from '@draft-js-plugins/mention/lib/MentionSuggestions/Entry/Entry';
import { Avatar, Box, HStack, Portal, Text } from '@chakra-ui/react';
import CustomCard, { CardButton } from '../card/Card';
import { SubMentionComponentProps } from '@draft-js-plugins/mention/lib/Mention';
import { useColors } from '../../variables/colors';

function usePlugins() {
  return useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      entityMutability: 'IMMUTABLE',
      supportWhitespace: true,
      mentionComponent: Mention,
    });

    return { mention: mentionPlugin };
  }, []);
}

export type SuggestionProps = {
  portal?: React.RefObject<HTMLElement | null>;
  onSearch: (value: string) => void;
  suggestions?: MentionData[];
};

export type MessageInputProps = {
  value: EditorState;
  onChange: (next: EditorState) => void;
  editor?: Partial<EditorProps>;
  mentionSuggestions: SuggestionProps;
};
/**
 * Input field that Supports mentions, markdown, suggestions
 */
export default function MessageInput({
  value,
  onChange,
  editor,
  mentionSuggestions,
}: MessageInputProps) {
  const { mention } = usePlugins();
  const [open, setOpen] = useState(false);
  const onSearchChange = ({ value }: { value: string }) => {
    mentionSuggestions.onSearch(value);
  };

  return (
    <>
      <TextEditor
        editorState={value}
        onChange={onChange}
        plugins={[mention]}
        {...editor}
        box={{
          w: 'full',
        }}
      />
      <mention.MentionSuggestions
        open={open}
        onOpenChange={setOpen}
        suggestions={mentionSuggestions.suggestions ?? []}
        onSearchChange={onSearchChange}
        onAddMention={() => {
          // get the mention object selected
        }}
        entryComponent={Entry}
        popoverContainer={({ children }) => (
          <Portal containerRef={mentionSuggestions.portal}>
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
      as="span"
      bg={brand}
      rounded="full"
      color="white"
      px={2}
      py={1}
      fontWeight="600"
      display="inline-flex"
      fontSize="sm"
      cursor="pointer"
      className={props.className}
    >
      <Avatar src={avatar} w={5} h={5} name={name} />
      {props.children}
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
    selectMention,
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
