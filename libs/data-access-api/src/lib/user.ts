import { SelfUser, LoginPayload, fetchGroupEvents, Snowflake, fetchUserInfo } from '@omagize/api';
import { useQuery } from '@tanstack/react-query';
import { useLoginQuery } from './auth';
import { client } from './client';
import { Keys } from './queries';

export function dispatchUser(user: SelfUser) {
  client.setQueryData<LoginPayload>(Keys.login, (prev) => ({
    ...prev,
    user: user,
  }));
}

export function useSelfUser() {
  const query = useLoginQuery();

  if (query.isLoading) {
    throw new Error('Client must login before accessing self user');
  }
  return query.data.user;
}

export function useGroupEventsQuery() {
  return useQuery(Keys.groupEvent.all, () => fetchGroupEvents());
}

export function useUserInfo(id: Snowflake, enabled?: boolean) {
  return useQuery(Keys.user(id), () => fetchUserInfo(id), {
    enabled,
    staleTime: 30 * 1000,
  });
}
