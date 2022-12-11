import { Keys } from './queries';
import { useQuery } from '@tanstack/react-query';
import { fetchUserNotifications } from '@omagize/api';

export function useUserNotificationsQuery() {
  return useQuery(Keys.notifications.user, () => fetchUserNotifications());
}
