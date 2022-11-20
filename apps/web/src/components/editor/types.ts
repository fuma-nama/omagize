import { CompactEmoji } from 'emojibase';
import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { MentionElement } from './plugins/mention';

type EmojiElement = {
  type: 'emoji';
  emoji: CompactEmoji;
  children: CustomText[];
};

type CustomElement = { type: 'paragraph'; children: CustomText[] } | MentionElement | EmojiElement;

export type TextMarks = {
  underlined?: boolean;
  bold?: boolean;
  blockquote?: boolean;
  title?: boolean;
  code?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
};

export type CustomText = TextMarks & {
  text: string;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
