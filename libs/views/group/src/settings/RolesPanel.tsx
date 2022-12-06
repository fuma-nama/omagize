import { Button, ButtonGroup, Flex, Grid, Show } from '@chakra-ui/react';
import { GroupDetail, Role, Snowflake, UpdateRolesOptions } from '@omagize/api';
import { useGroupDetailQuery, useUpdateRolesMutation } from '@omagize/data-access-api';
import { QueryStatus, LoadingPanel, SaveBar } from '@omagize/ui/components';
import { useMemo, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { MappedRole, UpdateRoleModal, UpdateRolePanel } from './UpdateRolePanel';
import { DefaultRoleItem, Roles } from './Roles';
import { CreateRolePanel } from './CreateRolePanel';

export type SelectedRole =
  | {
      type: 'role';
      id: Snowflake;
    }
  | {
      type: 'default_role';
    };

export function RolePanel({ groupId }: { groupId: Snowflake }) {
  const query = useGroupDetailQuery(groupId);
  const group = query.data;

  const [value, setValue] = useState<UpdateRolesOptions>({});
  const [selected, setSelected] = useState<SelectedRole | null>();
  const combined = useCombinedRoles(group?.roles, value);
  const mappedSelect = useMemo(() => mapSelect(group, selected), [group, selected]);

  const onDragEnd = (result: DropResult) => {
    const updates = handleDragEnd(group, value, result);
    if (updates == null) return;

    setValue((prev) => {
      return {
        ...prev,
        positions: {
          ...prev.positions,
          ...updates,
        },
      };
    });
  };

  return (
    <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={3}>
      <QueryStatus loading={<LoadingPanel size="sm" />} query={query} error="Failed to load roles">
        <Flex direction="column" gap={3}>
          <CreateRolePanel group={groupId} />
          <DragDropContext onDragEnd={onDragEnd}>
            <Roles
              roles={combined}
              selected={selected?.type === 'role' ? selected.id : null}
              setSelected={(v) => setSelected({ type: 'role', id: v.id })}
            />
          </DragDropContext>
          <DefaultRoleItem
            selected={selected?.type === 'default_role'}
            role={group?.defaultRole}
            onClick={() => setSelected({ type: 'default_role' })}
          />
        </Flex>
      </QueryStatus>
      <Show above="lg">
        <UpdateRolePanel selected={mappedSelect} value={value} setValue={setValue} />
      </Show>
      <Show below="lg">
        <UpdateRoleModal
          selected={mappedSelect}
          value={value}
          setValue={setValue}
          onClose={() => setSelected(null)}
        />
      </Show>
      <RolesSaveBar group={query.data?.id} value={value} reset={() => setValue({})} />
    </Grid>
  );
}

function handleDragEnd(
  group: GroupDetail,
  value: UpdateRolesOptions,
  { source, destination, draggableId }: DropResult
): {
  [key: string]: number;
} | null {
  if (destination == null || source.index === destination.index) return null;
  const updates = {
    [draggableId]: destination.index,
  };
  const type = source.index > destination.index ? 'forward' : 'backward';

  for (const role of group.roles) {
    const position = value?.positions?.[role.id] ?? role.position;

    if (type === 'forward' && position >= destination.index && position < source.index) {
      updates[role.id] = position + 1;
    }
    if (type === 'backward' && position > source.index && position <= destination.index) {
      updates[role.id] = position - 1;
    }
  }

  return updates;
}

function useCombinedRoles(roles: Role[] | null, value: UpdateRolesOptions) {
  return useMemo(
    () =>
      roles?.map((role) => ({
        ...role,
        ...value.roles?.[role.id],
        position: value.positions?.[role.id] ?? role.position,
      })),
    [roles, value.roles, value.positions]
  );
}

function mapSelect(group: GroupDetail | null, selected: SelectedRole | null): MappedRole | null {
  if (selected == null || group == null) return null;

  switch (selected.type) {
    case 'role': {
      const role = group?.roles.find((role) => role.id === selected.id);
      if (role == null) return null;

      return {
        type: 'role',
        role,
      };
    }
    case 'default_role':
      return {
        type: 'default_role',
        role: group?.defaultRole,
      };
    default:
      return null;
  }
}

function RolesSaveBar({
  value,
  group,
  reset,
}: {
  value: UpdateRolesOptions;
  group: Snowflake;
  reset: () => void;
}) {
  const mutation = useUpdateRolesMutation();

  return (
    <SaveBar isOpen={Object.entries(value).length !== 0}>
      <ButtonGroup isDisabled={mutation.isLoading} ml="auto">
        <Button
          rounded="full"
          colorScheme="green"
          isLoading={mutation.isLoading}
          onClick={() => mutation.mutate({ group, value }, { onSuccess: reset })}
        >
          Save
        </Button>
        <Button rounded="full" onClick={reset}>
          Discard
        </Button>
      </ButtonGroup>
    </SaveBar>
  );
}
