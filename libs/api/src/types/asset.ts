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

type Asset = {
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
