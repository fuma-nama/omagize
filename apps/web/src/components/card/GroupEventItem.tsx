import { GroupEvent } from '@omagize/api';
import Card from './Card';
import {
  Avatar,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
} from '@chakra-ui/react';
import { useColors } from 'variables/colors';
import { stringOfTime } from 'utils/DateUtils';
import { useGroup } from 'stores/hooks';
import { MdDateRange, MdPlace } from 'react-icons/md';
import { HSeparator } from 'components/layout/Separator';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { DeleteIcon } from '@chakra-ui/icons';
import { CustomCardProps } from 'theme/theme';

export function GlobalGroupEventItem({ event, ...props }: { event: GroupEvent } & CustomCardProps) {
  const { brand, textColorPrimary, textColorSecondary } = useColors();
  const group = useGroup(event.group);
  const happening = event.startAt <= new Date(Date.now());

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
      <Flex direction="row" px={4} py={2} color={textColorSecondary} gap={2}>
        {group != null && (
          <HStack spacing={2}>
            <Avatar src={group.iconUrl} name={group.name} size="sm" />
            <Text fontWeight="600">{group.name}</Text>
          </HStack>
        )}
        {event.place != null && (
          <HStack spacing={1}>
            <Icon as={MdPlace} />
            <Text fontWeight="600">{event.place}</Text>
          </HStack>
        )}
        <Button ml="auto" variant="danger" leftIcon={<DeleteIcon />}>
          Delete
        </Button>
        <IconButton aria-label="options" icon={<BiDotsHorizontalRounded />} />
      </Flex>
    </Card>
  );
}

export default function GroupEventItem({ event }: { event: GroupEvent }) {
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
      <Flex direction="row" px={4} py={2} color={textColorSecondary} gap={2}>
        {event.place != null && (
          <HStack spacing={1}>
            <Icon as={MdPlace} />
            <Text fontWeight="600">{event.place}</Text>
          </HStack>
        )}
        <Button ml="auto" variant="danger" leftIcon={<DeleteIcon />}>
          Delete
        </Button>
        <IconButton aria-label="options" icon={<BiDotsHorizontalRounded />} />
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

export function GroupEventSkeleton() {
  return (
    <Card overflow="hidden" gap={3}>
      <Skeleton w="full" h="200px" rounded="lg" />

      <HStack justify="space-between">
        <Flex direction="column" gap={3}>
          <Skeleton w="200px" h="20px" />
          <SkeletonText w="full" noOfLines={2} />
        </Flex>
        <SkeletonCircle w="40px" h="40px" />
      </HStack>

      <Flex direction="row" flexWrap="wrap" gap={4} mt={2}>
        <Skeleton w="120px" h="25px" />
        <Skeleton w="100px" h="25px" />
      </Flex>
    </Card>
  );
}
