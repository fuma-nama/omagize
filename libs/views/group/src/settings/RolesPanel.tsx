import {
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  Grid,
  HStack,
  Input,
  Show,
} from '@chakra-ui/react';
import { Snowflake, UpdateRolesOptions } from '@omagize/api';
import {
  useCreateRoleMutation,
  useGroupDetailQuery,
  useUpdateRolesMutation,
} from '@omagize/data-access-api';
import { QueryStatus, LoadingPanel, SaveBar } from '@omagize/ui/components';
import { useMemo, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { SelectedRole, UpdateRoleModal, UpdateRolePanel } from './UpdateRolePanel';
import { DefaultRoleItem, Roles } from './Roles';

export type OpenedRole =
  | {
      type: 'role';
      id: Snowflake;
    }
  | {
      type: 'default_role';
    };

export function RolePanel({ groupId }: { groupId: Snowflake }) {
  const query = useGroupDetailQuery(groupId);
  const [value, setValue] = useState<UpdateRolesOptions>({});
  const [open, setOpen] = useState<OpenedRole | null>();
  const group = query.data;

  const mappedRoles = useMemo(
    () =>
      group?.roles.map((role) => ({
        ...role,
        ...value.roles?.[role.id],
        position: value.positions?.[role.id] ?? role.position,
      })),
    [group?.roles, value.roles, value.positions]
  );
  const selected = useMemo<SelectedRole>(() => {
    if (open == null || group == null) return null;

    switch (open.type) {
      case 'role': {
        const role = group?.roles.find((role) => role.id === open.id);
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
  }, [group, open]);

  const onDragEnd = ({ source, destination, draggableId }: DropResult) => {
    if (destination == null || source.index === destination.index) return;
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
              roles={mappedRoles}
              selected={open?.type === 'role' ? open.id : null}
              setSelected={(v) => setOpen({ type: 'role', id: v.id })}
            />
          </DragDropContext>
          <DefaultRoleItem
            selected={open?.type === 'default_role'}
            role={group?.defaultRole}
            onClick={() => setOpen({ type: 'default_role' })}
          />
        </Flex>
      </QueryStatus>
      <Show above="lg">
        <UpdateRolePanel selected={selected} value={value} setValue={setValue} />
      </Show>
      <Show below="lg">
        <UpdateRoleModal
          selected={selected}
          value={value}
          setValue={setValue}
          onClose={() => setOpen(null)}
        />
      </Show>
      <RolesSaveBar group={query.data?.id} value={value} reset={() => setValue({})} />
    </Grid>
  );
}

function CreateRolePanel({ group }: { group: Snowflake }) {
  const [name, setName] = useState('');
  const mutation = useCreateRoleMutation();

  return (
    <FormControl>
      <HStack>
        <Input
          w="full"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="focus"
          placeholder="Role name..."
        />
        <Button
          variant="brand"
          isLoading={mutation.isLoading}
          onClick={() =>
            mutation.mutate({
              group,
              name,
            })
          }
          disabled={mutation.isLoading || name.trim().length === 0}
        >
          Create
        </Button>
      </HStack>
    </FormControl>
  );
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
