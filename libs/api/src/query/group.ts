import { replaceMatch } from '../utils/utils';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  fetchGroupDetail,
  fetchGroupMembers,
  fetchGroups,
  fetchMemberInfo,
} from '../GroupAPI';
import { Group, GroupDetail, Snowflake } from '../mappers';
import { client } from './client';
import { Keys } from './keys';

//dispatch
export async function dispatchGroupDetail(detail: GroupDetail) {
  client.setQueriesData<Group[]>(Keys.groups, (prev) =>
    replaceMatch(prev, (v) => v.id === detail.id, detail)
  );

  client.setQueryData<GroupDetail>(Keys.groupDetail(detail.id), detail);
}

export async function addGroup(group: Group) {
  client.setQueriesData<Group[]>(Keys.groups, (prev) => {
    const contains = prev.some((g) => g.id === group.id);

    return contains ? prev : [...prev, group];
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
