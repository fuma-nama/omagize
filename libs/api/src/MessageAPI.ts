import { delay, messages } from './model';
import { Member } from './mappers/Group';

export type Message = {
  id: number;
  author: Member;
  content: string;
  timestamp: Date;
  order_id: number;
};

export async function fetchMessagesLatest(
  groupID: string,
  limit: number = 20
): Promise<Message[]> {
  console.log(
    'latest',
    messages.slice(messages.length - limit - 1, messages.length)
  );
  await delay(2000);
  return messages.slice(messages.length - limit - 1);
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
  const fetched = messages.filter((m) => m.order_id < message.order_id);
  await delay(2000);
  return fetched.slice(fetched.length - limit - 1);
}
