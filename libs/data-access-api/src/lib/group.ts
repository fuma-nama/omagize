import {
  GroupInvite,
  GroupEvent,
  GroupDetail,
  Snowflake,
  fetchGroupMembers,
  fetchMemberInfo,
  fetchGroupDetail,
  fetchGroupInvite,
} from '@omagize/api';
import { useInfiniteQuery, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { client } from './client';
import { Keys } from './queries';

//dispatch
export function dispatchGroupInvite(invite: GroupInvite) {
  return client.setQueryData<GroupInvite>(Keys.groupInvite(invite.group), invite);
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
export function useMemberQuery(group: Snowflake, id: Snowflake, enabled?: boolean) {
  return useQuery(Keys.member(group, id), () => fetchMemberInfo(group, id), {
    enabled,
  });
}

export function useGroupDetailQuery(id: string) {
  return useQuery(Keys.groupDetail(id), () => fetchGroupDetail(id));
}

export function useGroupInviteQuery(group: Snowflake, options?: UseQueryOptions<GroupInvite>) {
  return useQuery(Keys.groupInvite(group), () => fetchGroupInvite(group), {
    refetchOnMount: 'always',
    ...options,
  });
}
