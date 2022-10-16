import { Snowflake } from '../utils';

export const Keys = {
  login: ['login'],
  groups: ['groups'],
  groupDetail: (group: Snowflake) => ['group_detail', group],
  member: (group: Snowflake, id: Snowflake) => ['member', group, id],
  members: (group: Snowflake) => ['members', group],
};
