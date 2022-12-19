import { RawUser } from '../UserAPI';
import { AssetType, getAssetUrl } from '../utils';
import { DateObject, Snowflake } from './common';
import { User } from './user';

type RawAsset = {
  id: Snowflake;
  name: string;
  author: RawUser;
  createdAt: DateObject;
};

export type Asset = {
  id: Snowflake;
  name: string;
  author: User;
  createdAt: Date;
  url: string;
};

export type RawCustomEmoji = RawAsset;
export type CustomEmoji = Asset;

export function CustomEmoji(raw: RawCustomEmoji): CustomEmoji {
  return {
    ...raw,
    author: new User(raw.author),
    createdAt: new Date(raw.createdAt),
    url: getAssetUrl(AssetType.Emojis, raw.id),
  };
}

export type RawCustomSticker = RawAsset;
export type CustomSticker = Asset;

export function CustomSticker(raw: RawCustomSticker): CustomSticker {
  return {
    ...raw,
    author: new User(raw.author),
    createdAt: new Date(raw.createdAt),
    url: getAssetUrl(AssetType.Stickers, raw.id),
  };
}

export type RawAssets = {
  emojis: RawCustomEmoji[];
  stickers: RawCustomSticker[];
};

export type Assets = {
  emojis: CustomEmoji[];
  stickers: CustomSticker[];
};

export function Assets(raw: RawAssets): Assets {
  return {
    emojis: raw.emojis.map((emoji) => CustomEmoji(emoji)),
    stickers: raw.stickers.map((sticker) => CustomSticker(sticker)),
  };
}

export type RawCategoryAssets = {
  latest: RawAssets;
  recommend: RawAssets;
};

export type CategoryAssets = {
  latest: Assets;
  recommend: Assets;
};

export function CategoryAssets(raw: RawCategoryAssets): CategoryAssets {
  return {
    latest: Assets(raw.latest),
    recommend: Assets(raw.recommend),
  };
}

export type RawMyAssets = {
  owned: RawAssets;
  favorites: RawAssets;
};

export type MyAssets = {
  owned: Assets;
  favorites: Assets;
};

export function MyAssets(raw: RawMyAssets): MyAssets {
  return {
    owned: Assets(raw.owned),
    favorites: Assets(raw.favorites),
  };
}
