import { RawGroupEvent } from '../GroupAPI';
import { RawGroup, RawGroupInvite, RawMember } from '../GroupAPI';
import { Snowflake } from './common';
import { toBannerUrl, toIconUrl } from '../utils/mediaUtils';
import { User } from './user';
import { parseDate } from '../utils/common';
import { Channel } from './message';
import { DefaultRole, Role } from './role';

export type Group = {
  id: Snowflake;
  name: string;
  channel: Channel;
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
    channel: Channel(raw.channel),
    iconUrl: toIconUrl(raw.id, raw.iconHash),
    bannerUrl: toBannerUrl(raw.id, raw.bannerHash),
  };
}

export type RawGroupDetail = RawGroup & {
  memberCount: number;
  events: RawGroupEvent[];
  defaultRole: DefaultRole;
  roles: Role[];
  /**
   * What does this group about
   */
  introduction?: string;
};

export type GroupDetail = Group & {
  memberCount: number;
  events: GroupEvent[];
  roles: Role[];
  defaultRole: DefaultRole;
  /**
   * What does this group about
   */
  introduction?: string;
};

export function GroupDetail(raw: RawGroupDetail): GroupDetail {
  return {
    ...Group(raw),
    channel: Channel(raw.channel),
    events: raw.events.map((e) => GroupEvent(e)),
    memberCount: raw.memberCount,
    introduction: raw.introduction,
    defaultRole: raw.defaultRole,
    roles: raw.roles,
  };
}

export class Member extends User {
  role: Role;

  constructor(raw: RawMember) {
    super(raw);
    this.role = raw.role;
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
