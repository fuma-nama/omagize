import { Mention, Message } from '@omagize/api';
import { Descendant, Editor, Element, Node, Text } from 'slate';
import { MentionType, toAPIMentionType } from '@omagize/utils/markdown';
import { createMentionElement, createEveryoneMentionElement } from './plugins/mention';
import { CustomText, TextMarks } from './types';

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
  styles: Set<keyof TextMarks> = new Set()
): string {
  if (Editor.isEditor(node)) return slateToMarkdown(node, entities).markdown;

  if (Text.isText(node)) {
    let string = textToMarkdown(node, styles);

    //important
    if (node.blockquote) {
      string = `> ${string}`;
    }

    return string;
  }

  let children = node.children.map((n) => nodeToMarkdown(n, entities, styles)).join('');

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
      const type = toAPIMentionType(node.mention_type);

      entities.mentions.push({
        type: type,
        id: type === 'everyone' ? null : node.data.id,
      });
      return children;
    }
    default:
      return children;
  }
}

type Deserializer<T> = {
  regex: RegExp;
  data?: (match: RegExpMatchArray) => T;
  element: (data: T) => Descendant;
};
function getDeserializers(info: Message): Deserializer<any>[] {
  return [
    {
      regex: /<@([0-9]*)>/g,
      data: (match) => info.mentions.find((m) => m.id === match[1]),
      element: (user) =>
        createMentionElement(MentionType.User, {
          id: user.id,
          name: user.username,
          avatar: user.avatarUrl,
        }),
    },
    {
      regex: /<@everyone>/g,
      element: () => createEveryoneMentionElement(),
    },
    {
      regex: /<(E|S):([0-9]*)>/g,
      data: ([_, type, id]) => {
        return {
          id: id,
          type: type,
        };
      },
      element: (data) => {
        switch (data.type) {
          case 'S':
            return {
              type: 'custom_sticker',
              stickerId: data.id,
              children: [{ text: '' }],
            };
          case 'E':
            return {
              type: 'custom_emoji',
              emojiId: data.id,
              children: [{ text: '' }],
            };
          default:
            return { text: '' };
        }
      },
    },
  ];
}
export function markdownToSlate(content: string, info: Message): Descendant[] {
  const deserializers = getDeserializers(info);
  const deserialize = (index: number, text: string): Descendant[] => {
    if (index >= deserializers.length) return [{ text: text }];
    const deserializer = deserializers[index];
    let lastIndex = 0;
    const elements: Descendant[] = [];

    for (const match of text.matchAll(deserializer.regex)) {
      let param = null;

      if (deserializer.data != null) {
        param = deserializer.data(match);
        if (param == null) continue;
      }

      elements.push(...deserialize(index + 1, text.slice(lastIndex, match.index)));

      elements.push(deserializer.element(param));
      lastIndex = match.index + match[0].length;
    }

    elements.push(...deserialize(index + 1, text.slice(lastIndex)));
    return elements;
  };

  return content
    .split('\n')
    .map((line) => ({ type: 'paragraph', children: deserialize(0, line) as CustomText[] }));
}

export function isEmpty(editor: Editor): boolean {
  for (const node of editor.children) {
    const empty =
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
