import { Editor, Element, Node, Text } from 'slate';

export type Parsed = {
  markdown: string;
};
export function slateToMarkdown(editor: Editor): Parsed {
  return {
    markdown: editor.children.map((n) => Node.string(n)).join('\n'),
  };
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
