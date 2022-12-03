import { BiLeftArrow } from 'react-icons/bi';
import { IconButton, HStack, Avatar, Text } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { NavbarLinksBox, NavbarDefaultItems } from '@omagize/views/shared';
import { useUserInfo } from '@omagize/data-access-api';

export function PrivateChatNavbar() {
  const navigate = useNavigate();
  const { user } = useParams();
  const query = useUserInfo(user);
  const info = query.data;

  return (
    <NavbarLinksBox gap={2}>
      <IconButton aria-label="back" icon={<BiLeftArrow />} onClick={() => navigate(`/user/home`)} />
      <HStack mr="auto">
        <Avatar src={info?.avatarUrl} name={info?.username} size="sm" />
        <Text fontWeight="600" fontSize="xl">
          {info?.username}
        </Text>
      </HStack>
      <NavbarDefaultItems />
    </NavbarLinksBox>
  );
}
