import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { BiRightArrow } from 'react-icons/bi';
import { useMutation } from '@tanstack/react-query';
import { sendFriendRequest } from '@omagize/api';

export default function AddFriendModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [id, setId] = useState('');
  const mutation = useMutation(['send_friend_request', id], () =>
    sendFriendRequest(id)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a Friend</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={5}>You can find the Friend ID from user profile</Text>
          <FormControl isRequired isInvalid={mutation.isError}>
            <FormLabel>Friend ID</FormLabel>
            <Input
              value={id}
              onChange={(e) => setId(e.target.value)}
              variant="main"
              placeholder="XXXXXX"
            />
            <FormErrorMessage>{mutation.error?.toString()}</FormErrorMessage>
            <FormHelperText hidden={mutation.isError}>
              Friend ID is a 6-length number
            </FormHelperText>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            isLoading={mutation.isLoading}
            disabled={id.length !== 6}
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
