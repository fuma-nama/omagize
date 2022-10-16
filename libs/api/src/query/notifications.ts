import { useQuery } from '@tanstack/react-query';
import {
  fetchGroupNotifications,
  fetchUserNotifications,
} from '../NotificationsAPI';

export function useUserNotificationsQuery() {
  return useQuery(['user_notifications'], () => fetchUserNotifications());
}

export function useGroupNotificationsQuery(id: string) {
  return useQuery(['group_notifications', id], () =>
    fetchGroupNotifications(id)
  );
}
