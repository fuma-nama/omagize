import { Box, BoxProps, Circle, useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { VscNewFile } from 'react-icons/vsc';

export function Pick({ children, ...rest }: { children: ReactNode } & BoxProps) {
  const iconBg = useColorModeValue('white', 'brand.400');

  return (
    <Box
      className="pick"
      pos="relative"
      _hover={{ cursor: 'pointer' }}
      css={{
        '&:has(.pick:hover) > .tip': {
          opacity: 0,
        },
        '&:hover > .tip': {
          opacity: 1,
        },
        '& > .tip': {
          opacity: 0,
        },
      }}
      {...rest}
    >
      {children}
      <Circle
        className="tip"
        pos="absolute"
        bottom={0}
        right={0}
        bg={iconBg}
        p={2}
        transition="all 0.1s"
      >
        <VscNewFile />
      </Circle>
    </Box>
  );
}
