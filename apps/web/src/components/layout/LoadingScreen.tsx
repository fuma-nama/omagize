import { Box, Center, Icon, Spinner, Text, VStack } from '@chakra-ui/react';
import { UseQueryResult } from '@tanstack/react-query';
import { OmagizeLogo } from 'components/icons/Icons';
import { ReactNode } from 'react';
import { useColors } from 'variables/colors';
import { ErrorScreen } from './ErrorScreen';

export function QueryScreen({
  query,
  error,
  children,
}: {
  query: UseQueryResult;
  error: string;
  children: ReactNode;
}) {
  if (query.isError)
    return <ErrorScreen retry={() => query.refetch()}>{error}</ErrorScreen>;
  if (query.isLoading) return <LoadingScreen />;
  return <>{children}</>;
}

export default function LoadingScreen() {
  const { brand } = useColors();

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
