import ChatView, { MessageProvider } from 'views/admin/chat/components/ChatView';
import { useState } from 'react';
import { useSelected } from 'utils/navigate';
import { useGroup } from 'stores/hooks';
import LoadingPanel from 'components/panel/LoadingPanel';
import { searchMembers } from '@omagize/api';
import { useQuery } from '@tanstack/react-query';
import { MentionType } from 'utils/markdown/types';

export default function GroupChat() {
  const { selectedGroup } = useSelected();
  const group = useGroup(selectedGroup);

  const provider: MessageProvider = {
    useInput() {
      const [search, setSearch] = useState<string | null>(null);
      const query = useQuery(
        ['search_member', selectedGroup, search],
        () => searchMembers(selectedGroup, search, 10),
        {
          enabled: search != null,
        }
      );

      return {
        search,
        setSearch,
        suggestions:
          query.data?.map((member) => ({
            type: MentionType.User,
            id: member.id,
            name: member.username,
            avatar: member.avatarUrl,
          })) ?? [],
      };
    },

    channel: group?.channel?.id,
  };

  return <>{group == null ? <LoadingPanel size="sm" /> : <ChatView provider={provider} />}</>;
}
