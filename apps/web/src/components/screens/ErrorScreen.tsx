import { Button, Center, Icon, Text, VStack } from '@chakra-ui/react';
import { UseQueryResult } from '@tanstack/react-query';
import { MdOutlineError } from 'react-icons/md';

export function ErrorScreen({
  children,
  retry,
}: {
  children: string;
  retry: () => void;
}) {
  const red = 'red.400';

  return (
    <Center w="full" h="full">
      <VStack>
        <Icon color={red} as={MdOutlineError} w="100px" h="100px" />
        <Text color={red} fontWeight="bold">
          {children}
        </Text>
        <Button variant="danger" onClick={retry}>
          Try Again
        </Button>
      </VStack>
    </Center>
  );
}

export default function QueryErrorScreen({
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
