import { useGroupQuery, GroupEvent } from '@omagize/api';
import Card, { TagCard } from './Card';
import {
  Avatar,
  Flex,
  HStack,
  Image,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  StackProps,
  Text,
} from '@chakra-ui/react';
import { useColors } from 'variables/colors';
import { stringOfTime } from 'utils/DateUtils';

function Info({
  name,
  value,
  ...rest
}: { name: string; value: any } & StackProps) {
  const { textColorPrimary, textColorSecondary, globalBg } = useColors();

  return (
    <TagCard bg={globalBg} {...rest}>
      <Text color={textColorSecondary} fontWeight="bold">
        {name}
      </Text>
      <Text color={textColorPrimary}>{value}</Text>
    </TagCard>
  );
}

export function GlobalGroupEventItem({ event }: { event: GroupEvent }) {
  const group = useGroupQuery(event.group);
  const { globalBg } = useColors();

  const happening = event.startAt <= new Date(Date.now());
  const iconSize = '35px';

  return (
    <Card overflow="hidden" gap={3}>
      <Flex direction="row" flexWrap="wrap" gap={2}>
        {happening && <EventStarted />}
        <TagCard bg={globalBg}>
          {!!group ? (
            <>
              <Avatar
                src={group.iconUrl}
                name={group.name}
                w={iconSize}
                h={iconSize}
              />
              <Text fontWeight="bold">{group.name}</Text>
            </>
          ) : (
            <>
              <SkeletonCircle w={iconSize} h={iconSize} />
              <SkeletonText noOfLines={2} w="100px" h="23px" />
            </>
          )}
        </TagCard>
      </Flex>
      <GroupEventContent event={event} />
      <Flex direction="row" flexWrap="wrap" gap={4} mt="auto" pt={2}>
        {!!event.place && <Info name="Take Place At" value={event.place} />}

        {happening ? (
          !!event.endAt && (
            <Info name="End At" value={stringOfTime(event.endAt)} />
          )
        ) : (
          <Info name="Starting At" value={stringOfTime(event.startAt)} />
        )}
      </Flex>
    </Card>
  );
}

export default function GroupEventItem({ event }: { event: GroupEvent }) {
  const happening = event.startAt <= new Date(Date.now());

  return (
    <Card overflow="hidden" gap={3}>
      {happening && (
        <Flex direction="row" gap={2} wrap="wrap">
          <EventStarted />
          {!!event.endAt && (
            <Info name="End At" value={stringOfTime(event.endAt)} />
          )}
        </Flex>
      )}
      <GroupEventContent event={event} />
      <Flex direction="row" flexWrap="wrap" gap={4} mt="auto" pt={2}>
        {!!event.place && <Info name="Take Place At" value={event.place} />}

        {!happening && (
          <Info name="Starting At" value={stringOfTime(event.startAt)} />
        )}
      </Flex>
    </Card>
  );
}

function EventStarted() {
  return (
    <TagCard bg="green.500">
      <Text color="white" fontWeight="bold" fontSize="md">
        Event Started
      </Text>
    </TagCard>
  );
}

function GroupEventContent({ event }: { event: GroupEvent }) {
  const { textColorPrimary, textColorSecondary } = useColors();
  const author = event.author;

  return (
    <>
      <Image
        w="full"
        objectFit="cover"
        src={event.imageUrl}
        maxH="200px"
        rounded="lg"
      />

      <HStack justify="space-between">
        <Flex direction="column">
          <Text color={textColorPrimary} fontWeight="bold" fontSize="md">
            {event.name}
          </Text>
          <Text color={textColorSecondary}>{event.description}</Text>
          <Text color={textColorSecondary}>By {author.username}</Text>
        </Flex>
        <Avatar src={author.avatarUrl} name={author.username} />
      </HStack>
    </>
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
