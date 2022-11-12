import {
  Box,
  Center,
  CenterProps,
  Icon,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { UseMutationResult } from '@tanstack/react-query';
import { OmagizeLogo } from 'components/icons/Icons';
import { ReactNode } from 'react';
import { useColors } from 'variables/colors';
import { ErrorPanel } from './ErrorPanel';

export type Props = {
  size?: 'sm' | 'lg';
};
export function MutationPanel({
  mutation,
  retry,
  error,
  children,
  ...props
}: {
  mutation: UseMutationResult<any, any, any, any>;
  retry: () => void;
  error: string;
  children: ReactNode;
} & Props) {
  if (mutation.isError) return <ErrorPanel retry={retry}>{error}</ErrorPanel>;
  if (mutation.isLoading) return <LoadingPanel {...props} />;
  return <>{children}</>;
}

export default function LoadingPanel({ size, ...props }: Props & CenterProps) {
  const { brand, textColorPrimary } = useColors();

  if (size === 'sm') {
    return (
      <Center w="full" h="full" {...props}>
        <VStack>
          <Spinner size="lg" />
          <Text color={textColorPrimary}>Loading</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Center w="full" h="full">
      <VStack>
        <Box pos="relative" p={5}>
          <Spinner
            pos="absolute"
            top={0}
            left={0}
            w="full"
            h="full"
            thickness="4px"
            color={brand}
          />

          <Icon color={brand} as={OmagizeLogo} w="100px" h="100px" />
        </Box>

        <Text color={brand} fontWeight="bold">
          Loading
        </Text>
      </VStack>
    </Center>
  );
}
