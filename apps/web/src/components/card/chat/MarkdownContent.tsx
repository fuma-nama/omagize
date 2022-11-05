import { Heading } from '@chakra-ui/react';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';
import { createContext, ReactElement, useContext } from 'react';
import { MentionEntity } from './entities';

type Data = {
  mentions: {
    [id: string]: {
      avatar?: string;
      name: string;
    };
  };
};
const DataContext = createContext<Data>({ mentions: {} });

const Blocked = (props: { children: ReactElement }) => props.children;
const DefaultOptions: MarkdownToJSX.Options = {
  overrides: {
    script: Blocked,
    iframe: Blocked,
    img: Blocked,
    h1: (props: any) => <Heading fontSize="xl">{props.children}</Heading>,
    Mention: {
      component: Mention,
    },
  },
};

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <Markdown
      options={{ ...DefaultOptions }}
      children={content
        .replaceAll(/^\s$/gm, '<br>')
        .replaceAll('\n', '\n \n')
        .replace(/<@([0-9]*)>/gi, '<Mention id="$1" />')}
    />
  );
}

function Mention({ id }: { id: string }) {
  const context = useContext(DataContext);
  const mention = context.mentions[id] ?? {
    name: 'Deleted User',
  };

  return (
    <MentionEntity avatar={mention.avatar}>
      <p>{mention.name}</p>
    </MentionEntity>
  );
}
