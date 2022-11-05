import { Flex } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <Flex direction="column" gap={3}>
      <ReactMarkdown
        children={content.replaceAll(/\s(\n|\r)/gi, '\\\n')}
        remarkPlugins={[remarkBreaks]}
      />
    </Flex>
  );
}
