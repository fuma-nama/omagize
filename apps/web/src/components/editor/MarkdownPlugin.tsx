import { Box, Flex, Heading } from '@chakra-ui/react';
import { EditorPlugin } from '@draft-js-plugins/editor';
import { CompositeDecorator, ContentBlock, ContentState } from 'draft-js';
import { ReactNode } from 'react';
import { MentionType, Syntax } from 'utils/markdown/types';
import { useColors } from 'variables/colors';
import { MentionEntity } from './entities';

export interface MentionData {
  avatar?: string;
  name?: string;
  id?: string;

  type?: MentionType;
}

function findWithRegex(
  regex: RegExp,
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void
) {
  const text = contentBlock.getText();
  let matchArr, start;

  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

function strategy(
  regex: RegExp
): (
  block: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) => void {
  return (block, callback, _) => findWithRegex(regex, block, callback);
}

type Element = {
  regex: RegExp;
  render: (s: ReactNode, props: any) => ReactNode;
};
const Elements: Array<Element> = [
  {
    regex: /<@([0-9]*)>/g,
    render: (s, props) => {
      const text = props.decoratedText;
      const id = /<@([0-9]*)>/g.exec(text)[1];

      console.log(id, props);
      return <MentionEntity data-offset-key={props.offsetKey} name="Test" />;
    },
  },
  //{ regex: Syntax.CodeBlock, render: (s) => <code>{s}</code> },
  { regex: Syntax.Header, render: (s) => <Heading fontSize="xl">{s}</Heading> },
  { regex: Syntax.Quote, render: (s) => <Quote>{s}</Quote> },
];

export const Everyone: MentionData = {
  id: 'everyone',
  type: MentionType.Everyone,
};
/**
 * It only takes effects on markdown syntaxes that don't allow nested elements
 */
const MarkdownDecorator = new CompositeDecorator([
  ...Elements.map((e) => {
    return {
      strategy: strategy(e.regex),
      component: (props: { children: any }) => {
        return e.render(props.children, props);
      },
    };
  }),
]);

export const MarkdownPlugin: EditorPlugin = {
  decorators: [MarkdownDecorator],
};

export function Quote(props: any) {
  const { brand } = useColors();

  return (
    <Flex direction="row">
      <Box bg={brand} w={2} rounded="lg" mr={2} />
      <span>{props.children}</span>
    </Flex>
  );
}
