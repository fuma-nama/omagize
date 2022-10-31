import { QueryKey } from '@tanstack/react-query';
import { Snowflake } from '../mappers';
import { client } from './client';

export const Keys = {
  login: ['login'],
  groups: ['groups'],
  groupDetail: (group: Snowflake) => ['group_detail', group],
  groupInvite: (group: Snowflake) => ['group_invite', group],
  member: (group: Snowflake, id: Snowflake) => ['member', group, id],
  members: (group: Snowflake) => ['members', group],
  messages: (group: Snowflake) => ['messages', group],
  friends: ['friends'],
  groupEvent: {
    all: ['all_group_event'],
  },
  notifications: {
    user: ['user_notifications'],
    group: (group: Snowflake) => ['group_notifications', group],
  },
  firebase: {
    signin: ['firebase_signin'],
  },
  ws: {
    connect: ['ws_connect'],
  },
};

/**
 * Update query data if exists
 */
export function updateQueryData<T>(key: QueryKey, updater: (prev: T) => T) {
  return client.setQueryData<T>(key, (prev) =>
    prev == null ? undefined : updater(prev)
  );
}
