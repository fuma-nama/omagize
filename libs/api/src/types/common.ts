export type Snowflake = string;
/**
 * parsed from json, you must use `new Date()` to convert it to Date
 */
export type DateObject = string | number;

export class OmagizeError {
  code: APIErrorCode;
  message: string;

  constructor(raw: RawOmagizeError) {
    this.code = raw.code;
    this.message = raw.message;
  }
}

export type RawOmagizeError = {
  code: APIErrorCode;
  message: string;
};

export enum APIErrorCode {
  InternalError = 0,
  GroupNotExist = 200,
  UserNotExist = 201,
  GroupAlreadyJoined = 202,
  MemberNotExist = 203,
  EmailAlreadyUsed = 204,
  WrongPassword = 302,
  InvalidEmail = 303,
  InvalidInviteCode = 304,
  MissingParam = 305,
  WeakPassword = 400,
  FriendRequestAlreadyExist = 205,
  FriendRequestNotExist = 206,

  /** Caused by client-side */
  Client = 1,
}
