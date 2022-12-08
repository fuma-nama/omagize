import {
  GroupInvite,
  GroupEvent,
  GroupDetail,
  Snowflake,
  fetchGroupMembers,
  fetchMemberInfo,
  fetchGroupDetail,
  fetchGroupInvite,
  createRole,
  updateRoles,
  UpdateRolesOptions,
  updateMember,
  UpdateMemberOptions,
  Member,
  deleteGroupEvent,
} from '@omagize/api';
import { useInfiniteQuery, useQuery, UseQueryOptions, useMutation } from '@tanstack/react-query';
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

export function useCreateRoleMutation() {
  return useMutation(
    (options: { group: string; name: string }) => createRole(options.group, options.name),
    {
      onSuccess(created, options) {
        client.setQueryData<GroupDetail>(Keys.groupDetail(options.group), (prev) => {
          if (prev == null || prev.roles.some((r) => r.id === created.id)) return null;

          return {
            ...prev,
            roles: [...prev.roles, created].sort((a, b) => a.position - b.position),
          };
        });
      },
    }
  );
}

export function useUpdateRolesMutation() {
  return useMutation(
    (options: { group: string; value: UpdateRolesOptions }) =>
      updateRoles(options.group, options.value),
    {
      async onSuccess(roles, options) {
        return await client.setQueryData<GroupDetail>(
          Keys.groupDetail(options.group),
          (prev) =>
            prev && {
              ...prev,
              roles: roles.roles,
              defaultRole: roles.defaultRole,
            }
        );
      },
    }
  );
}

export function useUpdateMemberMutation() {
  return useMutation(
    ({
      group,
      user,
      options,
    }: {
      group: Snowflake;
      user: Snowflake;
      options: UpdateMemberOptions;
    }) => updateMember(group, user, options),
    {
      async onSuccess(updated, { group, user }) {
        await client.setQueryData<Member>(Keys.member(group, user), updated);
      },
    }
  );
}

export function useDeleteGroupEventMutation() {
  return useMutation((event: GroupEvent) => deleteGroupEvent(event.group, event.id), {
    onSuccess: (_, event) => {
      client.setQueryData<GroupEvent[]>(Keys.groupEvent.all, (prev) =>
        prev?.filter((e) => e.id !== event.id)
      );
      client.setQueryData<GroupDetail>(
        Keys.groupDetail(event.group),
        (prev) =>
          prev && {
            ...prev,
            events: prev.events.filter((e) => e.id !== event.id),
          }
      );
    },
  });
}
