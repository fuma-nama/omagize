import { Snowflake } from '@omagize/api';
import { BaseElement, Editor, Transforms } from 'slate';
import { MentionType } from 'utils/markdown/types';

export type MentionEntity = {
  avatar?: string;
  id: Snowflake;
  name: string;
};

export type MentionElement = BaseElement & {
  type: 'mention';
  mention_type: MentionType;
  data: MentionEntity;
};

export function createEveryoneMentionElement(): MentionElement {
  return {
    type: 'mention',
    mention_type: MentionType.Everyone,
    children: [{ text: `<@everyone>` }],
    data: {
      id: 'everyone',
      name: 'everyone',
    },
  };
}

export function createMentionElement(type: MentionType, data: MentionEntity): MentionElement {
  return {
    type: 'mention',
    mention_type: type,
    children: [{ text: `<@${data.id}>` }],
    data,
  };
}

export function insertMention(editor: Editor, type: MentionType, data: MentionEntity) {
  const mention = createMentionElement(type, data);
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
}

export function withMentions<T extends Editor>(editor: T): T {
  const { isInline, isVoid } = editor;

  editor.isInline = (element) => {
    return element.type === 'mention' ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === 'mention' ? true : isVoid(element);
  };

  return editor;
}
