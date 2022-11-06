import { MentionData } from '@draft-js-plugins/mention';
import { Mention } from '@omagize/api';
import { RawDraftContentState, RawDraftEntity } from 'draft-js';
import draftToMarkdown from './draftToMarkdown';

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

      return {
        type: 'user',
        id: data.id as string,
      };
    }
  }
}
