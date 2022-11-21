import { RawUser } from '../UserAPI';
import { DateObject, Snowflake } from './common';
import { User } from './user';

export type RawCustomEmoji = {
  id: Snowflake;
  name: string;
  author: RawUser;
  createdAt: DateObject;
};

export type CustomEmoji = {
  id: Snowflake;
  name: string;
  author: User;
  createdAt: Date;
};

export function CustomEmoji(raw: RawCustomEmoji): CustomEmoji {
  return {
    ...raw,
    author: new User(raw.author),
    createdAt: new Date(raw.createdAt),
  };
}

export type RawCustomSticker = {
  id: Snowflake;
  name: string;
  author: RawUser;
  createdAt: DateObject;
};

export type CustomSticker = {
  id: Snowflake;
  name: string;
  author: User;
  createdAt: Date;
};

export function CustomSticker(raw: RawCustomSticker): CustomSticker {
  return {
    ...raw,
    author: new User(raw.author),
    createdAt: new Date(raw.createdAt),
  };
}
