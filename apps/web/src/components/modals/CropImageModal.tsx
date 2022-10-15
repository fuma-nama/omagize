import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { CropProps, CustomImageCropper } from './Modal';

export function CropImageModal(props: CropProps) {
  const ref = useRef<HTMLImageElement>();
  const onClose = () => props.crop.onCrop(null);

  return (
    <Modal isOpen={props.crop != null} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crop Image</ModalHeader>
        <ModalBody>
          <CustomImageCropper
            img={ref}
            crop={props.crop}
            aspect={props.aspect ?? 1}
          />
        </ModalBody>
        <ModalFooter gap={1}>
          <Button onClick={onClose}>Close</Button>
          <Button
            variant="brand"
            onClick={() => props.crop.onCrop(ref.current)}
          >
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
