import { useDisclosure } from '@chakra-ui/react';
import { GroupDetail } from '@omagize/api';
import { DynamicModal } from '@omagize/ui/components';
import { CreateEventModal, GroupInviteModal } from '@omagize/ui/forms';
import { useLeaveModal } from './useLeaveModal';

export function useGroupModals(group: GroupDetail) {
  const CreateEvent = useDisclosure();
  const Invite = useDisclosure();
  const Leave = useLeaveModal(group);

  return {
    CreateEvent,
    Invite,
    Leave,
    modals: (
      <>
        {Leave.modal}
        <DynamicModal isOpen={CreateEvent.isOpen}>
          <CreateEventModal
            isOpen={CreateEvent.isOpen}
            onClose={CreateEvent.onClose}
            group={group.id}
          />
        </DynamicModal>
        <DynamicModal isOpen={Invite.isOpen}>
          <GroupInviteModal isOpen={Invite.isOpen} onClose={Invite.onClose} group={group} />
        </DynamicModal>
      </>
    ),
  };
}
