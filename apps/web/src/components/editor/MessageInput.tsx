import { EditorState, EditorProps } from 'draft-js';
import TextEditor from './TextEditor';
import createMentionPlugin from '@draft-js-plugins/mention';
import React, { useState, ReactNode, useMemo } from 'react';
import { EntryComponentProps } from '@draft-js-plugins/mention/lib/MentionSuggestions/Entry/Entry';
import { Avatar, Box, HStack, Icon, Portal, Text } from '@chakra-ui/react';
import CustomCard, { CardButton } from '../card/Card';
import { SubMentionComponentProps } from '@draft-js-plugins/mention/lib/Mention';
import { useColors } from '../../variables/colors';
import { Everyone, MarkdownPlugin, MentionData } from './MarkdownPlugin';
import { EveryoneMention, MentionEntity } from 'components/editor/entities';
import { BsPeopleFill } from 'react-icons/bs';

export type SuggestionProps = {
  portal?: React.RefObject<HTMLElement | null>;
  onSearch: (value: string) => void;
  suggestions?: MentionData[];
};

export type MessageInputProps = ValueProps & {
  editor?: Partial<EditorProps>;
  mentionSuggestions: SuggestionProps;
};

export type ValueProps = {
  value: EditorState;
  onChange: (next: EditorState) => void;
};

function usePlugins() {
  return useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      entityMutability: 'IMMUTABLE',
      mentionComponent: Mention,
    });

    return { mention: mentionPlugin, markdown: MarkdownPlugin };
  }, []);
}

/**
 * Input field that Supports mentions, markdown, suggestions
 */
export default function MessageInput({
  value,
  onChange,
  editor,
  mentionSuggestions,
}: MessageInputProps) {
  const { mention, markdown } = usePlugins();
  const [open, setOpen] = useState(false);
  const onSearchChange = ({ value }: { value: string }) => {
    mentionSuggestions.onSearch(value);
  };

  return (
    <>
      <TextEditor
        editorState={value}
        onChange={onChange}
        plugins={[mention, markdown]}
        {...editor}
        box={{
          w: 'full',
          minWidth: 0,
        }}
      />
      <mention.MentionSuggestions
        open={open}
        onOpenChange={setOpen}
        suggestions={[...(mentionSuggestions.suggestions ?? []), Everyone]}
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
  const mention = props.mention as MentionData;

  switch (mention.type) {
    case 'everyone':
      return <EveryoneMention>{props.children}</EveryoneMention>;
    default:
      return (
        <MentionEntity name={props.children} className={props.className} />
      );
  }
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
  const type = (props.mention as MentionData).type;

  switch (type) {
    case 'everyone':
      return (
        <CardButton {...parentProps} p={2}>
          <HStack>
            <Icon as={BsPeopleFill} />
            <Text>Everyone</Text>
          </HStack>
        </CardButton>
      );
    default:
      return (
        <CardButton {...parentProps} p={2}>
          <HStack>
            <Avatar src={mention.avatar} />
            <Text fontWeight="bold">{mention.name}</Text>
          </HStack>
        </CardButton>
      );
  }
}
