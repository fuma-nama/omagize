import { searchMembers } from '@omagize/api';
import { useGroup } from '@omagize/data-access-store';
import { useSelected } from '@omagize/utils/route-utils';
import { useQuery } from '@tanstack/react-query';
import { ChatView, MessageProvider } from '../components';
import { LoadingPanel } from '@omagize/ui/components';
import { MentionType } from '@omagize/utils/markdown';

export function GroupChatView() {
  const { selectedGroup } = useSelected();
  const group = useGroup(selectedGroup);

  const provider: MessageProvider = {
    input: {
      useSuggestion(search) {
        const query = useQuery(
          ['search_member', selectedGroup, search],
          () => searchMembers(selectedGroup, search, 10),
          {
            enabled: search != null,
          }
        );

        return (
          query.data?.map((member) => ({
            type: MentionType.User,
            id: member.id,
            name: member.username,
            avatar: member.avatarUrl,
          })) ?? []
        );
      },
    },
    channel: group?.channel?.id,
  };

  return group == null ? <LoadingPanel size="sm" /> : <ChatView provider={provider} />;
}
