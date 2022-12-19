import { Snowflake } from './types/common';
import {
  CategoryAssets,
  CustomEmoji,
  CustomSticker,
  MyAssets,
  RawCategoryAssets,
  RawCustomEmoji,
  RawCustomSticker,
  RawMyAssets,
} from './types';
import { toFormData } from './utils';
import { callDefault, callReturn } from './utils/core';

export async function fetchLatestAssets(): Promise<CategoryAssets> {
  const raw = await callReturn<RawCategoryAssets>(`/market/assets`, {
    method: 'GET',
  });

  return CategoryAssets(raw);
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

export async function deleteAsset(asset: Snowflake, type: 'emojis' | 'stickers') {
  await callDefault(`/market/${type}/${asset}`, {
    method: 'DELETE',
  });
}

export async function fetchMyAssets(): Promise<MyAssets> {
  const raw = await callReturn<RawMyAssets>(`/market/assets/me`, {
    method: 'GET',
  });

  return MyAssets(raw);
}
