import { Flex, Image, SimpleGrid, Text } from '@chakra-ui/react';
import { useChatStore } from 'stores/ChatStore';
import { CardButton } from 'components/card/Card';
import { Placeholder, PlaceholderLayout } from 'components/layout/Container';
import { FaThinkPeaks } from 'react-icons/fa';
import { BiSticker } from 'react-icons/bi';
import { useColors } from 'variables/colors';
import { Editor } from 'slate';
import { insertCustomEmoji, insertCustomSticker } from 'components/editor/plugins/emoji';

export function CustomEmojiPicker({ editor }: { editor: Editor }) {
  const [emojis, stickers] = useChatStore((s) => [s.liked_emojis, s.liked_stickers]);
  const { cardBg } = useColors();

  return (
    <Flex direction="column" h={300} overflow="auto" p={2} gap={3}>
      <Text fontWeight="600" fontSize="lg">
        Emojis
      </Text>
      <PlaceholderLayout
        watch={emojis}
        placeholder={<Placeholder icon={<FaThinkPeaks />}>No Emojis</Placeholder>}
      >
        <SimpleGrid columns={4} gap={1}>
          {emojis?.map((emoji) => (
            <CardButton
              key={emoji.id}
              alignItems="center"
              rounded="lg"
              p={2}
              onClick={() => insertCustomEmoji(editor, emoji)}
            >
              <Image src={emoji.url} w="40px" h="40px" />
            </CardButton>
          ))}
        </SimpleGrid>
      </PlaceholderLayout>

      <Text fontWeight="600" fontSize="lg">
        Stickers
      </Text>
      <PlaceholderLayout
        watch={stickers}
        placeholder={<Placeholder icon={<BiSticker />}>No Stickers</Placeholder>}
      >
        <SimpleGrid columns={3} gap={1}>
          {stickers?.map((sticker) => (
            <Image
              key={sticker.id}
              cursor="pointer"
              src={sticker.url}
              w="100px"
              h="100px"
              _hover={{ bg: cardBg }}
              onClick={() => insertCustomSticker(editor, sticker)}
            />
          ))}
        </SimpleGrid>
      </PlaceholderLayout>
    </Flex>
  );
}
