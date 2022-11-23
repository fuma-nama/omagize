import { UseQueryResult } from '@tanstack/react-query';
import { ReactElement, ReactNode } from 'react';
import { ErrorPanel } from './ErrorPanel';
import LoadingPanel, { Props } from './LoadingPanel';
import { Center, VStack, Icon, Button, Text } from '@chakra-ui/react';
import { MdOutlineError } from 'react-icons/md';

export function QueryStatus({
  query,
  error,
  skeleton,
  children,
}: {
  query: UseQueryResult;
  error: string;
  skeleton: ReactNode;
  children: ReactNode;
}) {
  if (query.isError) return <ErrorPanel retry={() => query.refetch()}>{error}</ErrorPanel>;
  if (query.isLoading) return <>{skeleton}</>;
  if (query.isSuccess) return <>{children}</>;

  return <></>;
}

export function QueryStatusLayout({
  watch,
  query,
  error,
  placeholder,
  skeleton,
  children,
  container = (s) => <>{s}</>,
}: {
  watch?: any[] | null;
  query: UseQueryResult;
  error: string;
  placeholder: ReactElement;
  skeleton: ReactNode;
  children: ReactNode;
  container: (c: ReactNode) => ReactElement;
}) {
  if (watch?.length === 0) return placeholder;
  if (query.isError) return <ErrorPanel retry={() => query.refetch()}>{error}</ErrorPanel>;
  if (query.isLoading) return container(skeleton);
  if (query.isSuccess) return container(children);

  return <></>;
}

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
  if (query.isError) return <ErrorPanel retry={() => query.refetch()}>{error}</ErrorPanel>;
  if (query.isLoading) return <LoadingPanel {...props} />;
  return <>{children}</>;
}

export function QueryErrorScreen({ children, query }: { children: string; query: UseQueryResult }) {
  const red = 'red.400';

  return (
    query.isError && (
      <Center w="full" h="full">
        <VStack>
          <Icon color={red} as={MdOutlineError} w="100px" h="100px" />
          <Text color={red} fontWeight="bold">
            {children}
          </Text>
          <Button variant="brand" isLoading={query.isLoading} onClick={() => query.refetch()}>
            Retry
          </Button>
        </VStack>
      </Center>
    )
  );
}
