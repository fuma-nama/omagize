import { Box, Heading } from '@chakra-ui/react';
import { AssetType, getAssetUrl, Message, Snowflake } from '@omagize/api';
import { MemberPopup } from 'components/modals/popup/UserPopup';
import { PopoverTrigger } from 'components/PopoverTrigger';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';
import { createContext, useContext, useMemo } from 'react';
import { escapeHtml, unescapeHtml } from 'utils/common';
import { EmojiEntity, EveryoneMention, MentionEntity, StickerEntity } from '../../editor/entities';

type Data = {
  mentions: Array<MentionData>;
};
type MentionData = {
  id: string;
  avatar?: string;
  name: string;
};

const DataContext = createContext<Data>({ mentions: [] });

const Blocked = () => <></>;
const DefaultOptions: MarkdownToJSX.Options = {
  overrides: {
    script: Blocked,
    iframe: Blocked,
    img: Blocked,
    h1: (props: any) => <Heading fontSize="xl">{props.children}</Heading>,
    Mention: Mention,
    Everyone: () => <EveryoneMention />,
    code: (props) => (
      <code>
        {typeof props.children === 'string' ? unescapeHtml(props.children) : props.children}
      </code>
    ),
    Emoji: ({ id }: { id: Snowflake }) => {
      return <EmojiEntity name={id} src={getAssetUrl(AssetType.Emojis, id)} />;
    },
    Sticker: ({ id }: { id: Snowflake }) => {
      return <StickerEntity name={id} src={getAssetUrl(AssetType.Stickers, id)} />;
    },
  },
};

export default function MarkdownContent({ message }: { message: Message }) {
  const mentions = message.mentions.map((m) => ({
    id: m.id,
    avatar: m.avatarUrl,
    name: m.username,
  }));
  const content = useMemo(
    () =>
      escapeHtml(message.content)
        .replaceAll(/^\s$/gm, '<br>')
        .replaceAll('\n', '\n \n')
        .replace(/&lt;(E|S):([0-9]*)&gt;/g, (_, type, id) => {
          switch (type) {
            case 'E':
              return `<Emoji id="${id}" />`;
            case 'S':
              return `<Sticker id="${id}" />`;
            default:
              return '';
          }
        })
        .replace(/&lt;@([0-9]*)&gt;/g, `<Mention id="$1" group="${message.channel}" />`)
        .replace(/&lt;@everyone&gt;/g, '<Everyone />'),
    [message.content]
  );

  return (
    <DataContext.Provider value={{ mentions }}>
      <Markdown options={{ ...DefaultOptions }} children={content} />
    </DataContext.Provider>
  );
}

function Mention({ id, group }: { id: string; group?: string }) {
  const { mentions } = useContext(DataContext);
  const mention = useMemo(() => mentions.find((m) => m.id === id), [id, mentions]);

  if (mention == null) {
    return <MentionEntity name="Deleted User" />;
  }

  return (
    <MemberPopup user={mention.id} group={group}>
      <PopoverTrigger>
        <Box as="span">
          <MentionEntity avatar={mention.avatar} name={mention.name} />
        </Box>
      </PopoverTrigger>
    </MemberPopup>
  );
}
