import { RawAttachment } from './../MessageAPI';
import { Snowflake } from './types';
import { Member } from '.';
import { RawMessage } from '../MessageAPI';
import { toAttachmentUrl } from '../utils';
import { parseDate } from '../utils/core';

export type Message = {
  id: Snowflake;
  group: Snowflake;
  author: Member;
  content: string;
  attachments: Attachment[];
  timestamp: Date;
  orderId: number;
};

export type Attachment = {
  group: Snowflake;
  hash: number;
  url: string;
};

export function Message(raw: RawMessage): Message {
  return {
    ...raw,
    author: new Member(raw.author),
    attachments: raw.attachments?.map((a) => Attachment(a)),
    timestamp: parseDate(raw.timestamp),
  };
}

export function Attachment(raw: RawAttachment): Attachment {
  return {
    ...raw,
    url: toAttachmentUrl(raw.group, raw.hash),
  };
}
