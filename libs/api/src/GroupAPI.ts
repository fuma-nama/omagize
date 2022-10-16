import { RawUser } from './UserAPI';
import {
  callDefault,
  callReturn,
  stringifyDate,
  toFormData,
  withDefault,
  withDefaultForm,
} from './utils/core';
import { DateObject, Snowflake } from './mappers/types';
import { Group, GroupDetail, Member } from './mappers/Group';
import { GroupEvent } from './mappers/GroupEvents';
import { Reset } from './AccountAPI';

export function GroupDetailKey(group: Snowflake) {
  return ['group_detail', group];
}

export type RawGroup = {
  id: Snowflake;
  name: string;
  iconHash?: string;
  bannerHash?: string;
  owner: Snowflake;
};

export type RawGroupDetail = RawGroup & {
  memberCount: number;
  admins: RawMember[]; //admins of the group
  events: RawGroupEvent[];
  /**
   * What does this group about
   */
  introduction?: string;
};

export type RawMember = RawUser & {
  role?: number;
};

/**
 * Let group members join your Birthdays, parties, and more!
 */
export type RawGroupEvent = {
  id: Snowflake;
  imageHash?: number;
  name: string;
  description?: string;
  startAt: DateObject;
  endAt?: DateObject;
  place?: string;
  group: string;
  author: RawUser;
};

export type UpdateGroupOptions = {
  name?: string;
  banner?: Blob | Reset;
  icon?: Blob | Reset;
  about?: string;

  //options
  mentionEveryone?: boolean;
};
export async function updateGroup(
  group: Snowflake,
  options: UpdateGroupOptions
) {
  await callDefault(
    `/groups/${group}`,
    withDefaultForm({
      method: 'PATCH',
      body: toFormData(options),
    })
  );
}

export function fetchMemberInfo(
  group: Snowflake,
  id: Snowflake
): Promise<Member> {
  return callReturn<RawMember>(
    `/groups/${group}/members/${id}`,
    withDefault({
      method: 'GET',
    })
  ).then((res) => new Member(res));
}

export function fetchGroupDetail(id: Snowflake): Promise<GroupDetail> {
  return callReturn<RawGroupDetail>(
    `/groups/${id}`,
    withDefault({
      method: 'GET',
    })
  ).then((res) => GroupDetail(res));
}

/**
 * Fetch group members starting from specified user
 */
export function fetchGroupMembers(
  group: Snowflake,
  start: Snowflake | null,
  limit: number = 10
): Promise<Member[]> {
  const param = new URLSearchParams();
  if (start != null) param.append('start', start);
  if (limit != null) param.append('limit', limit.toString());

  return callReturn<RawMember[]>(
    `/groups/${group}/members?${param}`,
    withDefault({
      method: 'GET',
    })
  ).then((res) => res.map((user) => new Member(user)));
}

export async function createGroupEvent(
  image: Blob | null,
  name: string,
  description: string,
  startAt: Date,
  endAt: Date,
  place: string | null,
  group: string
): Promise<GroupEvent> {
  const data = new FormData();
  data.append('name', name);
  data.append('description', description);
  data.append('startAt', stringifyDate(startAt));
  if (endAt != null) data.append('endAt', stringifyDate(endAt));
  if (image != null) data.append('image', image);
  if (place != null) data.append('place', place);

  return callReturn<RawGroupEvent>(
    `/groups/${group}/events`,
    withDefaultForm({
      method: 'POST',
      body: data,
    })
  ).then((res) => GroupEvent(res));
}

export function fetchGroups(): Promise<Group[]> {
  return callReturn<RawGroup[]>(
    '/groups',
    withDefault({
      method: 'GET',
    })
  ).then((res) => res.map((group) => Group(group)));
}

export async function createGroup(
  name: string,
  icon?: Blob,
  banner?: Blob
): Promise<Group> {
  const data = new FormData();
  data.append('name', name);
  if (icon != null) data.append('icon', icon);
  if (banner != null) data.append('banner', banner);

  return callReturn<RawGroup>(
    '/groups',
    withDefaultForm({
      method: 'POST',
      body: data,
    })
  ).then((res) => Group(res));
}
