import { UseQueryResult } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { ErrorPanel } from './ErrorPanel';
import LoadingPanel, { Props } from './LoadingPanel';
import { Center, VStack, Icon, Button, Text } from '@chakra-ui/react';
import { MdOutlineError } from 'react-icons/md';

export function QueryPanel({
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
    return <ErrorPanel retry={() => query.refetch()}>{error}</ErrorPanel>;
  if (query.isLoading) return <LoadingPanel {...props} />;
  return <>{children}</>;
}

export function QueryErrorScreen({
  children,
  query,
}: {
  children: string;
  query: UseQueryResult;
}) {
  const red = 'red.400';

  return (
    query.isError && (
      <Center w="full" h="full">
        <VStack>
          <Icon color={red} as={MdOutlineError} w="100px" h="100px" />
          <Text color={red} fontWeight="bold">
            {children}
          </Text>
          <Button
            variant="brand"
            isLoading={query.isLoading}
            onClick={() => query.refetch()}
          >
            Retry
          </Button>
        </VStack>
      </Center>
    )
  );
}
