import { delay } from './model';
import { DateObject } from './types/common';
import { UserNotification } from './types/notification';

export type RawNotification = {
  id: string;
  type: 'mention';
  date: DateObject;
};

export async function clearGroupNotifications() {
  await delay(3000);
}

export function fetchUserNotifications(): UserNotification[] {
  return [];
}

export async function clearUserNotifications() {
  await delay(2000);
}
