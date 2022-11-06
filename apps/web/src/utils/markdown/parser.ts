import { MentionData } from '@draft-js-plugins/mention';
import { RawDraftContentState, RawDraftEntity } from 'draft-js';
import draftToMarkdown from './draftToMarkdown';
import { MentionType } from './types';

export type Parsed = {
  mentions: ParsedMention[];
  markdown: string;
};

export type ParsedMention = {
  type: MentionType;
  id?: string;
};

export function parseDraft(raw: RawDraftContentState): Parsed {
  const markdown = draftToMarkdown(raw);
  const mentions: ParsedMention[] = [];

  for (const entity of Object.values(raw.entityMap)) {
    mentions.push(parseEntity(entity));
  }

  return {
    markdown,
    mentions,
  };
}

function parseEntity(entity: RawDraftEntity): ParsedMention {
  switch (entity.type) {
    case 'mention': {
      const data = entity.data.mention as MentionData;

      return {
        type: MentionType.User,
        id: data.id as string,
      };
    }
  }
}
