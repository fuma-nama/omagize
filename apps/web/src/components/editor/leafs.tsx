import { RenderLeafProps } from 'slate-react';

export function Leaf({ attributes, children, leaf }: RenderLeafProps) {
  if (leaf.blockquote) {
    children = <blockquote>{children}</blockquote>;
  }
  if (leaf.code) {
    children = <code>{children}</code>;
  }
  return (
    <span
      {...attributes}
      spellCheck={false}
      style={{
        fontWeight: leaf.bold && 'bold',
        fontStyle: leaf.italic && 'italic',
        textDecoration: [leaf.underlined && 'underline', leaf.strikethrough && 'line-through']
          .filter(Boolean)
          .join(' '),
      }}
    >
      {children}
    </span>
  );
}
