import { Box, Flex, Heading } from '@chakra-ui/react';
import { EditorPlugin } from '@draft-js-plugins/editor';
import { ContentBlock, ContentState } from 'draft-js';
import { ReactNode } from 'react';
import { Syntax } from 'utils/markdown/types';
import { useColors } from 'variables/colors';

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
  render: (s: ReactNode) => ReactNode;
};
const Elements: Array<Element> = [
  { regex: Syntax.Bold, render: (s) => <b>{s}</b> },
  { regex: Syntax.Code, render: (s) => <code>{s}</code> },
  { regex: Syntax.Delete, render: (s) => <del>{s}</del> },
  { regex: Syntax.Header, render: (s) => <Heading fontSize="xl">{s}</Heading> },
  { regex: Syntax.Italic, render: (s) => <i>{s}</i> },
  { regex: Syntax.Quote, render: (s) => <Quote>{s}</Quote> },
  { regex: Syntax.Underline, render: (s) => <u>{s}</u> },
];

export const MarkdownPlugin: EditorPlugin = {
  decorators: Elements.map((e) => {
    return {
      strategy: strategy(e.regex),
      component: (props: { decoratedText: string; children: ReactNode }) => {
        return e.render(props.children);
      },
    };
  }),
};

/*
type Match = {
  start: number;
  length: number;
  node: (children: ReactNode) => ReactNode;
};
function combineMatches(text: string, matches: Match[]): ReactNode {
  const nodes: ReactNode[] = []
  

}
*/

function Quote(props: any) {
  const { brand } = useColors();

  return (
    <Flex direction="row">
      <Box bg={brand} w={2} rounded="lg" mr={2} />
      <span>{props.children}</span>
    </Flex>
  );
}
