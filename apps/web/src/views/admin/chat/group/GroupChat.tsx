import ChatView from 'views/admin/chat/components/ChatView';
import { useEffect } from 'react';
import { useSelected } from 'utils/navigate';
import { useGroup } from 'stores/hooks';
import { usePageStore } from 'stores/PageStore';
import LoadingPanel from 'components/panel/LoadingPanel';

export default function GroupChat() {
  const { selectedGroup } = useSelected();
  const group = useGroup(selectedGroup);
  const setInfo = usePageStore((s) => s.updateNavbar);

  useEffect(() => setInfo(group != null ? { title: group.name } : null), [group]);

  return (
    <>{group == null ? <LoadingPanel size="sm" /> : <ChatView channel={group.channel.id} />}</>
  );
}
