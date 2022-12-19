import { IconButtonProps, IconButton, Icon } from '@chakra-ui/react';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';

export function LikeButton({ hasLike, ...props }: { hasLike: boolean } & Partial<IconButtonProps>) {
  return (
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
      icon={<Icon w="20px" h="20px" as={hasLike ? IoHeart : IoHeartOutline} />}
      {...props}
    />
  );
}
