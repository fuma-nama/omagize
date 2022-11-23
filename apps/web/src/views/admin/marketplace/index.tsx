import React from 'react';

// Chakra imports
import {
  Button,
  Flex,
  Grid,
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

// Custom components
import Banner from './components/Banner';
import Card from 'components/card/Card';

import { useQuery } from '@tanstack/react-query';
import { fetchLatestAssets, Keys, Assets } from '@omagize/api';
import { useColors } from 'variables/colors';
import { BiHappy, BiRefresh, BiUpload } from 'react-icons/bi';
import { BsPeople } from 'react-icons/bs';
import { QueryStatusLayout } from 'components/panel/QueryPanel';
import { Placeholder, Repeat } from 'components/layout/Container';
import CreateAssetModal from './components/modals/UploadAssetModal';
import EmoijItem from './components/EmojiItem';
import StickerItem from './components/StickerItem';
import { FaSadCry } from 'react-icons/fa';
import { SidePanel } from './SidePanel';

export default function Marketplace() {
  return (
    <Grid
      mb="20px"
      gridTemplateColumns={{ xl: 'repeat(3, 1fr)', '2xl': '1fr 0.46fr' }}
      gap={{ base: '20px', xl: '20px' }}
      display={{ base: 'flex', '2xl': 'grid' }}
      flexDirection="column"
    >
      <Flex flexDirection="column" gridArea={{ xl: '1 / 1 / 2 / 3', '2xl': '1 / 1 / 2 / 2' }}>
        <Content />
      </Flex>
      <Flex flexDirection="column" gridArea={{ xl: '1 / 3 / 2 / 4', '2xl': '1 / 2 / 2 / 3' }}>
        <SidePanel />
      </Flex>
    </Grid>
  );
}

function Content() {
  // Chakra Color Mode
  const { textColorPrimary: textColor } = useColors();
  const query = useQuery(Keys.market.assets, () => fetchLatestAssets());
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <CreateAssetModal isOpen={isOpen} onClose={onClose} />
      <Banner upload={onOpen} />
      <Flex direction="column">
        <Flex
          ms="24px"
          mt="45px"
          mb="20px"
          justifyContent="space-between"
          direction="row"
          flexWrap="wrap"
          align="center"
          gap={3}
        >
          <Text color={textColor} fontSize="2xl" fontWeight="700" mr={6}>
            Latest Emojis
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
            <Button leftIcon={<BsPeople />}>My Assets</Button>
          </HStack>
        </Flex>
        <QueryStatusLayout
          query={query}
          watch={query.data?.emojis}
          error="Failed to fetch Emojis"
          skeleton={
            <Repeat times={3}>
              <AssetItemSkeleton />
            </Repeat>
          }
          container={(c) => (
            <SimpleGrid columns={{ base: 1, '2sm': 2, md: 3 }} gap="20px">
              {c}
            </SimpleGrid>
          )}
          placeholder={
            <Placeholder icon={<Icon as={BiHappy} w="40px" h="40px" />}>No More Emojis</Placeholder>
          }
        >
          <LatestEmojis assets={query.data} />
        </QueryStatusLayout>
        <Text mt="45px" mb="20px" color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
          New Stickers
        </Text>
        <QueryStatusLayout
          query={query}
          watch={query.data?.stickers}
          error="Failed to fetch Stickers"
          skeleton={
            <Repeat times={3}>
              <AssetItemSkeleton />
            </Repeat>
          }
          container={(c) => (
            <SimpleGrid columns={{ base: 1, '2sm': 2, md: 3 }} gap="20px">
              {c}
            </SimpleGrid>
          )}
          placeholder={
            <Placeholder icon={<Icon as={FaSadCry} w="40px" h="40px" />}>
              No More Stickers
            </Placeholder>
          }
        >
          <LatestStickers assets={query.data} />
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

function LatestEmojis({ assets }: { assets: Assets }) {
  return (
    <>
      {assets.emojis.map((emoji) => (
        <EmoijItem key={emoji.id} emoji={emoji} />
      ))}
    </>
  );
}

function LatestStickers({ assets }: { assets: Assets }) {
  return (
    <>
      {assets.stickers.map((sticker) => (
        <StickerItem key={sticker.id} sticker={sticker} />
      ))}
    </>
  );
}
