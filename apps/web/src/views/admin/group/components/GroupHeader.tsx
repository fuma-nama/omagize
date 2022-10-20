import {
  Button,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { CardButton } from 'components/card/Card';
import { GroupDetail } from '@omagize/api';
import { AddIcon, ChatIcon } from '@chakra-ui/icons';
import { BsPeopleFill } from 'react-icons/bs';
import { AiFillSetting } from 'react-icons/ai';
import { CustomCardProps } from 'theme/theme';
import { DynamicModal } from 'components/modals/Modal';
import MemberModal from 'components/modals/MemberModal';
import { useNavigate } from 'react-router-dom';
import { BiAnalyse } from 'react-icons/bi';
import { FcLeave } from 'react-icons/fc';

export function GroupHeader(props: { group: GroupDetail }) {
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
    </>
  );
}

export function Options(props: {
  createEvent: () => void;
  invite: () => void;
}) {
  return (
    <HStack justify="center" wrap="wrap" spacing={0} gap={2}>
      <Button
        rounded="full"
        variant="outline"
        leftIcon={<AddIcon />}
        onClick={() => props.createEvent()}
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
        onClick={() => props.invite()}
      >
        Invite People
      </Button>
      <Button rounded="full" variant="danger" leftIcon={<FcLeave />}>
        Leave Group
      </Button>
    </HStack>
  );
}
