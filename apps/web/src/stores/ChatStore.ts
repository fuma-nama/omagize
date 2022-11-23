import { CustomSticker, CustomEmoji, Snowflake } from '@omagize/api';
import create from 'zustand';

export type ChatStore = {
  liked_emojis: CustomEmoji[] | null;
  likeEmoji: (emoji: CustomEmoji) => void;
  unlikeEmoji: (emoji: Snowflake) => void;
  liked_stickers: CustomSticker[] | null;
  likeSticker: (sticker: CustomSticker) => void;
  unlikeSticker: (sticker: Snowflake) => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  liked_emojis: [],
  liked_stickers: [],
  likeEmoji: (emoji) =>
    set((store) => {
      const prev = store.liked_emojis;
      const contains = prev.some((e) => e.id === emoji.id);

      return {
        liked_emojis: contains ? prev : [...prev, emoji],
      };
    }),
  unlikeEmoji: (emoji) =>
    set((store) => {
      const prev = store.liked_emojis;

      return {
        liked_emojis: prev.filter((e) => e.id !== emoji),
      };
    }),
  likeSticker: (sticker) =>
    set((store) => {
      const prev = store.liked_stickers;
      const contains = prev.some((e) => e.id === sticker.id);

      return {
        liked_stickers: contains ? prev : [...prev, sticker],
      };
    }),
  unlikeSticker: (sticker) =>
    set((store) => {
      const prev = store.liked_stickers;

      return {
        liked_stickers: prev.filter((e) => e.id !== sticker),
      };
    }),
}));
