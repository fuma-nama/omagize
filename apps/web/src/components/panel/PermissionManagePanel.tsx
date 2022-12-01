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
  ModalOverlay,
} from '@chakra-ui/react';
import {
  DefaultRole,
  GroupPermission,
  Role,
  UpdateDefaultRole,
  UpdateRole,
  UpdateRolesOptions,
} from '@omagize/api';
import CustomCard from 'components/card/Card';
import SwitchField from 'components/fields/SwitchField';
import { useColors } from 'variables/colors';

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
  onClose: () => void,
  value: UpdateRolesOptions,
  setValue: React.Dispatch<React.SetStateAction<UpdateRolesOptions>>
) {
  function change(id: keyof UpdateRolesOptions, v: UpdateRole | UpdateDefaultRole) {
    setValue((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...v,
      },
    }));
  }

  function getPanel() {
    switch (selected?.type) {
      case 'role':
        return (
          <>
            <RoleManagePanel
              role={selected.role}
              value={value[selected.role.id]}
              onChange={(e) => change(selected.role.id, e)}
            />
            <PermissionManagePanel
              permission={selected.role}
              value={value[selected.role.id]}
              onChange={(e) => change(selected.role.id, e)}
            />
          </>
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

  return {
    asComponent: () => (
      <Flex direction="column" gap={2}>
        {getPanel()}
      </Flex>
    ),
    asModal: () => (
      <Modal isOpen={selected != null} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" gap={4}>
            {getPanel()}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    ),
  };
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
