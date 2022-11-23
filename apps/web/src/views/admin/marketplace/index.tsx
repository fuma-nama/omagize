import React from 'react';

// Chakra imports
import {
  Button,
  Flex,
  Grid,
  Text,
  useColorModeValue,
  SimpleGrid,
  HStack,
  Skeleton,
  SkeletonText,
  useDisclosure,
} from '@chakra-ui/react';

// Custom components
import Banner from './components/Banner';
import TableTopCreators from './components/TableTopCreators';
import HistoryItem from './components/HistoryItem';
import NFT from 'components/card/NFT';
import Card from 'components/card/Card';

// Assets
import Nft1 from 'assets/img/nfts/Nft1.png';
import Nft2 from 'assets/img/nfts/Nft2.png';
import Nft3 from 'assets/img/nfts/Nft3.png';
import Nft4 from 'assets/img/nfts/Nft4.png';
import Nft5 from 'assets/img/nfts/Nft5.png';
import Nft6 from 'assets/img/nfts/Nft6.png';
import Avatar1 from 'assets/img/avatars/avatar1.png';
import Avatar2 from 'assets/img/avatars/avatar2.png';
import Avatar3 from 'assets/img/avatars/avatar3.png';
import Avatar4 from 'assets/img/avatars/avatar4.png';
import tableDataTopCreators from './variables/tableDataTopCreators.json';
import { tableColumnsTopCreators } from './variables/tableColumnsTopCreators';
import { useQuery } from '@tanstack/react-query';
import { fetchLatestAssets, Keys, Assets } from '@omagize/api';
import { useColors } from 'variables/colors';
import { BiUpload } from 'react-icons/bi';
import { BsPeople } from 'react-icons/bs';
import { QueryStatus } from 'components/panel/QueryPanel';
import { Repeat } from 'components/layout/Container';
import CreateAssetModal from './components/modals/UploadAssetModal';
import EmoijItem from './components/EmojiItem';

export default function Marketplace() {
  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const query = useQuery(Keys.market.assets, () => fetchLatestAssets());

  return (
    <Grid
      mb="20px"
      gridTemplateColumns={{ xl: 'repeat(3, 1fr)', '2xl': '1fr 0.46fr' }}
      gap={{ base: '20px', xl: '20px' }}
      display={{ base: 'block', xl: 'grid' }}
    >
      <Flex flexDirection="column" gridArea={{ xl: '1 / 1 / 2 / 3', '2xl': '1 / 1 / 2 / 2' }}>
        <Banner />
        <Flex direction="column">
          <Flex
            ms="24px"
            mt="45px"
            mb="20px"
            justifyContent="space-between"
            direction="row"
            flexWrap="wrap"
            align="center"
          >
            <Text color={textColor} fontSize="2xl" fontWeight="700" mr={10}>
              Latest Emojis
            </Text>
            <ActionBar />
          </Flex>
          <SimpleGrid columns={{ base: 1, '3sm': 2, md: 3 }} gap="20px">
            <QueryStatus
              query={query}
              error="Failed to fetch Emojis"
              skeleton={
                <Repeat times={3}>
                  <AssetItemSkeleton />
                </Repeat>
              }
            >
              <LatestEmojis assets={query.data} />
            </QueryStatus>
          </SimpleGrid>
          <Text mt="45px" mb="36px" color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
            New Stickers
          </Text>
          <SimpleGrid columns={{ base: 1, '2sm': 2, md: 3 }} gap="20px">
            <QueryStatus
              query={query}
              error="Failed to fetch Stickers"
              skeleton={
                <Repeat times={3}>
                  <AssetItemSkeleton />
                </Repeat>
              }
            >
              <LatestStickers assets={query.data} />
            </QueryStatus>
          </SimpleGrid>
        </Flex>
      </Flex>
      <Flex flexDirection="column" gridArea={{ xl: '1 / 3 / 2 / 4', '2xl': '1 / 2 / 2 / 3' }}>
        <Card px="0px" mb="20px">
          <TableTopCreators
            tableData={tableDataTopCreators}
            columnsData={tableColumnsTopCreators}
          />
        </Card>
        <History />
      </Flex>
    </Grid>
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

function ActionBar() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <HStack>
      <CreateAssetModal isOpen={isOpen} onClose={onClose} />
      <Button variant="brand" leftIcon={<BiUpload />} onClick={onOpen}>
        Upload
      </Button>
      <Button leftIcon={<BsPeople />}>My Assets</Button>
    </HStack>
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
      <NFT
        name="Swipe Circles"
        author="By Peter Will"
        bidders={[Avatar1, Avatar2, Avatar3, Avatar4, Avatar1, Avatar1, Avatar1, Avatar1]}
        image={Nft4}
        currentbid="0.91 ETH"
        download="#"
      />
      <NFT
        name="Colorful Heaven"
        author="By Mark Benjamin"
        bidders={[Avatar1, Avatar2, Avatar3, Avatar4, Avatar1, Avatar1, Avatar1, Avatar1]}
        image={Nft5}
        currentbid="0.91 ETH"
        download="#"
      />
      <NFT
        name="3D Cubes Art"
        author="By Manny Gates"
        bidders={[Avatar1, Avatar2, Avatar3, Avatar4, Avatar1, Avatar1, Avatar1, Avatar1]}
        image={Nft6}
        currentbid="0.91 ETH"
        download="#"
      />
    </>
  );
}

function History() {
  const { textColorPrimary } = useColors();

  return (
    <Card p="0px">
      <Flex
        align={{ sm: 'flex-start', lg: 'center' }}
        justify="space-between"
        w="100%"
        px="22px"
        py="18px"
      >
        <Text color={textColorPrimary} fontSize="xl" fontWeight="600">
          History
        </Text>
        <Button variant="action">See all</Button>
      </Flex>

      <HistoryItem
        name="Colorful Heaven"
        author="By Mark Benjamin"
        date="30s ago"
        image={Nft5}
        price="0.91 ETH"
      />
      <HistoryItem
        name="Abstract Colors"
        author="By Esthera Jackson"
        date="58s ago"
        image={Nft1}
        price="0.91 ETH"
      />
      <HistoryItem
        name="ETH AI Brain"
        author="By Nick Wilson"
        date="1m ago"
        image={Nft2}
        price="0.91 ETH"
      />
      <HistoryItem
        name="Swipe Circles"
        author="By Peter Will"
        date="1m ago"
        image={Nft4}
        price="0.91 ETH"
      />
      <HistoryItem
        name="Mesh Gradients "
        author="By Will Smith"
        date="2m ago"
        image={Nft3}
        price="0.91 ETH"
      />
      <HistoryItem
        name="3D Cubes Art"
        author="By Manny Gates"
        date="3m ago"
        image={Nft6}
        price="0.91 ETH"
      />
    </Card>
  );
}
