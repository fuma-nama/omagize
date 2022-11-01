import { RawFriend, RawFriendRequest, RawFriendsData } from '../UserAPI';
import { User } from './user';

export class FriendRequest {
  user: User;
  message?: string;

  constructor(raw: RawFriendRequest) {
    this.user = new User(raw.user);
    this.message = raw.message;
  }
}

export class Friend extends User {
  constructor(raw: RawFriend) {
    super(raw);
  }
}

export class FriendsData {
  friends: Friend[];
  requests: FriendRequest[];

  constructor(raw: RawFriendsData) {
    this.friends = raw.friends.map((f) => new Friend(f));
    this.requests = raw.requests.map((r) => new FriendRequest(r));
  }
}
