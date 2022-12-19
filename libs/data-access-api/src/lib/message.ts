import { useUserStore } from '@omagize/data-access-store';
import { Keys } from './queries';
import { InfiniteData, useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { client } from './client';
import {
  Message,
  Snowflake,
  fetchMessagesLatest,
  fetchMessagesBefore,
  notifyReadChannel,
  Channel,
  GroupDetail,
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
  return useMutation(['read_channel', channel], () => notifyReadChannel(channel), {
    onSuccess() {
      const { groups } = useUserStore.getState();
      const group = groups.find((g) => g.channel.id === channel);
      const data: Partial<Channel> = {
        lastRead: new Date(Date.now()),
        unreadMentions: [],
      };

      useUserStore.setState({
        groups: groups.map((group) =>
          group.channel.id === channel
            ? {
                ...group,
                channel: {
                  ...group.channel,
                  ...data,
                },
              }
            : group
        ),
      });

      client.setQueryData<GroupDetail>(
        Keys.groupDetail(group.id),
        (old) =>
          old != null && {
            ...old,
            channel: {
              ...old.channel,
              ...data,
            },
          }
      );
    },
  });
}
