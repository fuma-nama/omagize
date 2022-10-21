import { Message, Snowflake } from '../mappers';
import { Keys } from './keys';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
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
  client.setQueryData<InfiniteData<Message[]>>(
    Keys.messages(message.group),
    ({ pages, ...prev }) => {
      const next: Message[][] = [...pages];

      if (next.length === 0) {
        next.push([message]);
      } else {
        const last = next[next.length - 1];
        next[next.length - 1] = [...last, message];
      }

      return {
        ...prev,
        pages: next,
      };
    }
  );
}
