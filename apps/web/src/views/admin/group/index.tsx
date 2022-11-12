import { useEffect } from 'react';
// Chakra imports
import { Center, Flex, Grid, SimpleGrid, Text } from '@chakra-ui/react';

// Custom components
import AdminsCard from './components/AdminsCard';
import Card, { CardButton } from 'components/card/Card';
import { useSelected } from 'utils/navigate';
import { Notifications } from './components/Notifications';
import { useGroupDetailQuery, GroupDetail } from '@omagize/api';
import GroupEventItem from 'components/card/GroupEventItem';
import { AddIcon } from '@chakra-ui/icons';
import { useColors } from 'variables/colors';
import LoadingPanel from 'components/panel/LoadingPanel';
import { ErrorPanel } from 'components/panel/ErrorPanel';
import { GroupHeader, OptionsMenu } from './components/GroupHeader';
import AutoImage from 'components/card/utils/AutoImage';
import { MessagesPreview } from './MessagesPreview';
import Banner from './components/Banner';
import { useGroupModals } from './modals/useGroupModals';
import { usePageStore } from 'stores/PageStore';
import { useGroup } from 'stores/hooks';

export default function GroupOverview() {
  const { selectedGroup } = useSelected();

  const setInfo = usePageStore((s) => s.updateNavbar);
  const group = useGroup(selectedGroup);
  const query = useGroupDetailQuery(selectedGroup);
  useEffect(() => setInfo(group != null && { title: group.name }), [group]);

  if (query.isLoading) {
    return <LoadingPanel size="sm" />;
  }
  if (query.isError) {
    return (
      <ErrorPanel retry={() => query.refetch()}>
        Failed to load Group
      </ErrorPanel>
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
        <Main group={group} />
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

function Main({ group }: { group: GroupDetail }) {
  const { CreateEvent, Invite, Leave, modals } = useGroupModals(group);

  return (
    <>
      {modals}
      <OptionsMenu
        createEvent={CreateEvent.onOpen}
        invite={Invite.onOpen}
        leave={Leave.onOpen}
        group={group}
      >
        <Banner />
      </OptionsMenu>
      <Flex direction="column" flexGrow={1} mt="25px" mb="20px" gap="20px">
        <GroupHeader
          createEvent={CreateEvent.onOpen}
          invite={Invite.onOpen}
          group={group}
        />
        <GroupEvents onOpen={CreateEvent.onOpen} detail={group} />
        <Text fontSize="2xl" fontWeight="600">
          Recent Messages
        </Text>
        <MessagesPreview />
      </Flex>
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
