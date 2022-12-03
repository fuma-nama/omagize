import { IconButtonProps, IconButton, Icon } from '@chakra-ui/react';
import { Assets, client, Keys, MyAssets, Snowflake } from '@omagize/api';
import { useChatStore } from '@omagize/data-access-store';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';

export function LikeButton({ hasLike, ...props }: { hasLike: boolean } & Partial<IconButtonProps>) {
  return (
    <IconButton
      aria-label="Like"
      position="absolute"
      bg="white"
      top="7px"
      right="7px"
      _hover={{ bg: 'whiteAlpha.900' }}
      _active={{ bg: 'whiteAlpha.900' }}
      borderRadius="50%"
      w="36px"
      h="36px"
      color="brand.500"
      icon={<Icon w="20px" h="20px" as={hasLike ? IoHeart : IoHeartOutline} />}
      {...props}
    />
  );
}

export function onDeleteSticker(sticker: Snowflake) {
  client.setQueryData<Assets>(
    Keys.market.assets,
    (prev) =>
      prev && {
        ...prev,
        stickers: prev.stickers.filter((e) => e.id !== sticker),
      }
  );

  client.setQueryData<MyAssets>(
    Keys.market.me,
    (prev) =>
      prev && {
        ...prev,
        owned: {
          ...prev.owned,
          stickers: prev.owned.stickers.filter((e) => e.id !== sticker),
        },
      }
  );

  useChatStore.setState((prev) => ({
    liked_stickers: prev.liked_stickers.filter((e) => e.id !== sticker),
  }));
}

export function onDeleteEmoji(emoji: Snowflake) {
  client.setQueryData<Assets>(
    Keys.market.assets,
    (prev) =>
      prev && {
        ...prev,
        emojis: prev.emojis.filter((e) => e.id !== emoji),
      }
  );

  client.setQueryData<MyAssets>(
    Keys.market.me,
    (prev) =>
      prev && {
        ...prev,
        owned: {
          ...prev.owned,
          emojis: prev.owned.emojis.filter((e) => e.id !== emoji),
        },
      }
  );

  useChatStore.setState((prev) => ({
    liked_emojis: prev.liked_emojis.filter((e) => e.id !== emoji),
  }));
}
