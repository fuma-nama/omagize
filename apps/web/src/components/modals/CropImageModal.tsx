import { Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { Reset } from '@omagize/api';
import { BasePickerProps, useImagePickerCrop } from 'components/picker/ImagePicker';
import { ReactElement } from 'react';
import { Format } from 'utils/ImageUtils';

export function CropImageModal({
  picker,
}: {
  picker: {
    cropper: ReactElement;
    cancelEdit: () => void;
  };
}) {
  return (
    <Modal isOpen={picker.cropper != null} onClose={picker.cancelEdit} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crop Image</ModalHeader>
        <ModalBody>{picker.cropper}</ModalBody>
      </ModalContent>
    </Modal>
  );
}

export function useImagePickerCropModal<T extends Blob | Reset>(
  value: T,
  onChange: (file: T) => void,
  format: Format,
  picker: BasePickerProps = {}
) {
  const base = useImagePickerCrop(value, onChange, format, picker);

  return {
    url: base.url,
    select: base.filePicker.select,
    cancelEdit: base.cancelEdit,
    component: (
      <>
        {base.filePicker.component}
        <CropImageModal picker={base} />
      </>
    ),
  };
}
