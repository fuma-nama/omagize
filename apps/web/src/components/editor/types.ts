import { Snowflake } from '@omagize/api';
import { BaseElement } from 'slate';
import { MentionType } from 'utils/markdown/types';
import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

export type MentionEntity = {
  avatar?: string;
  id: Snowflake;
  name: string;
};

export type MentionElement = BaseElement & {
  type: 'mention';
  mention_type: MentionType;
  data?: MentionEntity;
};

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
