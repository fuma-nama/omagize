import { GroupEvent } from '@omagize/api';
import { CustomCardProps, Card, HSeparator } from '@omagize/ui/components';
import {
  Avatar,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Skeleton,
  SkeletonText,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { MdDateRange, MdPlace } from 'react-icons/md';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { DeleteIcon } from '@chakra-ui/icons';
import { useGroup } from '@omagize/data-access-store';
import { useColors } from '@omagize/ui/theme';
import { stringOfTime } from '@omagize/utils/common';
import { useSelected } from '@omagize/utils/route-utils';
import { useDeleteGroupEventMutation } from '@omagize/data-access-api';

export function GlobalGroupEventItem({ event, ...props }: { event: GroupEvent } & CustomCardProps) {
  const { brand, textColorPrimary, textColorSecondary } = useColors();
  const group = useGroup(event.group);
  const happening = event.startAt <= new Date(Date.now());
  const { setSelectedGroup } = useSelected();

  return (
    <Card overflow="hidden" gap={1} p={0} {...props}>
      <HStack
        w="full"
        bg={happening ? brand : 'transparent'}
        p={3}
        color={happening ? 'white' : textColorPrimary}
      >
        <Icon as={MdDateRange} />
        <Text fontWeight="bold">
          {happening ? 'Event Started' : `Start at ${stringOfTime(event.startAt)}`}
        </Text>
        {happening && event.endAt && <Text fontSize="sm">End at {stringOfTime(event.endAt)}</Text>}
      </HStack>
      <GroupEventContent event={event} />

      <HSeparator mt="auto" />
      <Flex direction="row" px={4} py={2} gap={2}>
        {group != null && (
          <HStack spacing={2} cursor="pointer" onClick={() => setSelectedGroup(event.group)}>
            <Avatar src={group.iconUrl} name={group.name} size="sm" />
            <Text fontWeight="600">{group.name}</Text>
          </HStack>
        )}
        {event.place != null && (
          <HStack spacing={1} color={textColorSecondary}>
            <Icon as={MdPlace} />
            <Text fontWeight="600">{event.place}</Text>
          </HStack>
        )}
        <Spacer />
        <GroupEventActions happening={happening} event={event} />
      </Flex>
    </Card>
  );
}

export function GroupEventItem({ event }: { event: GroupEvent }) {
  const { brand, textColorPrimary, textColorSecondary } = useColors();
  const happening = event.startAt <= new Date(Date.now());

  return (
    <Card overflow="hidden" gap={1} p={0}>
      <HStack
        w="full"
        bg={happening ? brand : 'transparent'}
        p={3}
        color={happening ? 'white' : textColorPrimary}
      >
        <Icon as={MdDateRange} />
        <Text fontWeight="bold">
          {happening ? 'Event Started' : `Start at ${stringOfTime(event.startAt)}`}
        </Text>
        {happening && event.endAt && <Text fontSize="sm">End at {stringOfTime(event.endAt)}</Text>}
      </HStack>
      <GroupEventContent event={event} />

      <HSeparator mt="auto" />
      <Flex direction="row" px={4} py={2} gap={2}>
        {event.place != null && (
          <HStack spacing={1} color={textColorSecondary}>
            <Icon as={MdPlace} />
            <Text fontWeight="600">{event.place}</Text>
          </HStack>
        )}
        <Spacer />
        <GroupEventActions happening={happening} event={event} />
      </Flex>
    </Card>
  );
}

function GroupEventContent({ event }: { event: GroupEvent }) {
  const { textColorPrimary, textColorSecondary } = useColors();
  const author = event.author;

  return (
    <Flex p={4} direction="row" gap={2}>
      {event.imageUrl && (
        <Image w="30%" objectFit="cover" src={event.imageUrl} maxH="200px" rounded="lg" />
      )}

      <Flex direction="column" w="full">
        <Text color={textColorPrimary} fontWeight="bold" fontSize="xl">
          {event.name}
        </Text>
        <Text color={textColorSecondary}>{event.description}</Text>
        <Text color={textColorSecondary}>By {author.username}</Text>
      </Flex>
    </Flex>
  );
}

function GroupEventActions({ happening, event }: { happening: boolean; event: GroupEvent }) {
  const deleteMutation = useDeleteGroupEventMutation();

  return (
    <>
      <Button
        onClick={() => deleteMutation.mutate(event)}
        isLoading={deleteMutation.isLoading}
        {...(happening
          ? {
              variant: 'brand',
              children: 'End Event',
            }
          : {
              leftIcon: <DeleteIcon />,
              variant: 'danger',
              children: 'Delete',
            })}
      />

      <IconButton aria-label="options" icon={<BiDotsHorizontalRounded />} />
    </>
  );
}

export function GroupEventSkeleton() {
  return (
    <Card overflow="hidden">
      <Flex direction="row" gap={5}>
        <Skeleton w="100px" h="100px" rounded="lg" />
        <Flex direction="column" gap={3}>
          <Skeleton w="200px" h="20px" />
          <SkeletonText w="full" noOfLines={2} />
        </Flex>
      </Flex>

      <Flex direction="row" flexWrap="wrap" gap={4} mt={10} ml="auto">
        <Skeleton w="120px" h="25px" />
        <Skeleton w="100px" h="25px" />
      </Flex>
    </Card>
  );
}
