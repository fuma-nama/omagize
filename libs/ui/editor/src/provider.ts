import { MentionType } from '@omagize/utils/markdown';

export interface InputProvider {
  useSuggestion: (search: string | null) => MentionSuggestion[];
}

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
