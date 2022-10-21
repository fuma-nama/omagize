import { DateObject } from './mappers/types';
import { delay, messages } from './model';
import { Snowflake } from './mappers';
import { RawMember } from './GroupAPI';
import { Message } from './mappers/message';
import { callReturn, toFormData, withDefaultForm } from './utils/core';

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
  group: Snowflake;
  hash: number;
};

export async function sendMessage(group: Snowflake, content: string) {
  const body = toFormData({
    content: content,
  });

  callReturn(
    `/groups/${group}/messages`,
    withDefaultForm({
      method: 'POST',
      body,
    })
  );
}

export async function fetchMessagesLatest(
  groupID: string,
  limit: number = 20
): Promise<Message[]> {
  await delay(2000);
  return messages(groupID).slice(messages.length - limit - 1);
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
  const fetched = messages(groupID).filter((m) => m.orderId < message.orderId);
  await delay(2000);
  return fetched.slice(fetched.length - limit - 1);
}
