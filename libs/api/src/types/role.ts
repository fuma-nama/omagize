import { Snowflake } from './common';

export interface GroupPermission {
  manageMembers: boolean;
  mentionEveryone: boolean;
  manageGroupEvent: boolean;
  manageMessages: boolean;
}

export interface Role extends GroupPermission {
  id: Snowflake;
  name: string;
  group: Snowflake;
  position: number;
}

export interface DefaultRole extends GroupPermission {
  group: Snowflake;
}

export type RoleObject = {
  roles: Role[];
  defaultRole: DefaultRole;
};

export function isRole(obj: GroupPermission): boolean {
  return 'id' in obj && 'name' in obj;
}
