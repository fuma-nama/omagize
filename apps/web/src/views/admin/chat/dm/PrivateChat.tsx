import ChatView, {
  MessageContext,
  MessageProvider,
  MessageView,
} from 'views/admin/chat/components/ChatView';
import LoadingPanel from 'components/panel/LoadingPanel';
import { openDMChannel, Snowflake, User } from '@omagize/api';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
} from '@chakra-ui/react';
import { MessageBar } from '../components/MessageBar';
import { IoOpen } from 'react-icons/io5';
import { CloseIcon } from '@chakra-ui/icons';
import { useDM } from 'utils/navigate';

export default function PrivateChat() {
  const { current } = useDM();

  return <PrivateChatView user={current} />;
}

function PrivateChatView({ user }: { user: Snowflake }) {
  const dmQuery = useQuery(['dm', user], () => openDMChannel(user));

  const provider: MessageProvider = {
    input: {
      useSuggestion: (v) => [],
    },
    channel: dmQuery.data?.id,
  };

  return <>{dmQuery.isLoading ? <LoadingPanel size="sm" /> : <ChatView provider={provider} />}</>;
}

export function PrivateChatModal({ user, onClose }: { user?: User; onClose: () => void }) {
  const userId = user?.id;
  const { openDM } = useDM();
  const dmQuery = useQuery(['dm', userId], () => openDMChannel(userId), {
    enabled: user != null,
  });

  const provider: MessageProvider = {
    input: {
      useSuggestion: (v) => [],
    },
    channel: dmQuery.data?.id,
  };

  const onOpen = () => {
    openDM(userId);
    onClose();
  };

  return (
    <Modal isOpen={user != null} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent
        h="full"
        my="auto"
        maxH={{ base: '100%', md: 'calc(100% - 4vh)' }}
        zIndex={1}
        overflow="hidden"
      >
        <ModalHeader as={HStack} w="full">
          <Heading size="md">{user?.username}</Heading>
          <Spacer />
          <ButtonGroup>
            <Button leftIcon={<IoOpen />} variant="action" onClick={onOpen}>
              Open Chat
            </Button>
            <IconButton icon={<CloseIcon />} aria-label="Close" onClick={onClose} />
          </ButtonGroup>
        </ModalHeader>
        <ModalBody p={0} h="full">
          <MessageContext.Provider value={provider}>
            <Box w="full" h="full" pos="relative">
              {dmQuery.data && <MessageView channel={dmQuery.data?.id} />}
            </Box>
          </MessageContext.Provider>
        </ModalBody>
        <ModalFooter p={0}>
          <MessageBar provider={provider} messageBar={{ rounded: 'md' }} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
