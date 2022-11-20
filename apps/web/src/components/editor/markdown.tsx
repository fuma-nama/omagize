import { Mention } from '@omagize/api';
import { Editor, Element, Node, Text } from 'slate';
import { toAPIMentionType } from 'utils/markdown/types';

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

function nodeToMarkdown(node: Node, entities: Entities): string {
  if (Editor.isEditor(node)) return slateToMarkdown(node, entities).markdown;

  if (Text.isText(node)) {
    let string = node.text;
    //important
    if (node.blockquote) {
      string = `> ${string}`;
    }
    if (node.title) {
      string = `# ${string}`;
    }

    if (node.italic) {
      string = `*${string}*`;
    }
    if (node.bold) {
      string = `**${string}**`;
    }
    if (node.code) {
      string = `\`${string}\``;
    }
    if (node.strikethrough) {
      string = `~~${string}~~`;
    }
    if (node.underlined) {
      string = `__${string}__`;
    }

    return string;
  }

  const children = node.children.map((n) => nodeToMarkdown(n, entities)).join('');

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
