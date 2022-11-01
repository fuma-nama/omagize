import { User } from './user';
import { RawSelfUser } from '../UserAPI';
import { RawAccount, RawLoginPayload } from '../AccountAPI';

export class SelfUser extends User {
  constructor(raw: RawSelfUser) {
    super(raw);
  }
}

export type Account = RawAccount;

export type LoginPayload = {
  account: Account;
  user: SelfUser;
  token: string;
};

export function LoginPayload(raw: RawLoginPayload): LoginPayload {
  return {
    account: raw.account,
    user: new SelfUser(raw.user),
    token: raw.token,
  };
}
