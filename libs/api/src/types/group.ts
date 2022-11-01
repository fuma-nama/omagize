import { RawGroupEvent } from '../GroupAPI';
import {
  RawGroup,
  RawGroupDetail,
  RawGroupInvite,
  RawMember,
} from '../GroupAPI';
import { Snowflake } from './common';
import { toBannerUrl, toIconUrl } from '../utils/mediaUtils';
import { User } from './user';
import { parseDate } from '../utils/common';

export type Group = {
  id: Snowflake;
  name: string;
  iconHash?: string;
  bannerHash?: string;
  /**
   * true if the user is the owner of group
   */
  owner: Snowflake;

  iconUrl?: string;
  bannerUrl?: string;
};

export function Group(raw: RawGroup): Group {
  return {
    ...raw,
    iconUrl: toIconUrl(raw.id, raw.iconHash),
    bannerUrl: toBannerUrl(raw.id, raw.bannerHash),
  };
}

export type GroupDetail = Group & {
  memberCount: number;
  admins: Member[]; //admins of the group
  events: GroupEvent[];
  /**
   * What does this group about
   */
  introduction?: string;
};

export function GroupDetail(raw: RawGroupDetail): GroupDetail {
  return {
    ...Group(raw),
    admins: raw.admins.map((r) => new Member(r)),
    events: raw.events.map((e) => GroupEvent(e)),
    memberCount: raw.memberCount,
    introduction: raw.introduction,
  };
}

export class Member extends User {
  constructor(raw: RawMember) {
    super(raw);
  }
}

export type GroupInvite = {
  group: Snowflake;
  code: string;
  once: boolean;
  expireAt: Date;
};
export function GroupInvite(raw: RawGroupInvite): GroupInvite {
  return {
    ...raw,
    expireAt: parseDate(raw.expireAt),
  };
}

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
