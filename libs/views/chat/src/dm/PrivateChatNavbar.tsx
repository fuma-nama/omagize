import { BiLeftArrowAlt } from 'react-icons/bi';
import { IconButton, HStack, Avatar, Text, Flex, Icon } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { NavbarLinksBox, NavbarDefaultItems } from '@omagize/views/shared';
import { useUserInfo } from '@omagize/data-access-api';

export function PrivateChatNavbar() {
  const navigate = useNavigate();
  const { user } = useParams();
  const query = useUserInfo(user);
  const info = query.data;

  return (
    <Flex direction="row" align="center" gap={2} p={{ base: 2, md: 7 }} py={{ base: 2, md: 4 }}>
      <IconButton
        minW={0}
        py={2}
        pr={2}
        icon={<Icon as={BiLeftArrowAlt} w="20px" h="20px" />}
        onClick={() => navigate(`/user/home`)}
        variant="link"
        aria-label="back"
      />
      <HStack mr="auto">
        <Avatar src={info?.avatarUrl} name={info?.username} size={{ base: 'sm', md: 'md' }} />
        <Text fontWeight="600" fontSize="xl">
          {info?.username}
        </Text>
      </HStack>
      <NavbarLinksBox>
        <NavbarDefaultItems />
      </NavbarLinksBox>
    </Flex>
  );
}
