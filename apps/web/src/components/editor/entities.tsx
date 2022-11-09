import { Box, StackProps } from '@chakra-ui/react';
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
    <Box
      as="span"
      bg={brand}
      color="white"
      px={1}
      fontWeight="600"
      cursor="pointer"
      {...props}
    >
      <span>@</span>
      <span>{name}</span>
    </Box>
  );
}

export function EveryoneMention(props: any) {
  const { brand } = useColors();

  return (
    <Box
      as="span"
      bg={brand}
      color="white"
      fontWeight="600"
      cursor="pointer"
      px={1}
      {...props}
    >
      <span>@</span>
      {props.children}
    </Box>
  );
}
