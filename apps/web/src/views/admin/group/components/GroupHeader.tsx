import { Box, Icon, MenuItem, MenuList, SimpleGrid, Text, useDisclosure } from '@chakra-ui/react';
import { CardButton } from 'components/card/Card';
import { GroupDetail } from '@omagize/api';
import { AddIcon, ChatIcon } from '@chakra-ui/icons';
import { BsPeopleFill } from 'react-icons/bs';
import { AiFillSetting } from 'react-icons/ai';
import { CustomCardProps } from 'theme/theme';
import { DynamicModal } from 'components/modals/Modal';
import MemberModal from 'components/modals/MemberModal';
import { useNavigate } from 'react-router-dom';
import { FcLeave } from 'react-icons/fc';
import { useColors } from 'variables/colors';
import { useContextMenu } from 'components/menu/ContextMenu';
import { ReactNode } from 'react';

export type GroupHeaderProps = {
  createEvent: () => void;
  invite: () => void;
  group: GroupDetail;
};

export function GroupHeader(props: GroupHeaderProps) {
  const { group } = props;
  const { textColorPrimary } = useColors();
  const { isOpen, onClose, onToggle } = useDisclosure();
  const navigate = useNavigate();

  function Item({ text, icon, ...props }: { text: string; icon: any } & CustomCardProps) {
    return (
      <CardButton alignItems="center" gap={2} rounded="lg" {...props}>
        {icon}
        <Text fontSize={{ base: 'md', md: 'lg' }}>{text}</Text>
      </CardButton>
    );
  }

  return (
    <>
      <DynamicModal isOpen={isOpen}>
        <MemberModal isOpen={isOpen} onClose={onClose} group={group.id} />
      </DynamicModal>
      <SimpleGrid columns={3} gap={2} color={textColorPrimary}>
        <Item
          text="Chat"
          icon={<ChatIcon width="30px" height="30px" />}
          onClick={() => navigate(`/user/chat/${group.id}`)}
        />
        <Item
          text="Members"
          icon={<Icon as={BsPeopleFill} width="30px" height="30px" />}
          onClick={onToggle}
        />
        <Item
          text="Settings"
          icon={<Icon as={AiFillSetting} width="30px" height="30px" />}
          onClick={() => navigate(`/user/${group.id}/settings`)}
        />
      </SimpleGrid>
    </>
  );
}

export function OptionsMenu({
  createEvent,
  invite,
  leave,
  children,
}: GroupHeaderProps & {
  children: ReactNode;
  leave: () => void;
}) {
  const { brand } = useColors();
  const menu = useContextMenu<HTMLDivElement>(
    <>
      <MenuItem onClick={createEvent} icon={<AddIcon color={brand} />}>
        Create Event
      </MenuItem>
      <MenuItem icon={<Icon as={BsPeopleFill} color={brand} />} onClick={invite}>
        Invite People
      </MenuItem>
      <MenuItem color="red.400" icon={<Icon as={FcLeave} />} onClick={leave}>
        Leave Group
      </MenuItem>
    </>
  );

  return (
    <>
      <Box
        cursor="pointer"
        ref={menu.targetRef}
        onMouseDown={(e) => {
          if (e.button === 0) {
            e.preventDefault();
            menu.open(e.pageX, e.pageY);
          }
        }}
      >
        {children}
      </Box>
      {menu.menu}
    </>
  );
}
