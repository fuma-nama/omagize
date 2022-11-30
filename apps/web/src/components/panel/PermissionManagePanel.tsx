import { FormControl } from '@chakra-ui/form-control';
import { Flex } from '@chakra-ui/layout';
import { DefaultRole, GroupPermission, Role, UpdateRolesOptions } from '@omagize/api';
import CustomCard from 'components/card/Card';
import SwitchField from 'components/fields/SwitchField';

export type SelectedRole =
  | {
      type: 'role';
      role: Role;
    }
  | {
      type: 'default_role';
      role: DefaultRole;
    };

export function usePermissionManagePanel(
  selected: SelectedRole | null,
  value: UpdateRolesOptions,
  setValue: React.Dispatch<React.SetStateAction<UpdateRolesOptions>>
) {
  if (selected == null) return null;

  function change(id: keyof UpdateRolesOptions, v: Partial<GroupPermission>) {
    setValue((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...v,
      },
    }));
  }

  switch (selected.type) {
    case 'role':
      return (
        <PermissionManagePanel
          permission={selected.role}
          value={value[selected.role.id]}
          onChange={(e) => change(selected.role.id, e)}
        />
      );
    case 'default_role':
      return (
        <PermissionManagePanel
          permission={selected.role}
          value={value.defaultRole}
          onChange={(e) => change('defaultRole', e)}
        />
      );
  }
}

export function PermissionManagePanel({
  permission,
  value,
  onChange,
}: {
  permission: GroupPermission;
  value: Partial<GroupPermission>;
  onChange: (update: Partial<GroupPermission>) => void;
}) {
  return (
    <Flex direction="column" gap={2}>
      <FormControl as={CustomCard}>
        <SwitchField
          id="admin"
          label="Administrator"
          desc="Allows kick and ban members"
          isChecked={value?.admin ?? permission.admin}
          onChange={(e) => onChange({ admin: e.target.checked })}
        />
      </FormControl>
      <FormControl as={CustomCard}>
        <SwitchField
          id="mention_everyone"
          label="Mention Everyone"
          desc="Allows to mention @everyone"
          isChecked={value?.mentionEveryone ?? permission.mentionEveryone}
          onChange={(e) => onChange({ mentionEveryone: e.target.checked })}
        />
      </FormControl>
    </Flex>
  );
}
