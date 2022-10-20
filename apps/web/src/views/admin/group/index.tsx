import { useContext, useEffect } from 'react';
// Chakra imports
import {
  Box,
  Center,
  Flex,
  Grid,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

// Custom components
import Banner from './components/Banner';
import AdminsCard from './components/AdminsCard';
import Card, { CardButton } from 'components/card/Card';
import { PageContext } from 'contexts/PageContext';
import { Notifications } from './components/Notifications';
import {
  useInfiniteMessageQuery,
  useGroupDetailQuery,
  GroupDetail,
} from '@omagize/api';
import MessageItem, {
  MessageItemSkeleton,
} from 'components/card/chat/MessageItem';
import { QueryErrorPanel } from 'components/card/ErrorPanel';
import GroupEventItem from 'components/card/GroupEventItem';
import { Holder } from 'utils/Container';
import { AddIcon } from '@chakra-ui/icons';
import { useColors } from 'variables/colors';
import CreateEventModal from 'components/modals/CreateEventModal';
import { DynamicModal } from 'components/modals/Modal';
import LoadingScreen from 'components/screens/LoadingScreen';
import { ErrorScreen } from 'components/screens/ErrorScreen';
import { GroupHeader } from './components/GroupHeader';
import AutoImage from 'components/card/utils/AutoImage';
import GroupInviteModal from 'components/modals/GroupInviteModal';

export default function GroupOverview() {
  const { selectedGroup, setInfo } = useContext(PageContext);
  const query = useGroupDetailQuery(selectedGroup);
  useEffect(
    () => setInfo({ title: query.isLoading ? null : query.data.name }),
    [query.data]
  );

  if (query.isLoading) {
    return <LoadingScreen />;
  }
  if (query.isError) {
    return (
      <ErrorScreen retry={() => query.refetch()}>
        Failed to load Group
      </ErrorScreen>
    );
  }

  return <Content group={query.data} />;
}

function Content({ group }: { group: GroupDetail }) {
  return (
    <Grid
      h="full"
      mb="20px"
      gridTemplateColumns={{ xl: 'repeat(2, 1fr)', '2xl': '1fr 0.46fr' }}
      gap={{ base: '20px', xl: '20px' }}
      display={{ base: 'block', xl: 'grid' }}
    >
      <Flex
        flexDirection="column"
        gridArea={{ xl: '1 / 1 / 2 / 3', '2xl': '1 / 1 / 2 / 2' }}
      >
        <Banner />
        <Flex direction="column" flexGrow={1} mt="25px" mb="20px" gap="20px">
          <Header group={group} />
          <Text fontSize="2xl" fontWeight="600">
            Recent Messages
          </Text>
          <MessagesPreview />
        </Flex>
      </Flex>
      <Flex
        direction="column"
        gap="20px"
        gridArea={{ xl: '1 / 3 / 2 / 4', '2xl': '1 / 2 / 2 / 3' }}
      >
        <About group={group} />
        <Card px="0px">
          <AdminsCard group={group} />
        </Card>
        <Notifications />
      </Flex>
    </Grid>
  );
}

function Header({ group }: { group: GroupDetail }) {
  const CreateEvent = useDisclosure();
  const Invite = useDisclosure();

  return (
    <>
      <DynamicModal isOpen={CreateEvent.isOpen}>
        <CreateEventModal
          isOpen={CreateEvent.isOpen}
          onClose={CreateEvent.onClose}
          group={group.id}
        />
      </DynamicModal>
      <DynamicModal isOpen={Invite.isOpen}>
        <GroupInviteModal
          isOpen={Invite.isOpen}
          onClose={Invite.onClose}
          group={group}
        />
      </DynamicModal>
      <GroupHeader
        createEvent={CreateEvent.onOpen}
        invite={Invite.onOpen}
        group={group}
      />
      <GroupEvents onOpen={CreateEvent.onOpen} detail={group} />
    </>
  );
}

function About({ group }: { group: GroupDetail }) {
  const { textColorPrimary, textColorSecondary } = useColors();
  const empty = group.introduction == null || group.introduction.length === 0;

  return (
    <Card p={0} overflow="hidden" color={textColorPrimary}>
      <AutoImage src={group.bannerUrl} height="100px" objectFit="cover" />
      <Flex direction="column" p="20px">
        <Text fontSize="2xl" fontWeight="bold" mb="10px">
          About
        </Text>
        {empty ? (
          <Text color={textColorSecondary}>No Introduction</Text>
        ) : (
          <Text whiteSpace="pre-line">{group.introduction}</Text>
        )}
      </Flex>
    </Card>
  );
}

function GroupEvents({
  detail,
  onOpen,
}: {
  detail: GroupDetail;
  onOpen: () => void;
}) {
  const { textColorSecondary } = useColors();
  const atBottom = detail.events.length === 0 || detail.events.length % 2 === 0;

  return (
    <SimpleGrid
      columns={{
        base: 1,
        md: 2,
      }}
      gap={3}
    >
      {detail.events.map((e) => (
        <GroupEventItem key={e.id} event={e} />
      ))}
      {!atBottom && (
        <CardButton onClick={() => onOpen()}>
          <Center
            p="50px"
            color={textColorSecondary}
            h="full"
            flexDirection="column"
            gap={3}
          >
            <AddIcon w="50px" h="50px" />
            <Text>Create Event</Text>
          </Center>
        </CardButton>
      )}
    </SimpleGrid>
  );
}

function MessagesPreview() {
  const { selectedGroup } = useContext(PageContext);
  const query = useInfiniteMessageQuery(selectedGroup);

  if (query.error) {
    return (
      <Box flexGrow={1}>
        <QueryErrorPanel query={query} />
      </Box>
    );
  }

  return (
    <Flex direction="column-reverse" maxH="1000px" overflow="auto">
      <Holder
        isLoading={query.isLoading}
        skeleton={
          <>
            <MessageItemSkeleton noOfLines={4} />
            <MessageItemSkeleton noOfLines={2} />
            <MessageItemSkeleton noOfLines={6} />
            <MessageItemSkeleton noOfLines={1} />
          </>
        }
      >
        {() => {
          const pages = query.data.pages;
          const lastPage = pages[pages.length - 1];

          return lastPage
            .slice(lastPage.length - 8, lastPage.length - 1)
            .map((message) => <MessageItem key={message.id} {...message} />);
        }}
      </Holder>
    </Flex>
  );
}
