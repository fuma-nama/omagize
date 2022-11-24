import { CustomEmoji, CustomSticker } from '@omagize/api';
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

export function insertCustomEmoji(editor: Editor, emoji: CustomEmoji) {
  Editor.insertNode(editor, {
    type: 'custom_emoji',
    emoji: emoji,
    children: [{ text: `<E:${emoji.id}>` }],
  });
  Editor.insertNode(editor, { text: ' ' });
}

export function insertCustomSticker(editor: Editor, sticker: CustomSticker) {
  Editor.insertNode(editor, {
    type: 'custom_sticker',
    sticker: sticker,
    children: [{ text: `<S:${sticker.id}>` }],
  });
  Editor.insertSoftBreak(editor);
}

export type CustomEmojiElement = {
  type: 'custom_emoji';
  emoji: CustomEmoji;
  children: CustomText[];
};

export type CustomStickerElement = {
  type: 'custom_sticker';
  sticker: CustomSticker;
  children: CustomText[];
};
