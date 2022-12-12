import { Keys } from './queries';
import { InfiniteData, useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { client } from './client';
import {
  Message,
  Snowflake,
  fetchMessagesLatest,
  fetchMessagesBefore,
  notifyReadChannel,
} from '@omagize/api';

export function useInfiniteMessageQuery(channel: Snowflake) {
  return useInfiniteQuery(
    Keys.messages(channel),
    ({ pageParam }) =>
      pageParam == null ? fetchMessagesLatest(channel) : fetchMessagesBefore(channel, pageParam),
    {
      refetchOnMount: false,
      getPreviousPageParam: (first) => first.length !== 0 && first[0],
      refetchOnWindowFocus: false,
    }
  );
}

export function addMessage(message: Message) {
  client.setQueryData<InfiniteData<Message[]>>(
    Keys.messages(message.channel),
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

export function useNotifyReadChannelMutation(channel: Snowflake) {
  return useMutation(['read_channel', channel], () => notifyReadChannel(channel));
}
