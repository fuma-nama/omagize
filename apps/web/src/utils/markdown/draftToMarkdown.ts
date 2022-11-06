import { apply, Modify } from './StringEditUtils';
import { MentionData } from '@draft-js-plugins/mention';
import {
  DraftBlockType,
  DraftInlineStyleType,
  RawDraftContentState,
  RawDraftEntity,
  RawDraftEntityRange,
  RawDraftInlineStyleRange,
} from 'draft-js';

const entityMap: EntityMapping = {
  mention(entity) {
    const mention = entity.data.mention as MentionData;
    return `<@${mention.id}>`;
  },
};

/**
 * export to markdown
 * notice that it is not a full implementation for markdown
 *
 * it only includes supported styles for chat messages
 * (bold, italic, strokethrough, code, header 1-5)
 */
export default function draftToMarkdown(raw: RawDraftContentState): string {
  const result: string[] = [];

  for (const block of raw.blocks) {
    const actions: Modify[] = [];

    actions.push(...mapStyles(block.inlineStyleRanges));
    actions.push(...mapBlock(block.type));
    actions.push(...mapEntities(block.entityRanges, raw.entityMap));

    result.push(apply(block.text, actions));
  }

  return result.join('\n');
}

function mapEntities(
  ranges: RawDraftEntityRange[],
  entities: {
    [key: string]: RawDraftEntity<{
      [key: string]: any;
    }>;
  }
): Modify[] {
  const actions: Modify[] = [];

  for (const range of ranges) {
    const entity = entities[range.key];
    const mapped = entityMap[entity.type](entity);

    actions.push({
      type: 'replace',
      index: range.offset,
      length: range.length,
      replacement: mapped,
    });
  }

  return actions;
}

function mapStyles(ranges: RawDraftInlineStyleRange[]): Modify[] {
  const actions: Modify[] = [];

  for (const range of ranges) {
    const scope = getStyleScope(range.style);

    if (scope.open != null) {
      actions.push({
        type: 'insert',
        index: range.offset,
        text: scope.open,
      });
    }
    if (scope.close != null) {
      actions.push({
        type: 'insert',
        index: range.offset + range.length,
        text: scope.close,
      });
    }
  }

  return actions;
}

type EntityMapping = {
  [type: string]: (
    entity: RawDraftEntity<{
      [key: string]: any;
    }>
  ) => string;
};

type Scope = {
  open?: string;
  close?: string;
};

function getStyleScope(type: DraftInlineStyleType): Scope {
  const syntax = (c: string) => ({ open: c, close: c });

  switch (type) {
    case 'BOLD':
      return syntax('**');
    case 'ITALIC':
      return syntax('^^');
    case 'STRIKETHROUGH':
      return syntax('~~');
    case 'UNDERLINE':
      return syntax('__');
    case 'CODE':
      return syntax('`');
    default:
      return {};
  }
}

function mapBlock(type: DraftBlockType): Modify[] {
  const add = (c: string): Modify[] => [{ type: 'insert', text: c, index: 0 }];

  switch (type) {
    case 'header-one':
      return add(`# `);
    case 'header-two':
      return add(`## `);
    case 'header-three':
      return add(`### `);
    case 'header-four':
      return add(`#### `);
    case 'header-five':
      return add(`##### `);
    default:
      return [];
  }
}
