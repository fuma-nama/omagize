import { Account, LoginPayload } from '../types/account';
import { Keys, updateQueryData } from './queries';
import { useMutation, useQuery } from '@tanstack/react-query';
import { authorize } from '../AccountAPI';
import { client } from './client';
import { User } from '../types';
import { FirebaseAuth } from '../firebase';

export function dispatchSelfUser(updated: User) {
  return updateQueryData<LoginPayload>(Keys.login, (prev) => ({
    ...prev,
    user: updated,
  }));
}

export function dispatchAccount(updated: (prev: LoginPayload) => Account) {
  return updateQueryData<LoginPayload>(Keys.login, (prev) => ({
    ...prev,
    account: updated(prev),
  }));
}

/**
 * @param data login payload, null if logged out
 */
export async function onSignin(data: LoginPayload | null) {
  return client.setQueryData<LoginPayload>(Keys.login, data);
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
