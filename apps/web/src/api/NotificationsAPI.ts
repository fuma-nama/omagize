import { delay, groups, notifications } from './model';
import { useQuery } from '@tanstack/react-query';
import { DateObject } from './utils/types';
import { GroupNotification, UserNotification } from './types/Notifications';

export type RawNotification = {
  id: string;
  type: 'mention';
  date: DateObject;
};

export function fetchGroupNotifications(id: string): GroupNotification[] {
  return notifications;
}

export function useGroupNotificationsQuery(id: string) {
  return useQuery(['group_notifications', id], () =>
    fetchGroupNotifications(id)
  );
}

export async function clearGroupNotifications() {
  await delay(3000);
}

export function fetchUserNotifications(): UserNotification[] {
  return [
    ...notifications.map((n) => ({
      ...n,
      group: groups[0].id,
    })),
    {
      id: '32423432',
      type: 'login',
      time: new Date(Date.now()),
      from: 'Hong Kong',
    },
  ];
}

export function useUserNotificationsQuery() {
  return useQuery(['user_notifications'], () => fetchUserNotifications());
}

export async function clearUserNotifications() {
  await delay(2000);
}
