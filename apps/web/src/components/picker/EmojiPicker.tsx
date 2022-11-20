import {
  Button,
  ButtonProps,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  SimpleGrid,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { ReactNode, useState } from 'react';
import { CompactEmoji, fetchEmojis } from 'emojibase';
import { useQuery } from '@tanstack/react-query';
import { SearchBar } from 'components/navbar/searchBar/SearchBar';
import LoadingPanel from 'components/panel/LoadingPanel';

export enum EmojiGroup {
  SmileysEmotion = 0,
  PeopleBody = 1,
  Component = 2,
  AnimalsNature = 3,
  FoodDrink = 4,
  TravelPlaces = 5,
  Activities = 6,
  Objects = 7,
  Symbols = 8,
  Flag = 9,
}

const groups = [
  {
    label: '😀',
    group: EmojiGroup.SmileysEmotion,
    tip: 'Smileys & Emotion',
  },
  {
    label: '👋',
    group: EmojiGroup.PeopleBody,
    tip: 'Peoples',
  },
  {
    label: '🐵',
    group: EmojiGroup.AnimalsNature,
    tip: 'Animals',
  },
  {
    label: '🍇',
    group: EmojiGroup.FoodDrink,
    tip: 'Food & Drink',
  },
  {
    label: '🌍️',
    group: EmojiGroup.TravelPlaces,
    tip: 'Travel & Places',
  },
  {
    label: '🎃',
    group: EmojiGroup.Activities,
    tip: 'Activities',
  },
  {
    label: '👓️',
    group: EmojiGroup.Objects,
    tip: 'Objects',
  },
  {
    label: '🏧',
    group: EmojiGroup.Symbols,
    tip: 'Symbols',
  },
  {
    label: '🏁',
    group: EmojiGroup.Flag,
    tip: 'Flag',
  },
];

export default function EmojiPicker({
  onSelect,
  children,
}: {
  onSelect: (emoji: CompactEmoji) => void;
  children: ReactNode;
}) {
  return (
    <Popover isLazy placement="top">
      {children}
      <PopoverContent>
        <PopoverBody p={0}>
          <Content onSelect={onSelect} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

const maxFilterCount = 40;
function Content({ onSelect }: { onSelect: (emoji: CompactEmoji) => void }) {
  const query = useQuery(['emojis'], () => fetchData());
  const [search, setSearch] = useState<string>('');
  const [selected, setSelected] = useState<EmojiGroup>(EmojiGroup.SmileysEmotion);
  const emoijs = useQuery(
    ['filtered_emojis', search, selected],
    async () => {
      const data = query.data;

      if (search.length === 0) {
        return data.get(selected);
      } else {
        const filtered: CompactEmoji[] = [];

        for (const group of data.values()) {
          for (const emoji of group) {
            if (filtered.length > maxFilterCount) break;

            if (emoji.label.includes(search)) {
              filtered.push(emoji);
            }
          }
        }

        return filtered;
      }
    },
    {
      enabled: query.isSuccess,
      cacheTime: 0,
    }
  );

  return (
    <Flex direction="row" h={300}>
      <VStack overflow="auto" spacing={0}>
        {groups.map((group) => (
          <Button
            key={group.group}
            variant={selected === group.group && 'brand'}
            onClick={() => setSelected(group.group)}
          >
            {group.label}
          </Button>
        ))}
      </VStack>
      <Flex direction="column" flex={1}>
        <SearchBar
          input={{
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: 'Search emojis',
          }}
        />
        {emoijs.isLoading || query.isLoading ? (
          <LoadingPanel size="sm" />
        ) : (
          <SimpleGrid columns={4} gap={1} flex={1} overflow="auto">
            {emoijs.data?.map((emoji) => (
              <Emoji key={emoji.unicode} emoji={emoji} onClick={() => onSelect(emoji)} />
            ))}
          </SimpleGrid>
        )}
      </Flex>
    </Flex>
  );
}

function Emoji({ emoji, ...props }: { emoji: CompactEmoji } & ButtonProps) {
  return (
    <Tooltip label={`:${emoji.shortcodes}:`}>
      <Button rounded="sm" {...props}>
        {emoji.unicode}
      </Button>
    </Tooltip>
  );
}

export async function fetchData() {
  const emojis = await fetchEmojis('en', { compact: true, shortcodes: ['cldr'] });

  return processEmojis(emojis);
}

function processEmojis(emojis: CompactEmoji[]): Map<EmojiGroup, CompactEmoji[]> {
  const map = new Map<EmojiGroup, CompactEmoji[]>();

  for (const emoji of emojis) {
    if (emoji.group == null) continue;

    if (map.has(emoji.group)) {
      map.get(emoji.group).push(emoji);
    } else {
      map.set(emoji.group, [emoji]);
    }
  }

  return map;
}
