import React, { useState, ReactNode } from 'react';
import { Avatar, Box, HStack, Icon, Portal, Text } from '@chakra-ui/react';
import { EveryoneSuggestion, MentionSuggestion } from '@omagize/utils/markdown';
import { BsPeopleFill } from 'react-icons/bs';
import { SuggestionControl } from '../editor';
import { MentionType } from '@omagize/utils/markdown';
import { Descendant, Editor } from 'slate';
import { SuggestionSearch, useSuggestions } from './suggestions';
import { Card, CustomCardProps } from '@omagize/ui/components';
import { useColors, useItemHoverBg } from '@omagize/ui/theme';
import { useDebounce } from '@omagize/utils/common';

export type SuggestionProps = {
  portal?: React.RefObject<HTMLElement | null>;
  useQuery: (search: SuggestionSearch) => MentionSuggestion[];
};

export type MessageInputProps = {
  mentionSuggestions: SuggestionProps;
};

export function useMessageInputPlugin(editor: Editor, props: SuggestionProps) {
  const [selected, setSelected] = useState<number>();
  const [mention, setMention] = useState<SuggestionSearch>();
  //If empty, ignore the delay
  const empty = mention == null || mention.text.length === 0;
  const debouncedMention = useDebounce(mention, empty ? 0 : 500);
  let suggestions = props.useQuery(debouncedMention);

  const mentionSuggestions = useSuggestions(editor, [debouncedMention, setMention]);
  if ('everyone'.startsWith(mention?.text.toLowerCase())) {
    suggestions = [...suggestions, EveryoneSuggestion];
  }

  const onChange = (v: Descendant[]) => {
    mentionSuggestions.updateSearch();
    setSelected(0);
  };

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
    onChange,
    suggestions: mentionSuggestions,
    suggestionControl,
  };
}

function Suggestions({ children }: { children: ReactNode }) {
  const { textColorPrimary } = useColors();
  return (
    <Card overflow="auto" maxH="400px" p={2} color={textColorPrimary}>
      <Box mx={4} my={1}>
        <Text fontWeight="600">Mention</Text>
      </Box>
      {children}
    </Card>
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
    <Card cursor="pointer" p={2} {...(selected && hoverBg)} {...props}>
      <HStack>{content}</HStack>
    </Card>
  );
}
