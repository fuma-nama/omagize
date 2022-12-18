import React from 'react';

// Chakra imports
import {
  Button,
  Flex,
  Grid,
  SimpleGrid,
  HStack,
  Skeleton,
  SkeletonText,
  useDisclosure,
  IconButton,
  Tooltip,
  Icon,
  ButtonGroup,
} from '@chakra-ui/react';

// Custom components
import Banner from './components/Banner';

import { useQuery } from '@tanstack/react-query';
import { fetchLatestAssets, Assets } from '@omagize/api';
import { BiHappy, BiRefresh, BiUpload } from 'react-icons/bi';
import { BsPeople } from 'react-icons/bs';
import CreateAssetModal from './components/modals/UploadAssetModal';
import EmoijItem from './components/assets/EmojiItem';
import StickerItem from './components/assets/StickerItem';
import { FaSadCry } from 'react-icons/fa';
import { SidePanel } from './SidePanel';
import { useNavigate } from 'react-router-dom';
import { Card, Placeholder, QueryStatusLayout, Repeat, SubHeading } from '@omagize/ui/components';
import { Keys } from '@omagize/data-access-api';

export function MarketplaceView() {
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
  const query = useQuery(Keys.market.assets, () => fetchLatestAssets());
  const { isOpen, onClose, onOpen } = useDisclosure();
  const navigate = useNavigate();

  return (
    <>
      <CreateAssetModal isOpen={isOpen} onClose={onClose} />
      <Banner upload={onOpen} />
      <Flex direction="column" px={{ base: '12px', '3sm': '24px' }} gap="20px" mb="45px">
        <HStack justifyContent="space-between" flexWrap="wrap" gap={3} spacing={0}>
          <SubHeading>
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
          </SubHeading>
          <ButtonGroup>
            <Button variant="brand" leftIcon={<BiUpload />} onClick={onOpen}>
              Upload
            </Button>
            <Button leftIcon={<BsPeople />} onClick={() => navigate('/user/explore/me')}>
              My Assets
            </Button>
          </ButtonGroup>
        </HStack>
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
        <SubHeading mt="25px">New Stickers</SubHeading>
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
