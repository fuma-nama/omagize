import { Heading } from '@chakra-ui/react';
import { Message } from '@omagize/api';
import { Quote } from 'components/editor/MarkdownPlugin';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';
import { createContext, ReactElement, useContext, useMemo } from 'react';
import { EveryoneMention, MentionEntity } from '../../editor/entities';

type Data = {
  mentions: Array<MentionData>;
};
type MentionData = {
  id: string;
  avatar?: string;
  name: string;
};

const DataContext = createContext<Data>({ mentions: [] });

const Blocked = (props: { children: ReactElement }) => <></>;
const DefaultOptions: MarkdownToJSX.Options = {
  overrides: {
    script: Blocked,
    iframe: Blocked,
    img: Blocked,
    h1: (props: any) => <Heading fontSize="xl">{props.children}</Heading>,
    Mention: Mention,
    Everyone: () => <EveryoneMention>everyone</EveryoneMention>,
    blockquote: (props) => <Quote>{props.children}</Quote>,
  },
};

export default function MarkdownContent({ message }: { message: Message }) {
  const mentions = message.mentions.map((m) => ({
    id: m.id,
    avatar: m.avatarUrl,
    name: m.username,
  }));

  return (
    <DataContext.Provider value={{ mentions }}>
      <Markdown
        options={{ ...DefaultOptions }}
        children={message.content
          .replaceAll(/^\s$/gm, '<br>')
          .replaceAll('\n', '\n \n')
          .replace(/<@([0-9]*)>/g, '<Mention id="$1" />')
          .replace(/<@everyone>/g, '<Everyone />')}
      />
    </DataContext.Provider>
  );
}

function Mention({ id }: { id: string }) {
  const { mentions } = useContext(DataContext);
  const mention = useMemo(
    () => mentions.find((m) => m.id === id),
    [id, mentions]
  );

  return (
    <MentionEntity
      avatar={mention?.avatar}
      name={mention?.name ?? 'Deleted User'}
    />
  );
}
