import { clearGroupNotifications, useGroupNotificationsQuery } from '@omagize/api';
import { useSelected } from 'utils/navigate';
import { Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';

import Card from 'components/card/Card';
import {
  GroupNotificationItem,
  NotificationSkeleton,
} from 'components/card/notification/Notification';
import { Placeholder, Repeat } from 'components/layout/Container';
import { useMutation } from '@tanstack/react-query';
import { QueryStatusLayout } from 'components/panel/QueryPanel';
import { BiNotificationOff } from 'react-icons/bi';

export function Notifications() {
  const { selectedGroup } = useSelected();
  const query = useGroupNotificationsQuery(selectedGroup);
  const mutation = useMutation(['clear_group_notifications'], () => clearGroupNotifications());

  const textColor = useColorModeValue('secondaryGray.900', 'white');

  return (
    <Card p="0px">
      <Flex
        align={{ sm: 'flex-start', lg: 'center' }}
        justify="space-between"
        w="100%"
        px="22px"
        py="18px"
      >
        <Text color={textColor} fontSize="xl" fontWeight="600">
          Notifications
        </Text>
        <Button variant="action" isLoading={mutation.isLoading} onClick={() => mutation.mutate()}>
          Clear all
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
          <GroupNotificationItem key={n.id} {...n} />
        ))}
      </QueryStatusLayout>
    </Card>
  );
}
