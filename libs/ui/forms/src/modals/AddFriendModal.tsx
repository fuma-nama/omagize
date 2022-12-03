import {
  Button,
  Flex,
  FormControl,
  FormControlProps,
  FormErrorMessage,
  IconButton,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useModalContext,
} from '@chakra-ui/react';
import { useState } from 'react';
import { BiSend } from 'react-icons/bi';
import { useMutation } from '@tanstack/react-query';
import { parseError, sendFriendRequest, User } from '@omagize/api';
import { useUserStore } from '@omagize/data-access-store';
import { SearchPanel } from '../panel/SearchUserPanel';
import { useSelfUser } from '@omagize/data-access-api';

function useCheckSelected(selected: User | null): string | null {
  const self = useSelfUser();
  const [friends, friendRequests] = useUserStore((s) => [s.relations, s.friendRequests]);

  if (selected == null) return null;
  // prettier-ignore
  return self.id === selected.id? 'Why do you want to add yourself as a friend?' :
    friends?.some(f => f.user.id === selected.id)? 'He already is your friend' : 
    friendRequests?.some(f => f.user.id === selected.id)? 'Friend request had been sent' : null
}

export function AddFriendModal({
  isOpen,
  onClose: closeModal,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<User>();
  const selectChecks = useCheckSelected(selected);
  const disable = selected == null || selectChecks != null;

  const onClose = () => {
    setSelected(null);
    closeModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Send Friend Request</ModalHeader>
        <ModalCloseButton />
        <SearchPanel value={selected} onChange={setSelected} invalid={selectChecks != null} />
        <ModalFooter as={Flex} flexDirection="column" alignItems="stretch">
          {selected != null ? (
            <>
              <Text ml={2} fontWeight="bold">
                {selected.username}
              </Text>
              <MessageBar selected={selected} isDisabled={disable} error={selectChecks} />
            </>
          ) : (
            <Button onClick={onClose}>Close</Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function MessageBar({
  selected,
  error,
  isDisabled,
  ...props
}: { selected: User; error?: string } & FormControlProps) {
  const { onClose } = useModalContext();
  const [message, setMessage] = useState('');
  const mutation = useMutation(() => sendFriendRequest(selected.id, message), {
    onSuccess: onClose,
  });
  const errorMessage = mutation.isError ? parseError(mutation.error) : error;

  return (
    <FormControl isInvalid={errorMessage != null} isDisabled={isDisabled} {...props}>
      <Flex direction="row" gap={2}>
        <Input
          w="full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          variant="main"
          placeholder="Type your message here..."
        />

        <IconButton
          icon={<BiSend />}
          aria-label="Send"
          onClick={() => mutation.mutate()}
          isLoading={mutation.isLoading}
          disabled={mutation.isLoading || isDisabled}
          variant="brand"
          type="submit"
        />
      </Flex>
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  );
}
