import { api } from './core';
import { Snowflake } from '../types/common';

enum MediaType {
  Banner = 'banners',
  Avatars = 'avatars',
  Icons = 'icons',
  Attachments = 'attachments',
}

export enum AssetType {
  Emojis = 'emojis',
  Stickers = 'stickers',
}

export function toAvatarUrl(user: Snowflake, hash?: string | number): string | null {
  return asWebpUrl(MediaType.Avatars, user, hash);
}

export function toIconUrl(group: Snowflake, hash?: string | number): string | null {
  return asWebpUrl(MediaType.Icons, group, hash);
}

export function toBannerUrl(userOrGroup: Snowflake, hash?: string | number): string | null {
  return asWebpUrl(MediaType.Banner, userOrGroup, hash);
}

export function getAssetUrl(type: AssetType, id: Snowflake): string {
  return `${api}/media/${type}/${id}.webp`;
}

export function toAttachmentUrl(message: Snowflake, id: Snowflake, name: string): string | null {
  return `${api}/media/${MediaType.Attachments}/${message}/${id}/${name}`;
}

export function asUrl(type: MediaType, id: Snowflake, hash?: string | number): string | null {
  if (hash != null) {
    return `${api}/media/${type}/${id}/${hash}`;
  } else {
    return null;
  }
}

export function asWebpUrl(type: MediaType, id: Snowflake, hash?: string | number): string | null {
  if (hash != null) {
    return `${api}/media/${type}/${id}/${hash}.webp`;
  } else {
    return null;
  }
}
