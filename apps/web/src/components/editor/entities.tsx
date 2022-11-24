import { Box, Image, StackProps } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useColors } from 'variables/colors';

export function MentionEntity({
  avatar,
  name,
  ...props
}: {
  avatar?: string;
  name: ReactNode;
} & StackProps) {
  const { brand } = useColors();

  return (
    <Box as="span" bg={brand} color="white" px={1} fontWeight="600" cursor="pointer" {...props}>
      {props.children}
      <span>@</span>
      <span>{name}</span>
    </Box>
  );
}

export function EveryoneMention(props: any) {
  const { brand } = useColors();

  return (
    <Box as="span" bg={brand} color="white" fontWeight="600" cursor="pointer" px={1} {...props}>
      <span>@</span>
      everyone
    </Box>
  );
}

export function EmojiEntity({ name, src }: { name: string; src: string }) {
  return (
    <Image display="inline" src={src} alt={name} w="25px" h="25px" objectFit="contain" mx="5px" />
  );
}

export function StickerEntity({ name, src }: { name: string; src: string }) {
  return <Image display="inline" src={src} alt={name} w="100px" h="100px" objectFit="contain" />;
}
