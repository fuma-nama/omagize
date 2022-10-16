import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchMessagesBefore, fetchMessagesLatest } from '../MessageAPI';

export function useInfiniteMessageQuery(group: string) {
  return useInfiniteQuery(
    ['messages', group],
    ({ pageParam }) =>
      pageParam == null
        ? fetchMessagesLatest(group)
        : fetchMessagesBefore(group, pageParam),
    {
      refetchOnMount: false,
      getPreviousPageParam: (first) => first[0],
      refetchOnWindowFocus: false,
    }
  );
}
