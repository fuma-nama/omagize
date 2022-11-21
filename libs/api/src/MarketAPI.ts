import { CustomEmoji, CustomSticker, RawCustomEmoji, RawCustomSticker } from './types';
import { toFormData } from './utils';
import { callReturn } from './utils/core';

export type RawAssets = {
  emojis: RawCustomEmoji[];
};

export type Assets = {
  emojis: CustomEmoji[];
};

export async function fetchLatestAssets(): Promise<Assets> {
  const result = await callReturn<RawAssets>(`/market/assets`, {
    method: 'GET',
  });

  return {
    emojis: result.emojis.map((emoji) => CustomEmoji(emoji)),
  };
}

export async function createEmoji(name: string, image: Blob) {
  const created = await callReturn<RawCustomEmoji>(`/market/emojis`, {
    method: 'POST',
    body: toFormData({
      name,
      image,
    }),
  });

  return CustomEmoji(created);
}

export async function createSticker(name: string, image: Blob) {
  const created = await callReturn<RawCustomSticker>(`/market/emojis`, {
    method: 'POST',
    body: toFormData({
      name,
      image,
    }),
  });

  return CustomSticker(created);
}
