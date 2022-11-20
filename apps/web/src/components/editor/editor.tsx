import CustomCard from 'components/card/Card';
import { useCallback, ReactNode } from 'react';
import { createEditor, Transforms, Editor, Point, Range } from 'slate';
import { withHistory } from 'slate-history';
import { withReact, Editable, RenderLeafProps, useSlate } from 'slate-react';
import { MentionType } from 'utils/markdown/types';
import { renderElements } from './elements';
import { Leaf } from './leafs';
import { MentionElement, MentionEntity } from './types';

export type SuggestionSearch = {
  /**
   * where the search beginnes
   */
  anchor: Point;
  /**
   * total length including triggers
   */
  length: number;
  text: string;
};

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
};

export type SuggestionControl = {
  selected: number;
  setSelected: (updateFn: (prev: number) => number) => void;
  accept: (state: SuggestionState) => void;
  length?: number;
  render: (state: SuggestionState) => ReactNode;
};

export type ForwardState<T> = [T, (update: T) => void];

export function createSlateEditor() {
  return withMentions(withHistory(withReact(createEditor())));
}

export function SlateEditor({ suggestions, suggestionControl }: EditorProps) {
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
      />
    </>
  );
}

const insertMention = (editor: Editor, type: MentionType, data: MentionEntity) => {
  const mention: MentionElement = {
    type: 'mention',
    mention_type: type,
    children: [{ text: `<@${data.id}>` }],
    data,
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};

function withMentions<T extends Editor>(editor: T): T {
  const { isInline, isVoid } = editor;

  editor.isInline = (element) => {
    return element.type === 'mention' ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === 'mention' ? true : isVoid(element);
  };

  return editor;
}

export type UseSuggestions = {
  search: SuggestionSearch;
  setSearch: (v: SuggestionSearch) => void;
  updateSearch: () => SuggestionSearch;
};
export function useSuggestions(
  editor: Editor,
  state: ForwardState<SuggestionSearch>
): UseSuggestions {
  const [search, setSearch] = state;

  const updateSearch = useCallback(() => {
    const selection = editor.selection;
    if (selection == null || !Range.isCollapsed(selection)) return;

    const [start] = Range.edges(selection);
    const before = Editor.before(editor, start, { unit: 'block' });
    const wordBefore = before && Editor.string(editor, { anchor: before, focus: start });
    const regex = /@(\w*)$/g;
    const result = regex.exec(wordBefore);
    let set: SuggestionSearch = null;

    if (result != null) {
      set = {
        anchor: Editor.after(editor, before, {
          distance: result.index,
          unit: 'character',
          voids: true,
        }),
        length: result[0].length,
        text: result[1],
      };
    }

    setSearch(set);
    return set;
  }, [editor]);

  return {
    search,
    setSearch,
    updateSearch,
  };
}
