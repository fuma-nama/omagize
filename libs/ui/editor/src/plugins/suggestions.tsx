import { Editor, Point, Range } from 'slate';
import { ForwardState } from '../editor';

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

  function updateSearch() {
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
  }

  return {
    search,
    setSearch,
    updateSearch,
  };
}
