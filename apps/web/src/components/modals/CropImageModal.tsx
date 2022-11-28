import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useImageCropper } from 'components/picker/ImagePicker';
import { ReactElement } from 'react';

export function CropImageModal({
  picker,
}: {
  picker: {
    cropper: ReactElement;
    cancelEdit: () => void;
  };
}) {
  return (
    <Modal
      isOpen={picker.cropper != null}
      onClose={picker.cancelEdit}
      isCentered
      size="xl"
      scrollBehavior="outside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Crop Image</ModalHeader>
        <ModalBody>{picker.cropper}</ModalBody>
      </ModalContent>
    </Modal>
  );
}

export function useModalImageCropper() {
  const { cropper: component, ...cropper } = useImageCropper();

  return {
    ...cropper,
    modal: (
      <CropImageModal
        picker={{
          cancelEdit: () => cropper.setEditing(null),
          cropper: component,
        }}
      />
    ),
  };
}
