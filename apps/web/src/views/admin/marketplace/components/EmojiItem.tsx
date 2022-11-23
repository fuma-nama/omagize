// Chakra imports
import { Avatar, Box, Button, Center, Flex, Icon, IconButton, Image, Text } from '@chakra-ui/react';
import { CustomEmoji, likeAsset, unlikeAsset } from '@omagize/api';
import { useMutation } from '@tanstack/react-query';
// Custom components
import Card from 'components/card/Card';
// Assets
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { useChatStore } from 'stores/ChatStore';
import { useColorsExtend } from 'variables/colors';

export default function EmoijItem(props: { emoji: CustomEmoji }) {
  const { id, name, url, author } = props.emoji;
  const store = useChatStore((s) => ({
    hasLike: s.liked_emojis?.some((e) => e.id === id),
    like: s.likeEmoji,
    unlike: s.unlikeEmoji,
  }));
  const { brand, textColor, textColorBid } = useColorsExtend(
    {
      textColor: 'navy.700',
      textColorBid: 'brand.500',
    },
    {
      textColor: 'white',
      textColorBid: 'white',
    }
  );

  const likeMutation = useMutation(
    (like: boolean) => (like ? likeAsset(id, 'emoji') : unlikeAsset(id, 'emoji')),
    {
      onSuccess: (_, _like) => {
        _like ? store.like(props.emoji) : store.unlike(id);
      },
    }
  );

  return (
    <Card p="20px">
      <Flex direction={{ base: 'column' }} justify="center">
        <Box mb={{ base: '20px', '2xl': '20px' }} position="relative">
          <Center pos="relative" w="full" h="100px" rounded="md" bg={brand}>
            <Image
              top={0}
              left={0}
              pos="absolute"
              src={url}
              w="full"
              h="full"
              objectFit="cover"
              filter="blur(8px)"
              opacity={0.3}
            />
            <Image src={url} w="50px" h="50px" pos="relative" />
          </Center>

          <IconButton
            aria-label="Like"
            position="absolute"
            bg="white"
            top="7px"
            right="7px"
            _hover={{ bg: 'whiteAlpha.900' }}
            _active={{ bg: 'whiteAlpha.900' }}
            borderRadius="50%"
            w="36px"
            h="36px"
            color="brand.500"
            onClick={() => likeMutation.mutate(!store.hasLike)}
            icon={<Icon w="20px" h="20px" as={store.hasLike ? IoHeart : IoHeartOutline} />}
          />
        </Box>
        <Flex flexDirection="column" justify="space-between" h="100%">
          <Flex justify="space-between" direction="row" mb="auto">
            <Flex direction="column">
              <Text
                color={textColor}
                fontSize={{
                  base: 'xl',
                  xl: 'lg',
                  '2xl': 'md',
                  '3xl': 'lg',
                }}
                mb="5px"
                fontWeight="bold"
                me="14px"
              >
                {name}
              </Text>
              <Text
                color="secondaryGray.600"
                fontSize={{
                  base: 'sm',
                }}
                fontWeight="400"
                me="14px"
              >
                {author.username}
              </Text>
            </Flex>
            <Avatar src={author.avatarUrl} name={author.username} size="sm" />
          </Flex>
          <Flex
            align="center"
            justify="space-between"
            direction="row"
            mt="25px"
            flexWrap="wrap"
            gap={2}
          >
            <Text fontWeight="700" fontSize="sm" color={textColorBid}>
              Likes: 0
            </Text>
            <Button
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="70px"
              px="24px"
              py="5px"
            >
              View Emoji
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
