import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';
import hole from 'assets/img/layout/hole.svg';
import { QueryObserverRefetchErrorResult } from '@tanstack/query-core/src/types';

export function QueryErrorPanel(props: {
  query: QueryObserverRefetchErrorResult & any;
}) {
  return <ErrorPanel error={props.query.error} retry={props.query.refetch} />;
}

export default function ErrorPanel(props: { error?: any; retry: () => void }) {
  return (
    <Center w="full" h="full" flexDirection="column" overflow="hidden" gap={5}>
      <Box pos="relative">
        <Heading fontSize={{ base: '50px', md: '130px' }} letterSpacing={8}>
          Error
        </Heading>
        <Image
          pos="absolute"
          left={{ base: '60px', md: '185px' }}
          top={{ base: '5px', md: '45px' }}
          src={hole}
          w={{ base: '80px', md: '120px' }}
        />
      </Box>
      <Text>{props.error}</Text>
      <Button variant="action" onClick={props.retry}>
        Retry
      </Button>
    </Center>
  );
}
