import { Box, Image } from '@chakra-ui/react';
import { RenderElementProps, useSelected } from 'slate-react';
import { MentionType } from 'utils/markdown/types';
import { EveryoneMention, MentionEntity } from './entities';
import { CustomEmojiElement, CustomStickerElement } from './plugins/emoji';

export function renderElements(props: RenderElementProps) {
  const element = props.element;

  switch (element.type) {
    case 'mention':
      const data = element.data;
      let content;

      switch (element.mention_type) {
        case MentionType.Everyone:
          content = <EveryoneMention />;
          break;
        default:
          content = <MentionEntity id={data.id} name={data.name} avatar={data.avatar} />;
      }

      return (
        <span {...props.attributes} contentEditable={false}>
          {props.children}
          {content}
        </span>
      );

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
  const emoji = element.emoji;
  const focused = useSelected();

  return (
    <span {...props.attributes}>
      {props.children}
      <Box
        display="inline-flex"
        w="25px"
        h="25px"
        borderWidth={focused ? 2 : 0}
        borderColor="brand.400"
        contentEditable={false}
      >
        <Image
          display="inline"
          src={emoji.url}
          alt={emoji.name}
          w="full"
          h="full"
          objectFit="contain"
        />
      </Box>
    </span>
  );
}

function StickerElement(props: RenderElementProps) {
  const element = props.element as CustomStickerElement;
  const sticker = element.sticker;
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
        <Image src={sticker.url} alt={sticker.name} w="full" h="full" objectFit="contain" />
      </Box>
    </div>
  );
}
