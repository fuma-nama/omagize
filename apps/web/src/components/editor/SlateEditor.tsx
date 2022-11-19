import CustomCard from 'components/card/Card';
import { useState, useCallback, useMemo, ReactNode } from 'react';
import { createEditor, Descendant, Transforms, Editor, Point, Range } from 'slate';
import { withHistory } from 'slate-history';
import { withReact, Slate, Editable } from 'slate-react';
import { MentionType } from 'utils/markdown/types';
import { renderElements } from './elements';
import { MentionElement, MentionEntity } from './slate';

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
  mentionSuggestions: ForwardState<SuggestionSearch | null>;
  suggestionControl: SuggestionControl;
};

export type SuggestionControl = {
  accept: (state: SuggestionState) => void;
  length?: number;
  render: (state: SuggestionState) => ReactNode;
};

export type ForwardState<T> = [T, (update: T) => void];

export function SlateEditor({ mentionSuggestions, suggestionControl }: EditorProps) {
  const editor = useMemo(() => withMentions(withHistory(withReact(createEditor()))), []);
  const suggestions = useSuggestions(editor, mentionSuggestions);
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]);

  const state: SuggestionState = {
    selected: suggestions.selected,
    acceptMention(type, data?) {
      const current = suggestions.search;

      if (current != null) {
        Transforms.delete(editor, {
          at: current.anchor,
          distance: current.length,
          unit: 'character',
        });

        insertMention(editor, type, data);
      }
    },
  };

  // Render the Slate context.
  return (
    <>
      {suggestions.search != null && suggestionControl.render(state)}
      <Slate
        editor={editor}
        value={value}
        onChange={(e) => {
          setValue(e);
          suggestions.updateSearch();
        }}
      >
        <CustomCard
          placeholder="Type here..."
          transition="0.5s all"
          variant="input"
          as={Editable}
          w="full"
          renderElement={renderElements}
          onKeyDown={(e) => {
            if (suggestions.search == null) return;

            switch (e.key) {
              case 'ArrowUp': {
                suggestions.setSelected((prev) => Math.max(prev - 1, 0));
                e.preventDefault();
                break;
              }
              case 'ArrowDown': {
                suggestions.setSelected((prev) => Math.min(prev + 1, suggestionControl.length));
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
      </Slate>
    </>
  );
}

const insertMention = (editor: Editor, type: MentionType, data?: MentionEntity) => {
  const mention: MentionElement = {
    type: 'mention',
    mention_type: type,
    children: [{ text: '' }],
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

export function useSuggestions(editor: Editor, state: ForwardState<SuggestionSearch>) {
  const [search, setSearch] = state;
  const [selected, setSelected] = useState<number>();

  const updateSearch = useCallback(() => {
    const selection = editor.selection;
    if (selection == null || !Range.isCollapsed(selection)) return;

    const [start] = Range.edges(selection);
    const before = Editor.before(editor, start, { unit: 'block' });
    const wordBefore = before && Editor.string(editor, { anchor: before, focus: start });
    const regex = /@(\w*)$/g;
    const result = regex.exec(wordBefore);

    if (result != null) {
      setSelected(0);
      setSearch({
        anchor: Editor.after(editor, before, {
          distance: result.index,
          unit: 'character',
          voids: true,
        }),
        length: result[0].length,
        text: result[1],
      });
    } else {
      setSearch(null);
    }
  }, [editor]);

  return {
    selected,
    setSelected,
    search,
    setSearch,
    updateSearch,
  };
}
