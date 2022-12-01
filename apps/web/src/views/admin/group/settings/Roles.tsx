import { Flex, forwardRef, Icon, IconButton, Text } from '@chakra-ui/react';
import { DefaultRole, Role } from '@omagize/api';
import { CardButton } from 'components/card/Card';
import { SelectedRole } from 'components/panel/PermissionManagePanel';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { BsPeopleFill, BsThreeDotsVertical } from 'react-icons/bs';
import { RiTeamLine } from 'react-icons/ri';
import { CustomCardProps } from 'theme/theme';
import { useColors } from 'variables/colors';

export function Roles({
  selected,
  setSelected,
  roles,
}: {
  selected?: SelectedRole;
  setSelected: (v: SelectedRole) => void;
  roles: Role[];
}) {
  return (
    <Droppable droppableId="roles">
      {(provided, snapshot) => (
        <Flex
          direction="column"
          transition="none"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {roles.map((role, i) => (
            <Draggable key={role.id} draggableId={role.id} index={i}>
              {(provided, snapshot) => (
                <RoleItem
                  ref={provided.innerRef}
                  role={role}
                  selected={selected?.type === 'role' && selected.role.id === role.id}
                  box={{
                    my: 2,
                    onClick: () =>
                      setSelected({
                        type: 'role',
                        role: role,
                      }),
                    ...provided.dragHandleProps,
                    ...provided.draggableProps,
                  }}
                />
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </Flex>
      )}
    </Droppable>
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

export const RoleItem = forwardRef<{ role: Role; selected: boolean; box: CustomCardProps }, 'div'>(
  ({ role, selected, box }, ref) => {
    const { brand, cardBg } = useColors();

    return (
      <CardButton
        ref={ref}
        gap={3}
        alignItems="center"
        flexDirection="row"
        color={selected && 'white'}
        bg={selected ? brand : cardBg}
        userSelect="none"
        _hover={
          selected && {
            bg: brand,
          }
        }
        {...box}
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
);
