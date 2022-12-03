import { Keys, updateQueryData } from './queries';
import { useMutation, useQuery } from '@tanstack/react-query';
import { client } from './client';
import { LoginPayload, FirebaseAuth, authorize, SelfUser } from '@omagize/api';

export function dispatchSelfUser(updated: SelfUser) {
  return updateQueryData<LoginPayload>(Keys.login, (prev) => ({
    ...prev,
    user: updated,
  }));
}

/**
 * @param data login payload, null if logged out
 */
export async function onSignin(data: LoginPayload | null) {
  await client.setQueryData<LoginPayload>(Keys.login, data);
}

export function useLogoutMutation() {
  return useMutation(() => FirebaseAuth.logout());
}

export function useLoginQuery() {
  return useQuery(
    Keys.login,
    /**
     * the query should only called once
     */
    async () => {
      await FirebaseAuth.init();

      return await authorize();
    },
    {
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
    }
  );
}
