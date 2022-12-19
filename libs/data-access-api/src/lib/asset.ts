import {
  Snowflake,
  CategoryAssets,
  MyAssets,
  deleteAsset,
  likeAsset,
  unlikeAsset,
  CustomEmoji,
  CustomSticker,
} from '@omagize/api';
import { useChatStore } from '@omagize/data-access-store';
import { useMutation } from '@tanstack/react-query';
import { client } from './client';
import { Keys } from './queries';

export function onCreatedEmoji(add: CustomEmoji) {
  client.setQueryData<MyAssets>(
    Keys.market.me,
    (prev) =>
      prev && {
        ...prev,
        owned: {
          ...prev.owned,
          emojis: [add, ...prev.owned.emojis],
        },
      }
  );
  client.setQueryData<CategoryAssets>(
    Keys.market.assets,
    (prev) =>
      prev != null && {
        ...prev,
        latest: {
          ...prev.latest,
          emojis: [add, ...prev.latest.emojis],
        },
      }
  );
}

export function onCreatedSticker(add: CustomSticker) {
  client.setQueryData<MyAssets>(
    Keys.market.me,
    (prev) =>
      prev && {
        ...prev,
        owned: {
          ...prev.owned,
          stickers: [add, ...prev.owned.stickers],
        },
      }
  );
  client.setQueryData<CategoryAssets>(
    Keys.market.assets,
    (prev) =>
      prev != null && {
        ...prev,
        latest: {
          ...prev.latest,
          stickers: [add, ...prev.latest.stickers],
        },
      }
  );
}

export function useDeleteStickerMutation() {
  return useMutation((sticker: string) => deleteAsset(sticker, 'stickers'), {
    onSuccess(_, sticker) {
      onDeleteSticker(sticker);
    },
  });
}
export function useDeleteEmojiMutation() {
  return useMutation((emoji: string) => deleteAsset(emoji, 'emojis'), {
    onSuccess(_, emoji) {
      onDeleteEmoji(emoji);
    },
  });
}

export function onDeleteSticker(sticker: Snowflake) {
  client.setQueryData<CategoryAssets>(
    Keys.market.assets,
    (prev) =>
      prev != null && {
        latest: {
          ...prev.latest,
          stickers: prev.latest.stickers.filter((e) => e.id !== sticker),
        },
        recommend: {
          ...prev.recommend,
          stickers: prev.recommend.stickers.filter((e) => e.id !== sticker),
        },
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
  client.setQueryData<CategoryAssets>(
    Keys.market.assets,
    (prev) =>
      prev != null && {
        latest: {
          ...prev.latest,
          emojis: prev.latest.emojis.filter((e) => e.id !== emoji),
        },
        recommend: {
          ...prev.recommend,
          emojis: prev.recommend.emojis.filter((e) => e.id !== emoji),
        },
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

export type LikeAssetVars = {
  favoite: boolean;
};
export type LikeAssetMutation = {
  isFavoite: boolean;
  setFavoite: (v: boolean) => void;
};

export function useLikeEmojiMutation(emoji: CustomEmoji): LikeAssetMutation {
  const store = useChatStore((s) => ({
    isFavoite: s.liked_emojis?.some((e) => e.id === emoji.id),
    addFavoite: s.likeEmoji,
    removeFavoite: s.unlikeEmoji,
  }));
  const mutation = useMutation(
    ['favoite_emoji_update', emoji],
    ({ favoite }: LikeAssetVars) =>
      favoite ? likeAsset(emoji.id, 'emoji') : unlikeAsset(emoji.id, 'emoji'),
    {
      onSuccess: (_, { favoite }) => {
        favoite ? store.addFavoite(emoji) : store.removeFavoite(emoji.id);
      },
    }
  );

  return {
    isFavoite: store.isFavoite,
    setFavoite: (v) => mutation.mutate({ favoite: v }),
  };
}

export function useLikeStickerMutation(sticker: CustomSticker): LikeAssetMutation {
  const store = useChatStore((s) => ({
    isFavoite: s.liked_stickers?.some((e) => e.id === sticker.id),
    addFavoite: s.likeSticker,
    removeFavoite: s.unlikeSticker,
  }));
  const mutation = useMutation(
    ['favoite_sticker_update', sticker],
    ({ favoite }: LikeAssetVars) =>
      favoite ? likeAsset(sticker.id, 'sticker') : unlikeAsset(sticker.id, 'sticker'),
    {
      onSuccess: (_, { favoite }) => {
        favoite ? store.addFavoite(sticker) : store.removeFavoite(sticker.id);
      },
    }
  );

  return {
    isFavoite: store.isFavoite,
    setFavoite: (v) => mutation.mutate({ favoite: v }),
  };
}
