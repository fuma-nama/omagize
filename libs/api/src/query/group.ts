import { useUserStore } from './../../../../apps/web/src/stores/UserStore';
import { GroupInvite } from '../types/group';
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
  fetchMemberInfo,
} from '../GroupAPI';
import { Group, GroupDetail, GroupEvent, Snowflake } from '../types';
import { client } from './client';
import { Keys } from './queries';

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

export function useGroupMembersQuery(group: Snowflake, enabled?: boolean) {
  return useInfiniteQuery(
    Keys.members(group),
    ({ pageParam }) => fetchGroupMembers(group, pageParam),
    {
      enabled,
      getNextPageParam: (lastPage) => lastPage[lastPage.length - 1]?.id,
    }
  );
}

//queries
export function useMemberQuery(group: Snowflake, id: Snowflake) {
  return useQuery(Keys.member(group, id), () => fetchMemberInfo(group, id));
}

export function useGroupQuery(id: string) {
  const groups = useUserStore((s) => s.groups);

  return groups?.find((g: Group) => g.id === id);
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
