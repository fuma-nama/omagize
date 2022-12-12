import { GroupDetail } from '@omagize/api';
import { Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { BiNotificationOff } from 'react-icons/bi';
import { Card, Placeholder, PlaceholderLayout } from '@omagize/ui/components';
import { MentionNotificationItem } from '@omagize/views/shared';
import { useNotifyReadChannelMutation } from '@omagize/data-access-api';

export function GroupNotifications({ group }: { group: GroupDetail }) {
  const channel = group.channel;
  const mutation = useNotifyReadChannelMutation(group.channel.id);

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
          Mentions
        </Text>
        <Button variant="action" isLoading={mutation.isLoading} onClick={() => mutation.mutate()}>
          Clear all
        </Button>
      </Flex>
      <PlaceholderLayout
        watch={channel.unreadMentions}
        placeholder={<Placeholder icon={<BiNotificationOff />}>No Notifcations</Placeholder>}
      >
        {channel.unreadMentions.map((mention) => (
          <MentionNotificationItem key={mention.messageId} mention={mention} />
        ))}
      </PlaceholderLayout>
    </Card>
  );
}
