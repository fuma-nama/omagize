import { Box, Center, Icon, Spinner, Text, VStack } from '@chakra-ui/react';
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { OmagizeLogo } from 'components/icons/Icons';
import { ReactNode } from 'react';
import { useColors } from 'variables/colors';
import { ErrorScreen } from './ErrorScreen';

type Props = {
  size?: 'sm' | 'lg';
};
export function QueryScreen({
  query,
  error,
  children,
  ...props
}: {
  query: UseQueryResult;
  error: string;
  children: ReactNode;
} & Props) {
  if (query.isError)
    return <ErrorScreen retry={() => query.refetch()}>{error}</ErrorScreen>;
  if (query.isLoading) return <LoadingScreen {...props} />;
  return <>{children}</>;
}

export function MutationScreen({
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
  if (mutation.isError) return <ErrorScreen retry={retry}>{error}</ErrorScreen>;
  if (mutation.isLoading) return <LoadingScreen {...props} />;
  return <>{children}</>;
}

export default function LoadingScreen(props: Props) {
  const { brand, textColorPrimary } = useColors();

  if (props.size === 'sm') {
    return (
      <Center w="full" h="full">
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
