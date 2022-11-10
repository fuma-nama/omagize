import ChatView from 'views/admin/chat/components/ChatView';
import { useEffect } from 'react';
import { useSelected } from 'utils/navigate';
import { useGroup } from 'stores/hooks';
import { usePageStore } from 'stores/PageStore';

export default function GroupChat() {
  const { selectedGroup } = useSelected();
  const group = useGroup(selectedGroup);
  const setInfo = usePageStore((s) => s.updateNavbar);
  // useGroupDetailQuery(selectedGroup);

  useEffect(
    () => setInfo(group != null ? { title: group.name } : null),
    [group]
  );

  return <ChatView />;
}
