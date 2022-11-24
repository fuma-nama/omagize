import { User } from './user';
import { RawSelfUser } from '../UserAPI';
import { RawLoginPayload } from '../AccountAPI';

export class SelfUser extends User {
  constructor(raw: RawSelfUser) {
    super(raw);
  }
}

export type LoginPayload = {
  user: SelfUser;
};

export function LoginPayload(raw: RawLoginPayload): LoginPayload {
  return {
    user: new SelfUser(raw.user),
  };
}
