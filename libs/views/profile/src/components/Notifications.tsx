// Chakra imports
import { Button, Flex, Text } from '@chakra-ui/react';
// Custom components
import { clearUserNotifications } from '@omagize/api';
import { useUserNotificationsQuery } from '@omagize/data-access-api';
import {
  QueryStatusLayout,
  Placeholder,
  Repeat,
  Card,
  CustomCardProps,
} from '@omagize/ui/components';
import { useColors } from '@omagize/ui/theme';
import { NotificationSkeleton, UserNotificationItem } from '@omagize/views/shared';
import { useMutation } from '@tanstack/react-query';
import { BiNotificationOff } from 'react-icons/bi';

export default function Notifications(props: CustomCardProps) {
  const { ...rest } = props;
  // Chakra Color Mode
  const { textColorPrimary } = useColors();

  const query = useUserNotificationsQuery();
  const mutation = useMutation(['clear_user_notifications'], () => clearUserNotifications());

  return (
    <Card p={1} {...rest}>
      <Flex p={5} align="center" w="100%" justify="space-between">
        <Text color={textColorPrimary} fontWeight="bold" fontSize="2xl" mb="4px">
          Notifications
        </Text>
        <Button variant="action" onClick={() => mutation.mutate()} isLoading={mutation.isLoading}>
          Read All
        </Button>
      </Flex>
      <QueryStatusLayout
        query={query}
        watch={query.data}
        placeholder={<Placeholder icon={<BiNotificationOff />}>No Notifcations</Placeholder>}
        error="Failed to fetch Notifications"
        skeleton={
          <Repeat times={3}>
            <NotificationSkeleton />
          </Repeat>
        }
      >
        {query.data?.map((n) => (
          <UserNotificationItem key={n.id} {...n} />
        ))}
      </QueryStatusLayout>
    </Card>
  );
}
