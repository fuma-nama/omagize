import React, { useState, ReactNode } from 'react';
import { Avatar, Box, HStack, Icon, Portal, Text } from '@chakra-ui/react';
import CustomCard from '../../card/Card';
import { useColors, useItemHoverBg } from 'variables/colors';
import { EveryoneSuggestion, MentionSuggestion } from 'utils/markdown/mention';
import { BsPeopleFill } from 'react-icons/bs';
import { SuggestionControl } from '../editor';
import { CustomCardProps } from 'theme/theme';
import { MentionType } from 'utils/markdown/types';
import { Descendant, Editor } from 'slate';
import { SuggestionSearch, useSuggestions } from './suggestions';

export type SuggestionProps = {
  portal?: React.RefObject<HTMLElement | null>;
  onSearch: (value: string) => void;
  suggestions?: MentionSuggestion[];
};

export type MessageInputProps = {
  mentionSuggestions: SuggestionProps;
};

export function useMessageInputPlugin(editor: Editor, props: SuggestionProps) {
  const [selected, setSelected] = useState<number>();
  const [mention, setMention] = useState<SuggestionSearch>();
  const mentionSuggestions = useSuggestions(editor, [mention, setMention]);

  const suggestions = [...props.suggestions];
  if ('everyone'.startsWith(mention?.text.toLowerCase())) {
    suggestions.push(EveryoneSuggestion);
  }

  const suggestionControl: SuggestionControl = {
    selected,
    setSelected,
    length: suggestions.length,
    accept(state) {
      const selected = suggestions[state.selected];

      if (selected == null) return;
      state.acceptMention(selected);
    },
    render: (state) => (
      <Portal containerRef={props.portal}>
        <Suggestions>
          {suggestions.map((s, i) => (
            <Entry
              key={s.id}
              mention={s}
              selected={i === state.selected}
              onClick={() => state.acceptMention(s)}
            />
          ))}
        </Suggestions>
      </Portal>
    ),
  };

  return {
    onChange: (v: Descendant[]) => {
      const search = mentionSuggestions.updateSearch();
      if (search == null) return;

      setSelected(0);
      props.onSearch(search.text);
    },
    suggestions: mentionSuggestions,
    suggestionControl,
  };
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

function Entry({
  mention,
  selected,
  ...props
}: { mention: MentionSuggestion; selected: boolean } & CustomCardProps) {
  const type = (mention as MentionSuggestion).type;
  const hoverBg = useItemHoverBg();
  let content;

  switch (type) {
    case MentionType.Everyone:
      content = (
        <>
          <Icon as={BsPeopleFill} />
          <Text>Everyone</Text>
        </>
      );
      break;
    default:
      content = (
        <>
          <Avatar src={mention.avatar} />
          <Text fontWeight="bold">{mention.name}</Text>
        </>
      );
      break;
  }

  return (
    <CustomCard cursor="pointer" p={2} {...(selected && hoverBg)} {...props}>
      <HStack>{content}</HStack>
    </CustomCard>
  );
}
