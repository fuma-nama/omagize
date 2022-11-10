import { useQuery } from '@tanstack/react-query';
import { LoginPayload, SelfUser } from '../types';
import { fetchGroupEvents } from '../UserAPI';
import { useLoginQuery } from './account';
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
    throw 'Client must login before accessing self user';
  }
  return query.data.user;
}

export function useGroupEventsQuery() {
  return useQuery(['all_group_event'], () => fetchGroupEvents());
}
