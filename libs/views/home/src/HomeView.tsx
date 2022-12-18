// Chakra imports
import { Flex, HStack, Text } from '@chakra-ui/react';
// Custom components
import Banner from './components/Banner';
import { useGroupEventsQuery, useSelfUser } from '@omagize/data-access-api';
import Friends from './components/Friends';
import { Carousel, LeftButton, Provider, RightButton } from 'chakra-ui-carousel';
import { GlobalGroupEventItem, GroupEventSkeleton } from '@omagize/views/shared';

export function HomeView() {
  // Chakra Color Mode
  const user = useSelfUser();

  return (
    <Flex direction="column" gap={5} mb={10} px="10px">
      <Banner user={user} />
      <Events />
      <Friends />
    </Flex>
  );
}

function Events() {
  const query = useGroupEventsQuery();

  const empty = query.data != null && query.data.length === 0;
  if (empty) return null;
  return (
    <Flex direction="column" gap={3}>
      <Provider>
        <HStack>
          <Text fontSize="2xl" fontWeight="700">
            Group Events
          </Text>
          <LeftButton variant="action" />
          <RightButton variant="action" />
        </HStack>
        <Carousel
          gap={20}
          children={
            query.data != null
              ? query.data.map((event) => (
                  <GlobalGroupEventItem key={event.id} event={event} minW="fit-content" />
                ))
              : [
                  <GroupEventSkeleton key={0} />,
                  <GroupEventSkeleton key={1} />,
                  <GroupEventSkeleton key={2} />,
                ]
          }
        />
      </Provider>
    </Flex>
  );
}
