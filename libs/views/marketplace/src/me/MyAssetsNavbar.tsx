import { Heading, HStack, Icon, IconButton } from '@chakra-ui/react';
import { NavbarBox, NavbarLinksBox, NavbarDefaultItems } from '@omagize/views/shared';
import { BiLeftArrow, BiSticker } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

export function MyAssetsNavbar() {
  const navigate = useNavigate();

  return (
    <NavbarBox>
      <HStack>
        <IconButton
          aria-label="back"
          icon={<BiLeftArrow />}
          onClick={() => navigate('/user/explore')}
        />
        <Icon as={BiSticker} w="40px" h="40px" />
        <Heading size="md">My Assets</Heading>
      </HStack>
      <NavbarLinksBox>
        <NavbarDefaultItems />
      </NavbarLinksBox>
    </NavbarBox>
  );
}
