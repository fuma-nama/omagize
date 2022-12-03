// Chakra imports
import { DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  FlexProps,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { CustomEmoji, deleteAsset, likeAsset, unlikeAsset } from '@omagize/api';
import { useSelfUser } from '@omagize/data-access-api';
import { useChatStore } from '@omagize/data-access-store';
import { Card } from '@omagize/ui/components';
import { useColorsExtend } from '@omagize/ui/theme';
import { useMutation } from '@tanstack/react-query';
// Custom components
import { BsThreeDots } from 'react-icons/bs';
import { LikeButton, onDeleteEmoji } from './AssetItem';

export default function EmoijItem(props: { emoji: CustomEmoji }) {
  const { id, name, url, author } = props.emoji;
  const store = useChatStore((s) => ({
    hasLike: s.liked_emojis?.some((e) => e.id === id),
    like: s.likeEmoji,
    unlike: s.unlikeEmoji,
  }));
  const { brand, textColor, textColorSecondary } = useColorsExtend(
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
    <Card p="20px" flexDirection="column">
      <Box flex={1} mb="20px" position="relative">
        <Center pos="relative" w="full" h="full" minH="100px" rounded="md" bg={brand}>
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
        <LikeButton hasLike={store.hasLike} onClick={() => likeMutation.mutate(!store.hasLike)} />
      </Box>
      <Flex flexDirection="column" justify="space-between">
        <Flex justify="space-between" direction="row">
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
            <Text color={textColorSecondary} fontSize="sm" fontWeight="400" me="14px">
              {author.username}
            </Text>
          </Flex>
          <Avatar src={author.avatarUrl} name={author.username} size="sm" />
        </Flex>
        <Actions emoji={props.emoji} mt="25px" />
      </Flex>
    </Card>
  );
}

function Actions({ emoji, ...props }: { emoji: CustomEmoji } & FlexProps) {
  const user = useSelfUser();
  const deleteMutation = useMutation(() => deleteAsset(emoji.id, 'emojis'), {
    onSuccess() {
      onDeleteEmoji(emoji.id);
    },
  });

  return (
    <Flex direction="row" justify="end" gap={2} {...props}>
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
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<BsThreeDots />}
          aria-label="Actions"
          isLoading={deleteMutation.isLoading}
        />
        <MenuList>
          <MenuItem icon={<ViewIcon />}>View Info</MenuItem>
          {emoji.author.id === user.id && (
            <MenuItem color="red.400" icon={<DeleteIcon />} onClick={() => deleteMutation.mutate()}>
              Delete
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </Flex>
  );
}
