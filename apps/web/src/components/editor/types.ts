import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { MentionElement } from './plugins/mention';

type CustomElement = { type: 'paragraph'; children: CustomText[] } | MentionElement;
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
