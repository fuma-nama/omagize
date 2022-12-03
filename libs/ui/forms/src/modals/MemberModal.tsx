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
import { Snowflake } from '@omagize/api';
import { useGroupMembersQuery } from '@omagize/data-access-api';
import { UserItem } from '@omagize/ui/items';
import InfiniteScroll from 'react-infinite-scroll-component';

export function MemberModal(props: { isOpen: boolean; onClose: () => void; group: Snowflake }) {
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
          <Members group={props.group} enabled={props.isOpen} />
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

function Members({ group, enabled }: { group: Snowflake; enabled: boolean }) {
  const query = useGroupMembersQuery(group, enabled);

  return (
    <Flex
      direction="column"
      gap={2}
      as={InfiniteScroll as any}
      dataLength={query.data.pages.length}
      next={() => query.fetchNextPage()}
      hasMore={query.hasNextPage}
      loader={<h4>Loading...</h4>}
      scrollableTarget="members-div"
    >
      {query.data.pages.map((page) =>
        page.map((member) => <UserItem key={member.id} user={member} />)
      )}
    </Flex>
  );
}
