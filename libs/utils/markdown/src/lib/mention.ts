import { MentionType } from './types';

export interface MentionSuggestion {
  avatar?: string;
  name?: string;
  id?: string;

  type?: MentionType;
}

export const EveryoneSuggestion: MentionSuggestion = {
  id: 'everyone',
  type: MentionType.Everyone,
};
