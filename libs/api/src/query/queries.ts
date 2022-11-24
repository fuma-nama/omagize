import { QueryKey } from '@tanstack/react-query';
import { Snowflake } from '../types';
import { client } from './client';

export const Keys = {
  login: ['login'],
  groups: ['groups'],
  groupDetail: (group: Snowflake) => ['group_detail', group],
  groupInvite: (group: Snowflake) => ['group_invite', group],
  user: (id: Snowflake) => ['user', id],
  member: (group: Snowflake, id: Snowflake) => ['member', group, id],
  members: (group: Snowflake) => ['members', group],
  messages: (group: Snowflake) => ['messages', group],
  market: {
    assets: ['assets'],
    me: ['my_assets'],
  },
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
    status: ['ws_status'],
  },
};

/**
 * Update query data if exists
 */
export function updateQueryData<T>(key: QueryKey, updater: (prev: T) => T) {
  return client.setQueryData<T>(key, (prev) => (prev == null ? undefined : updater(prev)));
}
