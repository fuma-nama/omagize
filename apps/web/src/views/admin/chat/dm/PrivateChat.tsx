import ChatView, {
  MessageContext,
  MessageProvider,
  MessageView,
} from 'views/admin/chat/components/ChatView';
import { useState } from 'react';
import LoadingPanel from 'components/panel/LoadingPanel';
import { openDMChannel, Snowflake, User } from '@omagize/api';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { MessageBar } from '../components/MessageBar';
export default function PrivateChat() {
  const { user } = useParams();

  return <PrivateChatView user={user} />;
}

function PrivateChatView({ user }: { user: Snowflake }) {
  const dmQuery = useQuery(['dm', user], () => openDMChannel(user));

  const provider: MessageProvider = {
    useInput() {
      const [search, setSearch] = useState<string | null>(null);

      return {
        search,
        setSearch: (s) => setSearch(s),
        suggestions: [],
      };
    },

    channel: dmQuery.data?.id,
  };

  return <>{dmQuery.isLoading ? <LoadingPanel size="sm" /> : <ChatView provider={provider} />}</>;
}

export function PrivateChatModal({ user, onClose }: { user?: User; onClose: () => void }) {
  const userId = user?.id;
  const dmQuery = useQuery(['dm', userId], () => openDMChannel(userId), {
    enabled: user != null,
  });

  const provider: MessageProvider = {
    useInput() {
      const [search, setSearch] = useState<string | null>(null);

      return {
        search,
        setSearch: (s) => setSearch(s),
        suggestions: [],
      };
    },

    channel: dmQuery.data?.id,
  };

  return (
    <Modal isOpen={user != null} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent h="full" my="auto" maxH={{ base: '100%', md: 'calc(100% - 4vh)' }}>
        <ModalHeader>{user?.username}</ModalHeader>
        <ModalCloseButton />
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
