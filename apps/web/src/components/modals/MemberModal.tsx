import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useGroupMembersQuery, Snowflake } from '@omagize/api';
import InfiniteScroll from 'react-infinite-scroll-component';
import UserItem from '../card/UserItem';

export default function MemberModal(props: {
  isOpen: boolean;
  onClose: () => void;
  group: Snowflake;
}) {
  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      isCentered
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent overflow="hidden" h="500px">
        <ModalHeader>Group Members</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Members group={props.group} />
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={props.onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function Members({ group }: { group: Snowflake }) {
  const query = useGroupMembersQuery(group);

  return (
    <Flex id="members-div" direction="column">
      <InfiniteScroll
        dataLength={query.data.pages.length}
        next={() => query.fetchNextPage()}
        inverse={true}
        hasMore={query.hasNextPage}
        loader={<h4>Loading...</h4>}
        scrollableTarget="members-div"
      >
        {query.data.pages.map((page) =>
          page.map((member) => <UserItem key={member.id} user={member} />)
        )}
      </InfiniteScroll>
    </Flex>
  );
}
