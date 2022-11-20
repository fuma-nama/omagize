import { Mention } from '@omagize/api';
import { Editor, Element, Node, Text } from 'slate';
import { toAPIMentionType } from 'utils/markdown/types';
import { TextMarks } from './types';

export type Parsed = Entities & {
  markdown: string;
};
export type Entities = {
  mentions: Mention[];
};
export function slateToMarkdown(editor: Editor, entities: Entities = { mentions: [] }): Parsed {
  return {
    markdown: editor.children.map((n) => nodeToMarkdown(n, entities)).join('\n'),
    mentions: entities.mentions,
  };
}

const convert: {
  [key in keyof TextMarks]: string;
} = {
  italic: '*',
  bold: '**',
  code: '`',
  strikethrough: '~~',
  underlined: '__',
};

function nodeToMarkdown(
  node: Node,
  entities: Entities,
  level: number = 0,
  styles: Set<keyof TextMarks> = new Set()
): string {
  if (Editor.isEditor(node)) return slateToMarkdown(node, entities).markdown;

  if (Text.isText(node)) {
    let string = textToMarkdown(node, styles);

    //important
    if (node.blockquote) {
      string = `> ${string}`;
    }
    if (node.title) {
      string = `# ${string}`;
    }

    return string;
  }

  let children = node.children.map((n) => nodeToMarkdown(n, entities, level + 1, styles)).join('');

  for (const style of [...styles.values()].reverse()) {
    children += convert[style];
  }

  return elementToMarkdown(node, children, entities);
}

export function textToMarkdown(node: Text, styles: Set<keyof TextMarks>): string {
  let string = '';

  for (const key of Object.keys(convert)) {
    const style = key as keyof TextMarks;

    if (node[style] && !styles.has(style)) {
      string += convert[style];
      styles.add(style);
    }
  }

  string += node.text;

  for (const style of [...styles.values()].reverse()) {
    if (node[style] !== true) {
      string += convert[style];
      styles.delete(style);
    }
  }

  return string;
}

export function elementToMarkdown(node: Element, children: string, entities: Entities) {
  switch (node.type) {
    case 'mention': {
      let type = toAPIMentionType(node.mention_type);

      entities.mentions.push({
        type: type,
        id: type === 'everyone' ? null : node.data.id,
      });
      return children;
    }
    case 'paragraph':
      return children;
  }
}

export function isEmpty(editor: Editor): boolean {
  for (const node of editor.children) {
    let empty =
      (Text.isText(node) && node.text.trim().length === 0) ||
      (Element.isElement(node) && isElementEmpty(node));

    if (!empty) return false;
  }
  return true;
}

export function isElementEmpty(element: Element): boolean {
  for (const node of element.children) {
    const empty =
      (Text.isText(node) && node.text.trim().length === 0) ||
      (Element.isElement(node) && isElementEmpty(node));

    if (!empty) return false;
  }

  return true;
}
