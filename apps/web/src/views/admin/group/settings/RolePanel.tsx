import {
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  Grid,
  HStack,
  Icon,
  IconButton,
  Input,
  Text,
} from '@chakra-ui/react';
import {
  createRole,
  DefaultRole,
  Role,
  Snowflake,
  updateRoles,
  UpdateRolesOptions,
  useGroupDetailQuery,
} from '@omagize/api';
import { useMutation } from '@tanstack/react-query';
import { CardButton } from 'components/card/Card';
import LoadingPanel from 'components/panel/LoadingPanel';
import { SelectedRole, usePermissionManagePanel } from 'components/panel/PermissionManagePanel';
import { QueryStatus } from 'components/panel/QueryPanel';
import { SaveBar } from 'components/panel/SaveBar';
import { useState } from 'react';
import { BsPeopleFill, BsThreeDotsVertical } from 'react-icons/bs';
import { CustomCardProps } from 'theme/theme';
import { useColors } from 'variables/colors';

export function RolePanel({ groupId }: { groupId: Snowflake }) {
  const group = useGroupDetailQuery(groupId);
  const [value, setValue] = useState<UpdateRolesOptions>({});
  const [open, setOpen] = useState<SelectedRole>();
  const panel = usePermissionManagePanel(open, value, setValue);

  return (
    <Grid templateColumns="1fr 1fr" gap={3}>
      <QueryStatus loading={<LoadingPanel size="sm" />} query={group} error="Failed to load roles">
        <Flex direction="column" gap={3}>
          <CreateRolePanel group={groupId} />
          <DefaultRoleItem
            selected={open != null && open.type === 'default_role'}
            role={group.data?.defaultRole}
            onClick={() =>
              setOpen({
                type: 'default_role',
                role: group?.data.defaultRole,
              })
            }
          />
        </Flex>
      </QueryStatus>
      {panel}
      <RolesSaveBar group={group.data?.id} value={value} reset={() => setValue({})} />
    </Grid>
  );
}

function CreateRolePanel({ group }: { group: Snowflake }) {
  const [name, setName] = useState('');
  const mutation = useMutation(() => createRole(group, name));

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
        <Button variant="brand" isLoading={mutation.isLoading} onClick={() => mutation.mutate()}>
          Create
        </Button>
      </HStack>
    </FormControl>
  );
}

export function DefaultRoleItem({
  role,
  selected,
  ...props
}: { role: DefaultRole; selected: boolean } & Omit<CustomCardProps, 'role'>) {
  const { brand, cardBg } = useColors();

  return (
    <CardButton
      gap={3}
      alignItems="center"
      flexDirection="row"
      color={selected && 'white'}
      bg={selected ? brand : cardBg}
      _hover={
        selected && {
          bg: brand,
        }
      }
      {...props}
    >
      <Icon as={BsPeopleFill} />
      <Text fontSize="xl" fontWeight="600">
        All Members
      </Text>
      <IconButton
        ml="auto"
        icon={<BsThreeDotsVertical />}
        aria-label="Settings"
        variant={selected && 'brand'}
      />
    </CardButton>
  );
}

export function RoleItem({ role }: { role: Role }) {
  return;
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
  const mutation = useMutation(() => updateRoles(group, value), {
    onSuccess() {
      reset();
    },
  });

  return (
    <SaveBar isOpen={Object.entries(value).length !== 0}>
      <ButtonGroup isDisabled={mutation.isLoading} ml="auto">
        <Button
          rounded="full"
          colorScheme="green"
          isLoading={mutation.isLoading}
          onClick={() => mutation.mutate()}
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
