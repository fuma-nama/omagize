import { Box, Image } from '@chakra-ui/react';
import { AssetType, getAssetUrl } from '@omagize/api';
import { RenderElementProps, useSelected } from 'slate-react';
import { MentionType } from '@omagize/utils/markdown';
import { EveryoneMention, UserMention } from './entities';
import { CustomEmojiElement, CustomStickerElement } from './plugins/emoji';

export function renderElements(props: RenderElementProps) {
  const element = props.element;

  switch (element.type) {
    case 'mention': {
      const data = element.data;
      let content;

      switch (element.mention_type) {
        case MentionType.Everyone:
          content = <EveryoneMention />;
          break;
        default:
          content = <UserMention name={data.name} avatar={data.avatar} />;
      }

      return (
        <span {...props.attributes} contentEditable={false}>
          {props.children}
          {content}
        </span>
      );
    }

    case 'custom_emoji':
      return <EmojiElement {...props} />;
    case 'custom_sticker': {
      return <StickerElement {...props} />;
    }
    default:
      return <p {...props.attributes}>{props.children}</p>;
  }
}

function EmojiElement(props: RenderElementProps) {
  const element = props.element as CustomEmojiElement;
  const url = getAssetUrl(AssetType.Emojis, element.emojiId);
  const focused = useSelected();

  return (
    <span {...props.attributes}>
      {props.children}
      <Box
        display="inline-block"
        w="25px"
        h="25px"
        borderWidth={focused ? 2 : 0}
        borderColor="brand.400"
      >
        <Image src={url} alt="Custom Emoji" w="full" h="full" objectFit="contain" />
      </Box>
    </span>
  );
}

function StickerElement(props: RenderElementProps) {
  const element = props.element as CustomStickerElement;
  const url = getAssetUrl(AssetType.Stickers, element.stickerId);
  const focused = useSelected();

  return (
    <div {...props.attributes}>
      {props.children}
      <Box
        w="100px"
        h="100px"
        borderWidth={focused ? 2 : 0}
        borderColor="brand.400"
        contentEditable={false}
      >
        <Image src={url} alt="Custom Sticker" w="full" h="full" objectFit="contain" />
      </Box>
    </div>
  );
}
