import { clearGroupNotifications } from '@omagize/api';
import { useGroupNotificationsQuery } from '@omagize/data-access-api';
import { useSelected } from '@omagize/utils/route-utils';
import { Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { BiNotificationOff } from 'react-icons/bi';
import { useMutation } from '@tanstack/react-query';
import { Repeat, Card, QueryStatusLayout, Placeholder } from '@omagize/ui/components';
import { NotificationSkeleton, GroupNotificationItem } from '@omagize/views/shared';

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
