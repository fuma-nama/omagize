import { LoginPayload } from '../mappers/Auth';
import { Keys } from './keys';
import { useMutation, useQuery } from '@tanstack/react-query';
import { authorize, logout } from '../AccountAPI';
import { client } from './client';
import { User } from '../mappers';
import { FirebaseAuth } from '../firebase';

export function dispatchSelfUser(updated: User) {
  return client.setQueryData<LoginPayload>(Keys.login, (prev) => ({
    ...prev,
    user: updated,
  }));
}

export function onSignin(data: LoginPayload) {
  return client.setQueryData<LoginPayload>(Keys.login, data);
}

export function useLogoutMutation() {
  return useMutation(() => logout(), {
    onSuccess() {
      client.setQueryData<LoginPayload | null>(Keys.login, null);
    },
  });
}

export function useLoginQuery() {
  return useQuery(
    Keys.login,
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
