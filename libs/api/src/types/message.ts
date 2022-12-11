import { MentionNotification } from './notification';
import { RawAttachment } from '../MessageAPI';
import { DateObject, Snowflake } from './common';
import { RawMentionNotification, User } from '.';
import { toAttachmentUrl } from '../utils';
import { parseDate } from '../utils/common';
import { RawUser } from '../UserAPI';

export type RawChannel = {
  id: Snowflake;
  group?: Snowflake;
  dm?: Snowflake;
  lastRead?: DateObject;
  unreadMentions: RawMentionNotification[];
};

export type Channel = {
  id: Snowflake;
  group?: Snowflake;
  dm?: Snowflake;
  lastRead?: Date;
  unreadMentions: MentionNotification[];
};

export function Channel(raw: RawChannel): Channel {
  return {
    ...raw,
    lastRead: parseDate(raw.lastRead),
    unreadMentions: raw.unreadMentions.map((m) => MentionNotification(m)),
  };
}

export type RawMessage = {
  id: Snowflake;
  channel: Snowflake;
  author: RawUser;
  content: string;
  attachments: RawAttachment[];
  timestamp: DateObject;
  orderId: number;
  /**
   * Mentioned users in the message
   */
  mentions: RawUser[];
  everyone: boolean;
};

export type Message = {
  id: Snowflake;
  channel: Snowflake;
  author: User;
  content: string;
  attachments: Attachment[];
  timestamp: Date;
  orderId: number;

  mentions: User[];
  everyone: boolean;
};

export type Attachment = {
  name: string;
  id: Snowflake;
  message: Snowflake;
  size?: number;
  type?: string;
  url: string;
};

export function Message(raw: RawMessage): Message {
  return {
    ...raw,
    author: new User(raw.author),
    attachments: raw.attachments?.map((a) => Attachment(a)),
    timestamp: parseDate(raw.timestamp),
    mentions: raw.mentions.map((m) => new User(m)),
  };
}

export function Attachment(raw: RawAttachment): Attachment {
  return {
    ...raw,
    url: toAttachmentUrl(raw.message, raw.id, raw.name),
  };
}
