import { useChatStore } from './stores/ChatStore';
import { Group } from '@omagize/api';
import { useUserStore } from './stores/UserStore';
import { ReadyPayload } from '@omagize/gateway';

export function useGroup(id: string) {
  const groups = useUserStore((s) => s.groups);

  return groups?.find((g: Group) => g.id === id);
}

export function applyReadyPayload(payload: ReadyPayload) {
  useUserStore.getState().acceptPayload(payload);
  useChatStore.getState().acceptPayload(payload);
}
