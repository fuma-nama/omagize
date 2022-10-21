import { Snowflake } from './mappers/types';
import { Message } from './mappers';
import { RawUser } from './UserAPI';
import { RawGroup, RawMember } from './GroupAPI';
import { GroupNotification } from './mappers/Notifications';
import { Member } from './mappers/Group';

export function delay(timeout: number) {
  return new Promise((re) => {
    setTimeout(re, timeout);
  });
}

export const users: RawUser[] = [
  {
    id: '432423423432423',
    username: 'MONEY',
    description: 'Kane is a gay',
    createdAt: Date.now(),
  },
  {
    id: '132423423432453',
    username: 'Kane',
    createdAt: Date.now(),
  },
];

export const notifications: GroupNotification[] = [
  {
    id: '43434343',
    type: 'mention',
    author: new Member(users[0]),
    date: new Date(Date.now()),
  },
];

export const members: RawMember[] = users.map((user) => ({
  ...user,
}));

export const groups: RawGroup[] = [
  {
    id: '54352234532456325433',
    name: 'Study Group',
    iconHash:
      'https://img.duotegame.com/article/contents/2022/07/15/small_2022071554302800.jpg',
    bannerHash:
      'https://img.moelong.com/images/LycorisRecoiltwnews/LycorisRecoiltwnews09.webp',
    owner: users[0].id,
  },
  {
    id: '5435234532456335333',
    name: 'My Funny Chat Group',
    iconHash:
      'https://img.duotegame.com/article/contents/2022/07/15/small_2022071554302800.jpg',
    owner: users[0].id,
  },
];
const modelMessages = [
  {
    author: new Member(members[0]),
    content: 'It is normal',
    timestamp: new Date(Date.now()),
  },
  {
    author: new Member(members[1]),
    content: 'Kane is a gay',
    timestamp: new Date(Date.now()),
  },
  {
    author: new Member(members[0]),
    content: 'Oh, nice to meet you.\nI am a gay',
    timestamp: new Date(Date.now()),
  },
];

export function messages(group: Snowflake): Message[] {
  return [...Array(100)]
    .map((_, i) => ({
      id: i.toString(),
      group: group,
      orderId: i,
      attachments: [],
      ...modelMessages[Math.floor(Math.random() * modelMessages.length)],
    }))
    .map((m, i) => ({
      ...m,
      content: m.content + i,
    }));
}
