import { RawUser } from './UserAPI';
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
  /**
   * Mentioned users in the message
   */
  mentions: RawUser[];
};

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
  group: Snowflake,
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
