import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { firebase, FirebaseAuth } from '@omagize/api';
import { useMutation } from '@tanstack/react-query';
import { useColors } from '@omagize/ui/theme';

export function useResetPasswordModal() {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const mutation = useMutation((email: string) => FirebaseAuth.resetPassword(email), {
    onSuccess: () => onOpen(),
  });
  const { textColorPrimary } = useColors();

  //<Image src={emailSent} h={20} mt={-20} mx="auto" />
  return {
    mutation,
    resetCurrentUser: () => mutation.mutate(firebase.auth.currentUser.email),
    modal: (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Check your email</ModalHeader>
          <ModalBody color={textColorPrimary}>
            We had sent an Email to <b>{mutation.variables}</b>
            <br />
            Please check the email to reset your Password
          </ModalBody>
          <ModalFooter>
            <Button variant="brand" onClick={onClose}>
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    ),
  };
}
