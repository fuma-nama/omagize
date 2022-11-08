export type Insert = {
  type: 'insert';
  index: number;
  text: string;
};

export type Replace = {
  type: 'replace';
  index: number;
  length: number;
  replacement: string;
};

export type Remove = {
  type: 'remove';
  index: number;
  length: number;
};

export type Modify = (Insert | Replace | Remove) & {
  /**
   * If more than one actions will be executed at the same index
   * the action with less weight will be executed first
   *
   * Default: 0
   */
  weight?: number;
};

export function apply(s: string, actions: Modify[]) {
  let offset = 0;
  const sorted = actions.sort(
    (a, b) => a.index - b.index || (a.weight ?? 0) - (b.weight ?? 0)
  );

  for (const action of sorted) {
    const start = action.index + offset;

    switch (action.type) {
      case 'insert': {
        s = s.slice(0, start) + action.text + s.slice(start);

        offset += action.text.length;
        break;
      }
      case 'remove': {
        s = s.slice(0, start - action.length) + s.slice(start);

        offset -= action.length;
        break;
      }
      case 'replace': {
        const end = start + action.length;
        s = s.slice(0, start) + action.replacement + s.slice(end);

        offset += action.replacement.length - action.length;
        break;
      }
    }
  }

  return s;
}
