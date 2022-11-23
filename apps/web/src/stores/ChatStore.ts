import { CustomEmoji, Snowflake } from '@omagize/api';
import create from 'zustand';

export type ChatStore = {
  liked_emojis: CustomEmoji[] | null;
  likeEmoji: (emoji: CustomEmoji) => void;
  unlikeEmoji: (emoji: Snowflake) => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  liked_emojis: [],
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
}));
