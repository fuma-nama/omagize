import { Snowflake } from './types/common';
import {
  Assets,
  CustomEmoji,
  CustomSticker,
  RawAssets,
  RawCustomEmoji,
  RawCustomSticker,
} from './types';
import { toFormData } from './utils';
import { callDefault, callReturn } from './utils/core';

export async function fetchLatestAssets(): Promise<Assets> {
  const result = await callReturn<RawAssets>(`/market/assets`, {
    method: 'GET',
  });

  return {
    emojis: result.emojis.map((emoji) => CustomEmoji(emoji)),
    stickers: result.stickers.map((sticker) => CustomSticker(sticker)),
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
  const created = await callReturn<RawCustomSticker>(`/market/stickers`, {
    method: 'POST',
    body: toFormData({
      name,
      image,
    }),
  });

  return CustomSticker(created);
}

export async function likeAsset(asset: Snowflake, type: 'emoji' | 'sticker') {
  const route = type === 'emoji' ? 'emojis' : 'stickers';

  await callDefault(`/market/${route}/${asset}/like`, {
    method: 'POST',
  });
}

export async function unlikeAsset(asset: Snowflake, type: 'emoji' | 'sticker') {
  const route = type === 'emoji' ? 'emojis' : 'stickers';

  await callDefault(`/market/${route}/${asset}/like`, {
    method: 'DELETE',
  });
}

type RawMyAssets = {
  owned: RawAssets;
  favorites: RawAssets;
};
export type MyAssets = {
  owned: Assets;
  favorites: Assets;
};

export async function fetchMyAssets(): Promise<MyAssets> {
  const raw = await callReturn<RawMyAssets>(`/market/assets/me`, {
    method: 'GET',
  });

  return {
    owned: Assets(raw.owned),
    favorites: Assets(raw.favorites),
  };
}
