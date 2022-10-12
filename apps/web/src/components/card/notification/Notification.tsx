import {
  Center,
  Flex,
  Icon,
  Skeleton,
  SkeletonText,
  Text,
} from '@chakra-ui/react';
import { useColors, useItemHoverBg } from 'variables/colors';
import Card from '../Card';
import { GoMention } from 'react-icons/go';
import React from 'react';
import { IconType } from 'react-icons';
import {
  GroupNotification,
  MentionNotification,
} from '../../../api/types/Notifications';

export function NotificationSkeleton() {
  const bgItem = useItemHoverBg();

  return (
    <Card
      _hover={bgItem}
      bg="transparent"
      px="24px"
      py="21px"
      transition="0.2s linear"
    >
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
export function GenericItem({
  icon,
  title,
  description,
  time,
}: {
  icon: IconType;
  title: string;
  description?: string;
  time: string;
}) {
  const { textColorPrimary, textColorSecondary } = useColors();
  const bgItem = useItemHoverBg();

  return (
    <Card
      _hover={bgItem}
      bg="transparent"
      px="20px"
      py="21px"
      transition="0.2s linear"
    >
      <Flex direction="row" align="start" gap="12px">
        <Center bg="brand.400" p="10px" rounded="xl" h="full">
          <Icon as={icon} color="white" width="30px" height="30px" />
        </Center>
        <Flex flexGrow={1} direction="column">
          <Flex direction="row" mb="5px">
            <Text
              flex={1}
              color={textColorPrimary}
              fontSize="md"
              fontWeight="bold"
            >
              {title}
            </Text>
            <Text fontWeight="700" fontSize="sm" color={textColorSecondary}>
              {time}
            </Text>
          </Flex>
          <Text color={textColorSecondary}>{description}</Text>
        </Flex>
      </Flex>
    </Card>
  );
}

export function GroupNotificationItem(props: GroupNotification & any) {
  switch (props.type) {
    case 'mention':
      return <MentionNotificationItem {...props} />;
    default:
      return <></>;
  }
}

function MentionNotificationItem(props: MentionNotification) {
  const { author, date } = props;

  return (
    <GenericItem
      icon={GoMention}
      title={`${author.username} Mentioned You`}
      time={date.toLocaleTimeString()}
    />
  );
}