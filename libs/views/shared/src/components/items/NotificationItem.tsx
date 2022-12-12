import { Card, Center, Flex, Icon, Skeleton, SkeletonText, Text } from '@chakra-ui/react';
import { GoMention } from 'react-icons/go';
import { IconType } from 'react-icons';
import { LoginNotification, MentionNotification, UserNotification } from '@omagize/api';
import { useItemHoverBg, useColors } from '@omagize/ui/theme';
import { AiFillWarning } from 'react-icons/ai';
import { ReactNode } from 'react';

export function NotificationSkeleton() {
  const bgItem = useItemHoverBg();

  return (
    <Card _hover={bgItem} bg="transparent" px="24px" py="21px" transition="0.2s linear">
      <Flex direction="row" align="center" justify="center" gap="12px" w="full">
        <Skeleton w="50px" h="50px" rounded="xl" />
        <SkeletonText
          flexGrow={1}
          mb="5px"
          noOfLines={2}
          me={{ base: '4px', md: '32px', xl: '10px', '3xl': '32px' }}
        />
        <Skeleton w="40px" h="20px" ms="auto" />
      </Flex>
    </Card>
  );
}

export function NotificationItem({
  icon,
  title,
  description,
  time,
  children,
}: {
  icon: IconType;
  title: string;
  description?: string;
  time: string;
  children?: ReactNode;
}) {
  const { textColorPrimary, textColorSecondary } = useColors();
  const bgItem = useItemHoverBg();

  return (
    <Card _hover={bgItem} bg="transparent" px="20px" py="21px" transition="0.2s linear">
      <Flex direction="row" align="start" gap="12px">
        <Center bg="brand.400" p="10px" rounded="xl" h="full">
          <Icon as={icon} color="white" width="30px" height="30px" />
        </Center>
        <Flex flexGrow={1} direction="column">
          <Flex direction="row" mb="5px" gap={2}>
            <Text flex={1} color={textColorPrimary} fontSize="md" fontWeight="bold">
              {title}
            </Text>
            <Text fontWeight="700" fontSize="sm" color={textColorSecondary}>
              {time}
            </Text>
          </Flex>
          <Text color={textColorSecondary}>{description}</Text>
          {children}
        </Flex>
      </Flex>
    </Card>
  );
}

export function MentionNotificationItem({ mention }: { mention: MentionNotification }) {
  return (
    <NotificationItem
      icon={GoMention}
      title={`${mention.author.username} Mentioned You`}
      time={mention.timestamp.toLocaleTimeString()}
      description={mention.message}
    />
  );
}

export function UserNotificationItem(props: UserNotification) {
  switch (props.type) {
    case 'login':
      return <LoginNotificationItem {...props} />;
  }
}

function LoginNotificationItem({ from, time }: LoginNotification) {
  return (
    <NotificationItem
      icon={AiFillWarning}
      title={`New Login From ${from}`}
      description={`Something Logged in to your Account From ${from}`}
      time={time.toLocaleTimeString()}
    />
  );
}
