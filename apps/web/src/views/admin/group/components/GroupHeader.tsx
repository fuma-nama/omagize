import {
  Button,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { CardButton } from 'components/card/Card';
import {
  GroupDetail,
  leaveGroup,
  removeGroup,
  useSelfUser,
} from '@omagize/api';
import { AddIcon, ChatIcon } from '@chakra-ui/icons';
import { BsPeopleFill } from 'react-icons/bs';
import { AiFillSetting } from 'react-icons/ai';
import { CustomCardProps } from 'theme/theme';
import { DynamicModal } from 'components/modals/Modal';
import MemberModal from 'components/modals/MemberModal';
import { useNavigate } from 'react-router-dom';
import { BiAnalyse } from 'react-icons/bi';
import { FcLeave } from 'react-icons/fc';
import { useMutation } from '@tanstack/react-query';
import { useConfirmDialog } from 'components/modals/dialogs/Dialog';

export type GroupHeaderProps = {
  createEvent: () => void;
  invite: () => void;
  group: GroupDetail;
};

export function GroupHeader(props: GroupHeaderProps) {
  const { group } = props;
  const { isOpen, onClose, onToggle } = useDisclosure();
  const navigate = useNavigate();

  function Item({
    text,
    icon,
    ...props
  }: { text: string; icon: any } & CustomCardProps) {
    return (
      <CardButton alignItems="center" gap={2} {...props}>
        {icon}
        <Text fontSize={{ base: 'md', md: 'lg' }}>{text}</Text>
      </CardButton>
    );
  }

  return (
    <>
      <DynamicModal isOpen={isOpen}>
        <MemberModal isOpen={isOpen} onClose={onClose} group={group.id} />
      </DynamicModal>
      <SimpleGrid columns={3} gap={5}>
        <Item
          text="Chat"
          icon={<ChatIcon width="30px" height="30px" />}
          onClick={() => navigate(`/user/chat/${group.id}`)}
        />
        <Item
          text="Members"
          icon={<Icon as={BsPeopleFill} width="30px" height="30px" />}
          onClick={onToggle}
        />
        <Item
          text="Settings"
          icon={<Icon as={AiFillSetting} width="30px" height="30px" />}
          onClick={() => navigate(`/user/${group.id}/settings`)}
        />
      </SimpleGrid>
      <Options {...props} />
    </>
  );
}

function useLeaveModal(group: GroupDetail) {
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

export function Options({ group, createEvent, invite }: GroupHeaderProps) {
  const LeaveModal = useLeaveModal(group);
  return (
    <>
      {LeaveModal.modal}
      <HStack justify="center" wrap="wrap" spacing={0} gap={2}>
        <Button
          rounded="full"
          variant="outline"
          leftIcon={<AddIcon />}
          onClick={createEvent}
        >
          Create Event
        </Button>
        <Button rounded="full" variant="outline" leftIcon={<BiAnalyse />}>
          Analytics
        </Button>
        <Button
          rounded="full"
          variant="brand"
          leftIcon={<BsPeopleFill />}
          onClick={invite}
        >
          Invite People
        </Button>
        <Button
          rounded="full"
          variant="danger"
          leftIcon={<FcLeave />}
          onClick={LeaveModal.onOpen}
        >
          Leave Group
        </Button>
      </HStack>
    </>
  );
}
