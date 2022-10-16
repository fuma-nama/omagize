import { Snowflake } from '../mappers';

export const Keys = {
  login: ['login'],
  groups: ['groups'],
  groupDetail: (group: Snowflake) => ['group_detail', group],
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
};
