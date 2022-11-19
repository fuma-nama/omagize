import { Mention } from '@omagize/api';
import { MentionData } from 'components/editor/MarkdownPlugin';
import { RawDraftContentState, RawDraftEntity } from 'draft-js';
import draftToMarkdown from './draftToMarkdown';
import { MentionType } from './types';

export type Parsed = {
  mentions: Mention[];
  markdown: string;
};

export function parseDraft(raw: RawDraftContentState): Parsed {
  const markdown = draftToMarkdown(raw);
  const mentions: Mention[] = [];

  for (const entity of Object.values(raw.entityMap)) {
    mentions.push(parseEntity(entity));
  }

  return {
    markdown,
    mentions,
  };
}

function parseEntity(entity: RawDraftEntity): Mention {
  switch (entity.type) {
    case 'mention': {
      const data = entity.data.mention as MentionData;

      switch (data.type) {
        case MentionType.Everyone:
          return {
            type: 'everyone',
          };
        case MentionType.Group:
          return {
            type: 'role',
            id: data.id as string,
          };
        default:
          return {
            type: 'user',
            id: data.id as string,
          };
      }
    }
  }
}
