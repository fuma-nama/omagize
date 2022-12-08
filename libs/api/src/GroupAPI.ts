import { callDefault, callReturn } from './utils/core';
import { stringifyDate } from './utils/common';
import { toFormData } from './utils/common';
import { Snowflake } from './types/common';
import { Group, GroupDetail, GroupInvite, Member } from './types/group';
import { GroupEvent } from './types/group';
import { Reset } from './AccountAPI';
import {
  RawGroupDetail,
  Role,
  DefaultRole,
  RoleObject as RolesObject,
  RawGroup,
  RawGroupEvent,
  RawGroupInvite,
  RawMember,
} from './types';

export type UpdateGroupOptions = {
  name?: string;
  banner?: Blob | Reset;
  icon?: Blob | Reset;
  about?: string;

  //options
  mentionEveryone?: boolean;
};

export type UpdateRolesOptions = {
  positions?: {
    [key: Snowflake]: number;
  };
  roles?: {
    [key: Snowflake]: UpdateRole;
  };
  defaultRole?: UpdateDefaultRole;
};

export type UpdateRolesOptionsMapped = {
  positions?: Array<{ id: Snowflake; position: number }>;
  roles?: {
    [key: Snowflake]: UpdateRole;
  };
  defaultRole?: UpdateDefaultRole;
};

export type UpdateRole = Partial<Omit<Role, 'id' | 'group' | 'position'>>;
export type UpdateDefaultRole = Partial<Omit<DefaultRole, 'group'>>;

export async function updateGroup(group: Snowflake, options: UpdateGroupOptions) {
  await callDefault(`/groups/${group}`, {
    method: 'PATCH',
    body: toFormData(options),
  });
}

export function fetchMemberInfo(group: Snowflake, id: Snowflake): Promise<Member> {
  return callReturn<RawMember>(`/groups/${group}/members/${id}`, {
    method: 'GET',
  }).then((res) => new Member(res));
}

export function fetchGroupDetail(id: Snowflake): Promise<GroupDetail> {
  return callReturn<RawGroupDetail>(`/groups/${id}`, {
    method: 'GET',
  }).then((res) => GroupDetail(res));
}

export async function searchMembers(group: Snowflake, query?: string, limit: number = 10) {
  const param = new URLSearchParams({
    query: query,
    limit: limit.toString(),
  });

  return await callReturn<RawMember[]>(`/groups/${group}/members/search?${param}`, {
    method: 'GET',
  }).then((res) => res.map((user) => new Member(user)));
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
  const data = toFormData({
    name: name,
    description: description,
    startAt: startAt,
    endAt: endAt,
    image: image,
    place: place,
  });

  return callReturn<RawGroupEvent>(`/groups/${group}/events`, {
    method: 'POST',
    body: data,
  }).then((res) => GroupEvent(res));
}

export async function deleteGroupEvent(group: Snowflake, event: Snowflake) {
  return await callDefault(`/groups/${group}/events/${event}`, {
    method: 'DELETE',
  });
}

export function fetchGroups(): Promise<Group[]> {
  return callReturn<RawGroup[]>('/groups', {
    method: 'GET',
  }).then((res) => res.map((group) => Group(group)));
}

export async function createGroup(name: string, icon?: Blob, banner?: Blob): Promise<Group> {
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
  return callReturn<RawGroupInvite>(`/groups/${group}/invite`, {}).then((res) => GroupInvite(res));
}

export function modifyGroupInvite(group: string, once: boolean, expire: Date | null) {
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

export async function fetchRoles(group: Snowflake) {
  return await callReturn<RolesObject>(`/groups/${group}/roles`, {
    method: 'GET',
  });
}

/**
 * Update role settings
 * @returns all roles
 */
export async function updateRoles(group: Snowflake, options: UpdateRolesOptions) {
  const mapped: UpdateRolesOptionsMapped = {
    ...options,
    positions:
      options.positions != null
        ? Object.entries(options.positions).map(([id, position]) => ({ id, position }))
        : null,
  };
  return await callReturn<RolesObject>(`/groups/${group}/roles`, {
    method: 'PATCH',
    body: JSON.stringify(mapped),
  });
}

export async function createRole(group: Snowflake, name: string) {
  return await callReturn<Role>(`/groups/${group}/roles`, {
    method: 'POST',
    body: JSON.stringify({
      name: name,
    }),
  });
}

export type UpdateMemberOptions = {
  /**
   * Set user's role, will be ignored if `removeRole` is true
   */
  role?: Snowflake;
  /**
   * If true, remove the current role
   */
  removeRole?: true;
};

export async function updateMember(
  group: Snowflake,
  user: Snowflake,
  options: UpdateMemberOptions
) {
  return await callReturn<RawMember>(`/groups/${group}/members/${user}`, {
    method: 'PATCH',
    body: JSON.stringify(options),
  }).then((res) => new Member(res));
}
