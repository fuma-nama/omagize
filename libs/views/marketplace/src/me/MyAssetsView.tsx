// Chakra imports
import {
  Button,
  Flex,
  Text,
  SimpleGrid,
  HStack,
  Skeleton,
  SkeletonText,
  useDisclosure,
  IconButton,
  Tooltip,
  Icon,
} from '@chakra-ui/react';

import { useQuery } from '@tanstack/react-query';
import { Keys, fetchMyAssets, Assets } from '@omagize/api';
import { BiRefresh, BiUpload } from 'react-icons/bi';
import CreateAssetModal from '../components/modals/UploadAssetModal';
import EmoijItem from '../components/assets/EmojiItem';
import StickerItem from '../components/assets/StickerItem';
import { FaSadCry, FaThinkPeaks } from 'react-icons/fa';
import {
  QueryStatusLayout,
  PlaceholderLayout,
  HSeparator,
  Repeat,
  Placeholder,
  Card,
} from '@omagize/ui/components';
import { useChatStore } from '@omagize/data-access-store';
import { useColors } from '@omagize/ui/theme';

export function MyAssets() {
  return (
    <Flex flexDirection="column">
      <Content />
    </Flex>
  );
}

function Content() {
  // Chakra Color Mode
  const { textColorPrimary: textColor } = useColors();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const query = useQuery(Keys.market.me, () => fetchMyAssets(), {
    onSuccess(data) {
      useChatStore.setState({
        liked_emojis: data.favorites.emojis,
        liked_stickers: data.favorites.stickers,
      });
    },
  });

  const owned = query.data?.owned;

  return (
    <>
      <CreateAssetModal isOpen={isOpen} onClose={onClose} />
      <Flex direction="column">
        <Flex
          ms="24px"
          mb="20px"
          justifyContent="space-between"
          direction="row"
          flexWrap="wrap"
          align="center"
          gap={3}
        >
          <Text color={textColor} fontSize="2xl" fontWeight="700" mr={6}>
            Favorite Assets
            <Tooltip label="Refresh Assets">
              <IconButton
                ml={2}
                icon={<BiRefresh />}
                aria-label="Refresh"
                isLoading={query.isRefetching}
                onClick={() => query.refetch()}
              />
            </Tooltip>
          </Text>
          <HStack>
            <Button variant="brand" leftIcon={<BiUpload />} onClick={onOpen}>
              Upload
            </Button>
          </HStack>
        </Flex>
        <Favorites />
        <Text mt="45px" mb="20px" color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
          Owned Assets
        </Text>
        <QueryStatusLayout
          query={query}
          watch={owned && [...owned.stickers, ...owned.emojis]}
          error="Failed to fetch your assets"
          skeleton={
            <Repeat times={3}>
              <AssetItemSkeleton />
            </Repeat>
          }
          container={(c) => (
            <SimpleGrid columns={{ base: 1, '3sm': 2, md: 3, xl: 4 }} gap="20px" children={c} />
          )}
          placeholder={
            <Placeholder icon={<Icon as={FaSadCry} w="40px" h="40px" />}>No any Assets</Placeholder>
          }
        >
          <LatestStickers owned={query.data?.owned} />
        </QueryStatusLayout>
      </Flex>
    </>
  );
}

function AssetItemSkeleton() {
  return (
    <Card gap={5}>
      <Skeleton h="100px" rounded="lg" />
      <SkeletonText />
    </Card>
  );
}

function Favorites() {
  const { textColorSecondary } = useColors();
  const [emojis, stickers] = useChatStore((s) => [s.liked_emojis, s.liked_stickers]);

  return (
    <PlaceholderLayout
      watch={emojis}
      placeholder={
        <Placeholder icon={<Icon as={FaThinkPeaks} w="40px" h="40px" />}>Nothing here</Placeholder>
      }
    >
      <SimpleGrid columns={{ base: 1, '3sm': 2, md: 3, xl: 4 }} gap="20px">
        {emojis?.map((emoji) => (
          <EmoijItem key={emoji.id} emoji={emoji} />
        ))}
      </SimpleGrid>
      <Flex align="center" direction="row" my={3}>
        <HSeparator />
        <Text mx={2} color={textColorSecondary}>
          Stickers
        </Text>
        <HSeparator />
      </Flex>
      <SimpleGrid columns={{ base: 1, '3sm': 2, md: 3, xl: 4 }} gap="20px">
        {stickers?.map((sticker) => (
          <StickerItem key={sticker.id} sticker={sticker} />
        ))}
      </SimpleGrid>
    </PlaceholderLayout>
  );
}

function LatestStickers({ owned }: { owned: Assets | null }) {
  return (
    <>
      {owned?.emojis.map((emoji) => (
        <EmoijItem key={emoji.id} emoji={emoji} />
      ))}
      {owned?.stickers.map((sticker) => (
        <StickerItem key={sticker.id} sticker={sticker} />
      ))}
    </>
  );
}
