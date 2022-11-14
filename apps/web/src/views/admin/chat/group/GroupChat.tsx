import ChatView, { MessageProvider } from 'views/admin/chat/components/ChatView';
import { useEffect, useState } from 'react';
import { useSelected } from 'utils/navigate';
import { useGroup } from 'stores/hooks';
import { usePageStore } from 'stores/PageStore';
import LoadingPanel from 'components/panel/LoadingPanel';
import { searchMembers } from '@omagize/api';
import { useQuery } from '@tanstack/react-query';

export default function GroupChat() {
  const { selectedGroup } = useSelected();
  const group = useGroup(selectedGroup);
  const setInfo = usePageStore((s) => s.updateNavbar);

  useEffect(() => setInfo(group != null ? { title: group.name } : null), [group]);

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
        setSearch: (s) => setSearch(s),
        suggestions:
          query.data?.map((member) => ({
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
