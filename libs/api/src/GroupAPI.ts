import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { groups, members } from './model';
import { RawUser } from './UserAPI';
import { UploadImage } from '../utils/ImageUtils';
import {
  callReturn,
  stringifyDate,
  withDefault,
  withDefaultForm,
} from './utils/core';
import { DateObject, Snowflake } from './utils/types';
import { Group, GroupDetail, Member } from './types/Group';
import { GroupEvent } from './types/GroupEvents';

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
  if (!!start) param.append('start', start);
  if (!!limit) param.append('limit', limit.toString());

  return callReturn<RawMember[]>(
    `/groups/${group}/members?${param}`,
    withDefault({
      method: 'GET',
    })
  ).then((res) => res.map((user) => new Member(user)));
}

export async function createGroupEvent(
  image: UploadImage | null,
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
  if (!!endAt) data.append('endAt', stringifyDate(endAt));
  if (!!image) data.append('image', image);
  if (!!place) data.append('place', place);

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
  icon?: UploadImage,
  banner?: UploadImage
): Promise<Group> {
  const data = new FormData();
  data.append('name', name);
  if (!!icon) data.append('icon', icon);
  if (!!banner) data.append('banner', banner);

  return callReturn<RawGroup>(
    '/groups',
    withDefaultForm({
      method: 'POST',
      body: data,
    })
  ).then((res) => Group(res));
}

export function useGroupsQuery() {
  return useQuery(['groups'], () => fetchGroups());
}

export function useGroupMembersQuery(group: Snowflake) {
  return useInfiniteQuery(
    ['members', group],
    ({ pageParam }) => fetchGroupMembers(group, pageParam),
    {
      getNextPageParam: (lastPage) => lastPage[lastPage.length - 1]?.id,
    }
  );
}

export function useGroupQuery(id: string) {
  const groups = useGroupsQuery();

  return {
    data: groups.data?.find((group) => group.id === id),
    query: groups,
  };
}

export function useGroupDetailQuery(id: string) {
  return useQuery(['group_detail', id], () => fetchGroupDetail(id));
}
