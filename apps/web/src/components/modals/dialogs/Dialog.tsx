import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

export default function Dialog({
  isOpen,
  onClose,
  buttons,
  children,
  header,
}: {
  isOpen: boolean;
  onClose: () => void;
  header: string;
  buttons: ReactNode;
  children: ReactNode;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{header}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter gap={2}>
          {buttons}
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export function useConfirmDialog(
  {
    message,
    header,
  }: {
    header: string;
    message?: string | ReactNode;
  },
  button: (onClose: () => void) => ReactNode
) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return {
    onOpen,
    modal: (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{header}</ModalHeader>
          <ModalBody>
            <Text>{message}</Text>
          </ModalBody>
          <ModalFooter gap={2}>
            {button(onClose)}
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    ),
  };
}
