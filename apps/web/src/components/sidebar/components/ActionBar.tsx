import { Button, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import CreateGroupModal from '../../modals/CreateGroup';
import { DynamicModal } from '../../modals/Modal';
import { AddGroupModal } from 'components/modals/AddGroupModal';

export default function ActionBar() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Button w="full" leftIcon={<AddIcon />} onClick={onOpen} mb={3}>
        Add Group
      </Button>
      <DynamicModal isOpen={isOpen}>
        <AddGroupModal isOpen={isOpen} onClose={onClose} />
      </DynamicModal>
    </>
  );
}
