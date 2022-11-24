import { Button, Heading, HStack, Icon } from '@chakra-ui/react';
import { NavbarBox } from 'components/navbar/NavbarAdmin';
import { NavbarDefaultItems, NavbarLinksBox } from 'components/navbar/NavbarLinksAdmin';
import { BiLeftArrow, BiSticker } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

export default function MyAssetsNavbar() {
  const navigate = useNavigate();

  return (
    <NavbarBox>
      <HStack>
        <Icon as={BiSticker} w="40px" h="40px" />
        <Heading size="md">My Assets</Heading>
      </HStack>
      <NavbarLinksBox>
        <Button leftIcon={<BiLeftArrow />} mr={2} onClick={() => navigate('/user/explore')}>
          Back
        </Button>
        <NavbarDefaultItems />
      </NavbarLinksBox>
    </NavbarBox>
  );
}
