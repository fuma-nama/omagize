import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { BiRightArrow } from 'react-icons/bi';
import { useMutation } from '@tanstack/react-query';
import { sendFriendRequest, User } from '@omagize/api';
import {
  SearchUserIDPanel,
  SearchUserNamePanel,
} from '../panel/SearchUserPanel';
import { TabButton } from 'components/layout/Tab';

export default function AddFriendModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<User>();
  const mutation = useMutation(() => sendFriendRequest(selected.id));
  const disable = selected == null || mutation.isLoading;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a Friend</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={5}>You can search the User</Text>
          <Tabs variant="soft-rounded" minH="200px">
            <TabList>
              <TabButton>By Name</TabButton>
              <TabButton>User ID</TabButton>
            </TabList>
            <TabPanels>
              <TabPanel px={0}>
                <SearchUserNamePanel
                  value={selected}
                  onChange={(e) => setSelected(e)}
                />
              </TabPanel>
              <TabPanel px={0}>
                <SearchUserIDPanel
                  value={selected}
                  onChange={(e) => setSelected(e)}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            isLoading={mutation.isLoading}
            disabled={disable}
            variant="brand"
            rightIcon={<BiRightArrow />}
          >
            Send Friend Request
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
