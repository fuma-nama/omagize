import { Message, Snowflake } from '../mappers';
import { Keys } from './keys';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchMessagesBefore, fetchMessagesLatest } from '../MessageAPI';
import { client } from './client';

export function useInfiniteMessageQuery(group: Snowflake) {
  return useInfiniteQuery(
    Keys.messages(group),
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

export function addMessage(message: Message) {
  /*
  client.setQueryData<Message[]>(Keys.messages(message.group), (prev) => ({
    
  }))

  */
}
