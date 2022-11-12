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
import { sendFriendRequest, User, useSelfUser } from '@omagize/api';
import { SearchUserIDPanel, SearchUserNamePanel } from '../panel/SearchUserPanel';
import { TabButton } from 'components/layout/Tab';
import { parseError } from 'utils/APIUtils';
import { useUserStore } from 'stores/UserStore';

export default function AddFriendModal({
  isOpen,
  onClose: closeModal,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const self = useSelfUser();
  const [selected, setSelected] = useState<User>();
  const mutation = useMutation(() => sendFriendRequest(selected.id));
  const [friends, friendRequests] = useUserStore((s) => [s.friends, s.friendRequests]);

  // prettier-ignore
  const selectChecks = self.id === selected?.id? 'Why do you want to add yourself as a friend?' :
    friends?.some(f => f.user.id === selected?.id)? 'He already is your friend' : 
    friendRequests?.some(f => f.user.id === selected?.id)? 'Already have existing friend request' : null

  const disable = selected == null || selectChecks != null || mutation.isLoading;
  const error = mutation.isError ? parseError(mutation.error) : selectChecks;

  const onClose = () => {
    setSelected(null);
    closeModal();
  };

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
                  isInvalid={selectChecks != null}
                />
              </TabPanel>
              <TabPanel px={0}>
                <SearchUserIDPanel
                  value={selected}
                  onChange={(e) => setSelected(e)}
                  isInvalid={selectChecks != null}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Text color="red.400">{error}</Text>
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
