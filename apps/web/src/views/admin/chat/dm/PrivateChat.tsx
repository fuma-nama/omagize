import ChatView, { MessageProvider, MessageView } from 'views/admin/chat/components/ChatView';
import { useEffect, useState } from 'react';
import { usePageStore } from 'stores/PageStore';
import LoadingPanel from 'components/panel/LoadingPanel';
import { openDMChannel, Snowflake, User, useUserInfo } from '@omagize/api';
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
  const query = useUserInfo(user);
  const setInfo = usePageStore((s) => s.updateNavbar);

  useEffect(
    () => setInfo(query.data != null ? { title: query.data.username } : null),
    [query.data]
  );

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
          <Box w="full" h="full" pos="relative">
            {dmQuery.data && <MessageView channel={dmQuery.data?.id} />}
          </Box>
        </ModalBody>
        <ModalFooter p={0}>
          <MessageBar provider={provider} messageBar={{ m: 0 }} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
