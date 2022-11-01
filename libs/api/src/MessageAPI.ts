import { DateObject } from './types/common';
import { delay } from './model';
import { Snowflake } from './types';
import { RawMember } from './GroupAPI';
import { Message } from './types/message';
import { callReturn } from './utils/core';
import { toFormData } from './utils/common';

export type RawMessage = {
  id: Snowflake;
  group: Snowflake;
  author: RawMember;
  content: string;
  attachments: RawAttachment[];
  timestamp: DateObject;
  orderId: number;
};

export type RawAttachment = {
  id: Snowflake;
  name: string;
  message: Snowflake;
  size?: number;
  type?: string;
};

export async function sendMessage(
  group: Snowflake,
  content: string,
  attachments: Blob[]
) {
  const body = toFormData({
    content: content,
  });
  attachments.forEach((a, i) => {
    body.append(`File${i}`, a);
  });

  return callReturn(`/groups/${group}/messages`, {
    method: 'POST',
    body,
  });
}

export async function fetchMessagesLatest(
  groupID: string,
  limit: number = 20
): Promise<Message[]> {
  await delay(2000);
  const params = new URLSearchParams({
    limit: limit.toString(),
  });

  return callReturn<RawMessage[]>(`/groups/${groupID}/messages?${params}`, {
    method: 'GET',
  }).then((res) => res.map((m) => Message(m)));
}

/**
 * Find messages sent before the specified message
 */
export async function fetchMessagesBefore(
  groupID: string,
  message: Message,
  limit: number = 20
): Promise<Message[]> {
  console.log('before', message);
  const params = new URLSearchParams({
    limit: limit.toString(),
    before: message.orderId.toString(),
  });

  return callReturn<RawMessage[]>(`/groups/${groupID}/messages?${params}`, {
    method: 'GET',
  }).then((res) => res.map((m) => Message(m)));
}
