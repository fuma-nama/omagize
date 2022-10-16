import { useQuery } from '@tanstack/react-query';
import { fetchFriends, fetchGroupEvents } from '../UserAPI';
import { useLoginQuery } from './account';

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

export function useFriendsQuery() {
  return useQuery(['friends'], () => fetchFriends());
}
