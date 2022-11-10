import { Group } from '@omagize/api';
import { useUserStore } from './UserStore';

export function useGroup(id: string) {
  const groups = useUserStore((s) => s.groups);

  return groups?.find((g: Group) => g.id === id);
}
