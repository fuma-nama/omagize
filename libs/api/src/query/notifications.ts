import { Keys } from './queries';
import { useQuery } from '@tanstack/react-query';
import {
  fetchGroupNotifications,
  fetchUserNotifications,
} from '../NotificationsAPI';

export function useUserNotificationsQuery() {
  return useQuery(Keys.notifications.user, () => fetchUserNotifications());
}

export function useGroupNotificationsQuery(id: string) {
  return useQuery(Keys.notifications.group(id), () =>
    fetchGroupNotifications(id)
  );
}
