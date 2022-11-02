import { RawUser } from './UserAPI';
import { callDefault, callReturn } from './utils/core';
import { stringifyDate } from './utils/common';
import { toFormData } from './utils/common';
import { DateObject, Snowflake } from './types/common';
import { Group, GroupDetail, GroupInvite, Member } from './types/group';
import { GroupEvent } from './types/group';
import { Reset } from './AccountAPI';

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
  admin?: boolean;
};

export type RawMemberClip = {
  group: Snowflake;
  user: Snowflake;
  admin: boolean;
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

export type RawGroupInvite = {
  group: Snowflake;
  code: string;
  once: boolean;
  expireAt: DateObject;
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
  await callDefault(`/groups/${group}`, {
    method: 'PATCH',
    body: toFormData(options),
  });
}

export function fetchMemberInfo(
  group: Snowflake,
  id: Snowflake
): Promise<Member> {
  return callReturn<RawMember>(`/groups/${group}/members/${id}`, {
    method: 'GET',
  }).then((res) => new Member(res));
}

export function fetchGroupDetail(id: Snowflake): Promise<GroupDetail> {
  return callReturn<RawGroupDetail>(`/groups/${id}`, {
    method: 'GET',
  }).then((res) => GroupDetail(res));
}

export async function searchMembers(
  group: Snowflake,
  query?: string,
  limit: number = 10
) {
  const param = new URLSearchParams({
    query: query,
    limit: limit.toString(),
  });

  return await callReturn<RawMember[]>(
    `/groups/${group}/members/search?${param}`,
    {
      method: 'GET',
    }
  ).then((res) => res.map((user) => new Member(user)));
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

  return callReturn<RawMember[]>(`/groups/${group}/members?${param}`, {
    method: 'GET',
  }).then((res) => res.map((user) => new Member(user)));
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

  return callReturn<RawGroupEvent>(`/groups/${group}/events`, {
    method: 'POST',
    body: data,
  }).then((res) => GroupEvent(res));
}

export function fetchGroups(): Promise<Group[]> {
  return callReturn<RawGroup[]>('/groups', {
    method: 'GET',
  }).then((res) => res.map((group) => Group(group)));
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

  return callReturn<RawGroup>('/groups', {
    method: 'POST',
    body: data,
  }).then((res) => Group(res));
}

export function joinGroup(code: string) {
  return callReturn<RawGroupDetail>(`/groups/join?code=${code}`, {
    method: 'POST',
  });
}

export function fetchGroupInvite(group: string) {
  return callReturn<RawGroupInvite>(`/groups/${group}/invite`, {}).then((res) =>
    GroupInvite(res)
  );
}

export function modifyGroupInvite(
  group: string,
  once: boolean,
  expire: Date | null
) {
  return callReturn<RawGroupInvite>(`/groups/${group}/invite`, {
    contentType: 'application/json',
    body: JSON.stringify({
      once,
      expire: stringifyDate(expire),
    }),
    method: 'PATCH',
  }).then((res) => GroupInvite(res));
}

export function leaveGroup(group: Snowflake) {
  return callDefault(`/groups/${group}/leave`, {
    method: 'POST',
  });
}
