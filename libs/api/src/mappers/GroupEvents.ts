import { User } from './User';
import { RawGroupEvent } from '../GroupAPI';
import { toBannerUrl } from '../utils/mediaUtils';
import { Snowflake } from '../utils/types';
import { parseDate } from '../utils/core';

export type GroupEvent = {
  id: Snowflake;
  imageUrl?: string;
  name: string;
  description?: string;
  startAt: Date;
  endAt?: Date;
  place?: string;
  group: string;
  author: User;
};

export function GroupEvent(raw: RawGroupEvent): GroupEvent {
  return {
    ...raw,
    imageUrl: toBannerUrl(raw.id, raw.imageHash),
    startAt: parseDate(raw.startAt),
    endAt: parseDate(raw.endAt),
    author: new User(raw.author),
  };
}
