import { useChatStore } from 'stores/ChatStore';
import { Group, ReadyPayload } from '@omagize/api';
import { useUserStore } from './UserStore';

export function useGroup(id: string) {
  const groups = useUserStore((s) => s.groups);

  return groups?.find((g: Group) => g.id === id);
}

export function applyReadyPayload(payload: ReadyPayload) {
  useUserStore.getState().acceptPayload(payload);
  useChatStore.getState().acceptPayload(payload);
}
