import { Snowflake } from './types';
import { Message, RawMessage } from './types/message';
import { callDefault, callReturn } from './utils/core';
import { toFormData } from './utils/common';

export type RawAttachment = {
  id: Snowflake;
  name: string;
  message: Snowflake;
  size?: number;
  type?: string;
};

export type Mention = UserMention | RoleMention | EveryoneMention;

export type UserMention = {
  type: 'user';
  id: Snowflake;
};
export type RoleMention = {
  type: 'role';
  id: Snowflake;
};
export type EveryoneMention = {
  type: 'everyone';
};

export async function sendMessage(
  channel: Snowflake,
  content: string,
  attachments: Blob[],
  mentions: Mention[] = []
) {
  const body = toFormData({
    content: content,
    mentions: JSON.stringify(mentions),
  });
  attachments.forEach((a, i) => {
    body.append(`File${i}`, a);
  });

  return callReturn(`/channels/${channel}/messages`, {
    method: 'POST',
    body,
  });
}

export async function fetchMessagesLatest(channel: string, limit: number = 20): Promise<Message[]> {
  const params = new URLSearchParams({
    limit: limit.toString(),
  });

  return callReturn<RawMessage[]>(`/channels/${channel}/messages?${params}`, {
    method: 'GET',
  }).then((res) => res.map((m) => Message(m)));
}

/**
 * Find messages sent before the specified message
 */
export async function fetchMessagesBefore(
  channel: string,
  message: Message,
  limit: number = 20
): Promise<Message[]> {
  console.log('before', message);
  const params = new URLSearchParams({
    limit: limit.toString(),
    before: message.orderId.toString(),
  });

  return callReturn<RawMessage[]>(`/channels/${channel}/messages?${params}`, {
    method: 'GET',
  }).then((res) => res.map((m) => Message(m)));
}

export type EditMessageBody = {
  content: string;
  mentions: Mention[];
};

export async function editMessage(id: Snowflake, channel: Snowflake, body: EditMessageBody) {
  await callDefault(`/channels/${channel}/messages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function deleteMessage(id: Snowflake, channel: Snowflake) {
  await callDefault(`/channels/${channel}/messages/${id}`, {
    method: 'DELETE',
  });
}
