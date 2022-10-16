import {
  callDefault,
  callReturn,
  ReturnOptions,
  withDefault,
} from './utils/core';
import { RawSelfUser } from './UserAPI';
import { LoginPayload } from './mappers/Auth';
export type Reset = 'reset';

export type RawLoginPayload = {
  account: RawAccount;
  user: RawSelfUser;
  token: string;
};

export type RawAccount = {
  email: string;
};

export async function auth(): Promise<LoginPayload | null> {
  return await callReturn<RawLoginPayload | null>(
    '/auth',
    withDefault<ReturnOptions<RawLoginPayload>>({
      method: 'POST',
      allowed: {
        401: () => null,
      },
    })
  ).then((res) => LoginPayload(res));
}

export async function login(options: {
  email: string;
  password: string;
}): Promise<LoginPayload | null> {
  return await callReturn<RawLoginPayload>(
    '/login',
    withDefault({
      method: 'POST',
      body: JSON.stringify(options),
      errorOnFail: true,
    })
  ).then((res) => LoginPayload(res));
}

export async function logout() {
  return callDefault(
    '/logout',
    withDefault({
      method: 'POST',
    })
  );
}

export async function signup(options: {
  username: string;
  email: string;
  password: string;
}): Promise<LoginPayload> {
  return await callReturn<RawLoginPayload>(
    '/signup',
    withDefault({
      method: 'POST',
      body: JSON.stringify(options),
      errorOnFail: true,
    })
  ).then((res) => LoginPayload(res));
}
