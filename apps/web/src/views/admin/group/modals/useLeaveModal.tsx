import { Button } from '@chakra-ui/react';
import {
  GroupDetail,
  leaveGroup,
  removeGroup,
  useSelfUser,
} from '@omagize/api';
import { useMutation } from '@tanstack/react-query';
import { useConfirmDialog } from 'components/modals/dialogs/Dialog';

export function useLeaveModal(group: GroupDetail) {
  const user = useSelfUser();
  const isOwner = group.owner === user.id;
  function Content(onClose: () => void) {
    const leaveMutation = useMutation(
      ['leave_group', group.id],
      () => leaveGroup(group.id),
      {
        onSuccess() {
          onClose();
          return removeGroup(group.id);
        },
      }
    );

    return (
      <Button
        variant="action"
        isLoading={leaveMutation.isLoading}
        onClick={() => leaveMutation.mutate()}
      >
        Leave
      </Button>
    );
  }

  return useConfirmDialog(
    {
      header: 'Do you sure to Leave this Group?',
      message: isOwner
        ? 'The Group will be deleted after you leave'
        : 'You may join the Group again with an invite code',
    },
    Content
  );
}
