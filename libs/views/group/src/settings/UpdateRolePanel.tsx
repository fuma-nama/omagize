import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Box, Flex, Grid } from '@chakra-ui/layout';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import {
  DefaultRole,
  GroupPermission,
  Role,
  Snowflake,
  UpdateDefaultRole,
  UpdateRole,
  UpdateRolesOptions,
} from '@omagize/api';
import { Card, SwitchField } from '@omagize/ui/components';
import { useColors } from '@omagize/ui/theme';

export type SelectedRole =
  | {
      type: 'role';
      role: Role;
    }
  | {
      type: 'default_role';
      role: DefaultRole;
    };

export type UpdateRolePanelProps = {
  selected: SelectedRole | null;
  value: UpdateRolesOptions;
  setValue: React.Dispatch<React.SetStateAction<UpdateRolesOptions>>;
};

export function UpdateRolePanel({ selected, value, setValue }: UpdateRolePanelProps) {
  const roles = value.roles ?? {};

  function changeDefault(v: UpdateDefaultRole) {
    setValue((prev) => ({
      ...prev,
      defaultRole: {
        ...prev.defaultRole,
        ...v,
      },
    }));
  }

  function changeRole(id: Snowflake, v: UpdateRole) {
    setValue((prev) => ({
      ...prev,
      roles: {
        ...prev.roles,
        [id]: {
          ...prev.roles?.[id],
          ...v,
        },
      },
    }));
  }

  switch (selected?.type) {
    case 'role':
      return (
        <Flex direction="column" gap={2}>
          <RoleManagePanel
            role={selected.role}
            value={roles[selected.role.id]}
            onChange={(e) => changeRole(selected.role.id, e)}
          />
          <PermissionManagePanel
            permission={selected.role}
            value={roles[selected.role.id]}
            onChange={(e) => changeRole(selected.role.id, e)}
          />
        </Flex>
      );
    case 'default_role':
      return (
        <PermissionManagePanel
          permission={selected.role}
          value={value.defaultRole}
          onChange={(e) => changeDefault(e)}
        />
      );
  }
}

export function UpdateRoleModal({
  selected,
  value,
  setValue,
  onClose,
}: UpdateRolePanelProps & { onClose: () => void }) {
  return (
    <Modal isOpen={selected != null} onClose={onClose} size="xl" scrollBehavior="inside" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Update Role</ModalHeader>
        <ModalBody>
          <UpdateRolePanel selected={selected} value={value} setValue={setValue} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export function RoleManagePanel({
  role,
  value,
  onChange,
}: {
  role: Role;
  value?: UpdateRole;
  onChange: (update: UpdateRole) => void;
}) {
  const { brand, textColorSecondary } = useColors();

  return (
    <Grid templateColumns="10px 1fr" gap={2}>
      <Box bg={brand} rounded="lg" />
      <FormControl as={Flex} direction="column">
        <FormLabel htmlFor="role-name" color={textColorSecondary}>
          Role Name
        </FormLabel>
        <Input
          id="role-name"
          variant="flushed"
          value={value?.name ?? role.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </FormControl>
    </Grid>
  );
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
      <FormControl as={Card}>
        <SwitchField
          id="admin"
          label="Administrator"
          desc="Allows kick and ban members"
          isChecked={value?.admin ?? permission.admin}
          onChange={(e) => onChange({ admin: e.target.checked })}
        />
      </FormControl>
      <FormControl as={Card}>
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
