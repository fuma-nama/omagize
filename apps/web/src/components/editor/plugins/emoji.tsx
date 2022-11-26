import { CustomEmoji, CustomSticker, Snowflake } from '@omagize/api';
import { CompactEmoji } from 'emojibase';
import { Editor } from 'slate';
import { CustomText } from '../types';

export function withEmoji(editor: Editor) {
  const { isInline, isVoid } = editor;

  editor.isInline = (node) => {
    switch (node.type) {
      case 'custom_emoji':
        return true;
      case 'custom_sticker':
        return false;
      default:
        return isInline(node);
    }
  };

  editor.isVoid = (element) => {
    switch (element.type) {
      case 'custom_emoji':
      case 'custom_sticker':
        return true;
      default:
        return isVoid(element);
    }
  };

  return editor;
}

export function insertEmoji(editor: Editor, emoji: CompactEmoji) {
  Editor.insertText(editor, emoji.unicode);
}

export function insertCustomEmoji(editor: Editor, emoji: CustomEmoji | Snowflake) {
  const id = typeof emoji === 'string' ? emoji : emoji.id;

  Editor.insertNode(editor, {
    type: 'custom_emoji',
    emojiId: id,
    children: [{ text: `<E:${id}>` }],
  });
  Editor.insertNode(editor, { text: '' });
}

export function insertCustomSticker(editor: Editor, sticker: CustomSticker | Snowflake) {
  const id = typeof sticker === 'string' ? sticker : sticker.id;

  Editor.insertNode(editor, {
    type: 'custom_sticker',
    stickerId: id,
    children: [{ text: `<S:${id}>` }],
  });
  Editor.insertSoftBreak(editor);
}

export type CustomEmojiElement = {
  type: 'custom_emoji';
  emojiId: Snowflake;
  children: CustomText[];
};

export type CustomStickerElement = {
  type: 'custom_sticker';
  stickerId: Snowflake;
  children: CustomText[];
};
