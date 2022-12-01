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
import { RiTeamLine } from 'react-icons/ri';
import { CustomCardProps } from 'theme/theme';
import { useColors } from 'variables/colors';

export function RolePanel({ groupId }: { groupId: Snowflake }) {
  const query = useGroupDetailQuery(groupId);
  const [name, setName] = useState('');
  const [value, setValue] = useState<UpdateRolesOptions>({});
  const [open, setOpen] = useState<SelectedRole>();
  const panel = usePermissionManagePanel(open, value, setValue);
  const group = query.data;

  return (
    <Grid templateColumns="1fr 1fr" gap={3}>
      <QueryStatus loading={<LoadingPanel size="sm" />} query={query} error="Failed to load roles">
        <Flex direction="column" gap={3}>
          <CreateRolePanel group={groupId} name={name} setName={setName} />
          {group?.roles
            .filter((role) => role.name.toLowerCase().startsWith(name.toLowerCase()))
            .map((role) => (
              <RoleItem
                key={role.id}
                selected={open?.type === 'role' && open.role.id === role.id}
                role={role}
                onClick={() =>
                  setOpen({
                    type: 'role',
                    role: role,
                  })
                }
              />
            ))}
          <DefaultRoleItem
            selected={open?.type === 'default_role'}
            role={group?.defaultRole}
            onClick={() =>
              setOpen({
                type: 'default_role',
                role: group?.defaultRole,
              })
            }
          />
        </Flex>
      </QueryStatus>
      {panel}
      <RolesSaveBar group={query.data?.id} value={value} reset={() => setValue({})} />
    </Grid>
  );
}

function CreateRolePanel({
  group,
  name,
  setName,
}: {
  group: Snowflake;
  name: string;
  setName: (v: string) => void;
}) {
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
        <Button
          variant="brand"
          isLoading={mutation.isLoading}
          onClick={() => mutation.mutate()}
          disabled={mutation.isLoading || name.trim().length === 0}
        >
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

export function RoleItem({
  role,
  selected,
  ...props
}: { role: Role; selected: boolean } & Omit<CustomCardProps, 'role'>) {
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
      <Icon as={RiTeamLine} />
      <Text fontSize="xl" fontWeight="600">
        {role.name}
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
