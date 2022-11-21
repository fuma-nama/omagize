import CustomCard from 'components/card/Card';
import { useCallback, ReactNode } from 'react';
import { createEditor, Transforms, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { withReact, Editable, RenderLeafProps, useSlate } from 'slate-react';
import { CustomCardProps } from 'theme/theme';
import { MentionType } from 'utils/markdown/types';
import { renderElements } from './elements';
import { Leaf } from './leafs';
import { withEmoji } from './plugins/emoji';
import { insertMention, MentionEntity, withMentions } from './plugins/mention';
import { UseSuggestions } from './plugins/suggestions';

export type SuggestionState = {
  /**
   * Selected index
   */
  selected: number | null;
  acceptMention: (type: MentionType, data?: MentionEntity) => void;
};

export type EditorProps = {
  suggestions: UseSuggestions;
  suggestionControl: SuggestionControl;
  input?: CustomCardProps;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
};

export type SuggestionControl = {
  selected: number;
  setSelected: (updateFn: (prev: number) => number) => void;
  accept: (state: SuggestionState) => void;
  length?: number;
  render: (state: SuggestionState) => ReactNode;
};

export type ForwardState<T> = [T, (update: T) => void];

export const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

export function createSlateEditor() {
  return withEmoji(withMentions(withHistory(withReact(createEditor()))));
}

export function SlateEditor({ suggestions, suggestionControl, ...props }: EditorProps) {
  const editor = useSlate();

  const state: SuggestionState = {
    selected: suggestionControl.selected,
    acceptMention(type, data?) {
      const current = suggestions.search;

      if (current != null) {
        Transforms.delete(editor, {
          at: editor.selection.focus,
          distance: current.length,
          unit: 'character',
          voids: false,
          reverse: true,
        });

        insertMention(editor, type, data);
      }
    },
  };
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);

  // Render the Slate context.
  return (
    <>
      {suggestions.search != null && suggestionControl.render(state)}
      <CustomCard
        placeholder="Type here..."
        transition="0.5s all"
        variant="input"
        as={Editable}
        w="full"
        renderElement={renderElements}
        renderLeaf={renderLeaf}
        onKeyDown={(e) => {
          if (props.onKeyDown != null) props.onKeyDown(e);
          if (suggestions.search == null) return;

          switch (e.key) {
            case 'ArrowUp': {
              suggestionControl.setSelected((prev: number) => Math.max(prev - 1, 0));
              e.preventDefault();
              break;
            }
            case 'ArrowDown': {
              suggestionControl.setSelected((prev: number) =>
                Math.min(prev + 1, suggestionControl.length - 1)
              );
              e.preventDefault();
              break;
            }
            case 'Enter': {
              suggestionControl.accept(state);
              e.preventDefault();
              break;
            }
          }
        }}
        {...props.input}
      />
    </>
  );
}
