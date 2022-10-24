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
