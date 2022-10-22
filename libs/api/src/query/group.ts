import { GroupInvite } from './../mappers/Group';
import { replaceMatch } from '../utils/common';
import {
  useInfiniteQuery,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import {
  fetchGroupDetail,
  fetchGroupInvite,
  fetchGroupMembers,
  fetchGroups,
  fetchMemberInfo,
} from '../GroupAPI';
import { Group, GroupDetail, GroupEvent, Snowflake } from '../mappers';
import { client } from './client';
import { Keys } from './keys';

//dispatch
export async function dispatchGroupDetail(detail: GroupDetail) {
  client.setQueryData<Group[]>(Keys.groups, (prev) =>
    replaceMatch(prev, (v) => v.id === detail.id, detail)
  );

  client.setQueryData<GroupDetail>(Keys.groupDetail(detail.id), detail);
}

export function dispatchGroupInvite(invite: GroupInvite) {
  return client.setQueryData<GroupInvite>(
    Keys.groupInvite(invite.group),
    invite
  );
}

export async function addGroup(group: Group) {
  client.setQueryData<Group[]>(Keys.groups, (prev) => {
    const contains = prev.some((g) => g.id === group.id);

    return contains ? prev : [...prev, group];
  });
}

export async function removeGroup(group: Snowflake) {
  client.setQueryData<Group[]>(Keys.groups, (prev) =>
    prev.filter((g) => g.id !== group)
  );
}

export async function addGroupEvent(event: GroupEvent) {
  client.setQueriesData<GroupDetail>(Keys.groupDetail(event.group), (prev) => {
    const events = prev.events;
    const contains = events.some((e) => e.id === event.id);

    return {
      ...prev,
      events: contains ? events : [...events, event],
    };
  });
}

export function useGroupsQuery() {
  return useQuery(Keys.groups, () => fetchGroups());
}

export function useGroupMembersQuery(group: Snowflake) {
  return useInfiniteQuery(
    Keys.members(group),
    ({ pageParam }) => fetchGroupMembers(group, pageParam),
    {
      getNextPageParam: (lastPage) => lastPage[lastPage.length - 1]?.id,
    }
  );
}

//queries
export function useMemberQuery(group: Snowflake, id: Snowflake) {
  return useQuery(Keys.member(group, id), () => fetchMemberInfo(group, id));
}

export function useGroupQuery(id: string) {
  const groups = useGroupsQuery();

  return {
    data: groups.data?.find((group) => group.id === id),
    query: groups,
  };
}

export function useGroupDetailQuery(id: string) {
  return useQuery(Keys.groupDetail(id), () => fetchGroupDetail(id));
}

export function useGroupInviteQuery(
  group: Snowflake,
  options?: UseQueryOptions<GroupInvite>
) {
  return useQuery(Keys.groupInvite(group), () => fetchGroupInvite(group), {
    refetchOnMount: 'always',
    ...options,
  });
}
