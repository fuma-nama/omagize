import { MentionType } from 'utils/markdown/types';

export interface MentionData {
  avatar?: string;
  name?: string;
  id?: string;

  type?: MentionType;
}

export const Everyone: MentionData = {
  id: 'everyone',
  type: MentionType.Everyone,
};
