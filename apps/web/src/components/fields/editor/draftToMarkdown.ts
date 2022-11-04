import { MentionData } from '@draft-js-plugins/mention';
import {
  DraftBlockType,
  DraftInlineStyleType,
  RawDraftContentState,
  RawDraftEntity,
  RawDraftEntityRange,
  RawDraftInlineStyleRange,
} from 'draft-js';

function replaceRange(
  s: string,
  start: number,
  end: number,
  replace: string,
  offset: number = 0
): string {
  return s.substring(0, start + offset) + replace + s.substring(end + offset);
}

/**
 * export to markdown
 * notice that it is not a full implementation for markdown
 *
 * it only includes supported styles for chat messages
 * (bold, italic, strokethrough, code, header 1-5)
 */
export default function draftToMarkdown(raw: RawDraftContentState): string {
  const result: string[] = [];
  const entityMap: EntityMapping = {
    mention(entity) {
      const mention = entity.data.mention as MentionData;
      console.log(mention);
      return `<@${mention.id}>`;
    },
  };

  for (const block of raw.blocks) {
    const original = block.text;
    let content = block.text;
    console.log(`line ${content}`);
    let offset = 0;

    function mapEntities(ranges: RawDraftEntityRange[]) {
      const sortedRanges = ranges.sort((a, b) => a.offset - b.offset);

      for (const range of sortedRanges) {
        const entity = raw.entityMap[range.key];
        const mapped = entityMap[entity.type](entity);

        content = replaceRange(
          content,
          range.offset,
          range.offset + range.length,
          mapped,
          offset
        );
        offset += mapped.length - range.length;
      }
    }

    function mapStyles(ranges: RawDraftInlineStyleRange[]) {
      for (const range of ranges) {
        const text = original.substring(
          range.offset,
          range.offset + range.length
        );
        const mapped = mapStyle(range.style, text);

        content = replaceRange(
          content,
          range.offset,
          range.offset + range.length,
          mapped,
          offset
        );
        offset += mapped.length - range.length;
      }
    }

    mapEntities(block.entityRanges);
    mapStyles(block.inlineStyleRanges);
    content = mapBlock(block.type, content);
    result.push(content);
  }

  return result.join('\n');
}

type EntityMapping = {
  [type: string]: (
    entity: RawDraftEntity<{
      [key: string]: any;
    }>
  ) => string;
};

function mapStyle(type: DraftInlineStyleType, content: string) {
  switch (type) {
    case 'BOLD':
      return `**${content}**`;
    case 'ITALIC':
      return `*${content}*`;
    case 'STRIKETHROUGH':
      return `~~${content}~~`;
    case 'UNDERLINE':
      return `__${content}__`;
    case 'CODE':
      return `\`${content}\``;
    default:
      return content;
  }
}

function mapBlock(type: DraftBlockType, content: string): string {
  switch (type) {
    case 'header-one':
      return `# ${content}`;
    case 'header-two':
      return `## ${content}`;
    case 'header-three':
      return `### ${content}`;
    case 'header-four':
      return `#### ${content}`;
    case 'header-five':
      return `##### ${content}`;
    default:
      return content;
  }
}
