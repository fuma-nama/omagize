import { QueryClient } from '@tanstack/react-query';

export let client: QueryClient;

export function initClient(): QueryClient {
  if (client != null) {
    client = new QueryClient({
      defaultOptions: {
        queries: {
          /**
           * We will only update data with Gateway
           */
          staleTime: Infinity,
          retry: 1,
        },
      },
    });
  }

  return client;
}
