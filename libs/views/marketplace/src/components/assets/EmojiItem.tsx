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
import { CustomEmoji } from '@omagize/api';
import {
  useDeleteEmojiMutation,
  useLikeEmojiMutation,
  useSelfUser,
} from '@omagize/data-access-api';
import { Card } from '@omagize/ui/components';
import { useColorsExtend } from '@omagize/ui/theme';
import { BsThreeDots } from 'react-icons/bs';
import { LikeButton } from '../LikeButton';

export default function EmoijItem({ emoji }: { emoji: CustomEmoji }) {
  const { name, url, author } = emoji;
  const { isFavoite, setFavoite } = useLikeEmojiMutation(emoji);
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
        <LikeButton hasLike={isFavoite} onClick={() => setFavoite(!isFavoite)} />
      </Box>
      <Flex flexDirection="column" justify="space-between">
        <Flex justify="space-between" direction="row">
          <Flex direction="column">
            <Text color={textColor} fontSize="lg" mb="5px" fontWeight="bold" me="14px">
              {name}
            </Text>
            <Text color={textColorSecondary} fontSize="sm" fontWeight="400" me="14px">
              {author.username}
            </Text>
          </Flex>
          <Avatar src={author.avatarUrl} name={author.username} size="sm" />
        </Flex>
        <Actions emoji={emoji} mt="25px" />
      </Flex>
    </Card>
  );
}

function Actions({ emoji, ...props }: { emoji: CustomEmoji } & FlexProps) {
  const user = useSelfUser();
  const deleteMutation = useDeleteEmojiMutation();

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
            <MenuItem
              color="red.400"
              icon={<DeleteIcon />}
              onClick={() => deleteMutation.mutate(emoji.id)}
            >
              Delete
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </Flex>
  );
}
