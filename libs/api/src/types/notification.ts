import { RawUser } from './../UserAPI';
import { parseDate } from '../utils';
import { DateObject } from './common';
import { User } from './user';

export type RawMentionNotification = {
  messageId: string;
  author: RawUser;
  message: string;
  timestamp: DateObject;
};

export type MentionNotification = {
  messageId: string;
  author: User;
  message: string;
  timestamp: Date;
};

export function MentionNotification(raw: RawMentionNotification): MentionNotification {
  return {
    ...raw,
    author: new User(raw.author),
    timestamp: parseDate(raw.timestamp),
  };
}
export type UserNotification = LoginNotification;
export type LoginNotification = {
  id: string;
  type: 'login';
  time: Date;
  from: string; //from ip address
};

//function GroupNotification(raw: RawNotification): UserNotification {}
