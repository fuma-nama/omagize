import { CompactEmoji } from 'emojibase';
import { Editor } from 'slate';

export function withEmoji(editor: Editor) {
  const { isInline } = editor;

  editor.isInline = (node) => {
    return node.type === 'emoji' ? true : isInline(node);
  };

  return editor;
}

export function insertEmoji(editor: Editor, emoji: CompactEmoji) {
  Editor.insertNode(editor, {
    type: 'emoji',
    emoji: emoji,
    children: [{ text: emoji.unicode }],
  });
}
