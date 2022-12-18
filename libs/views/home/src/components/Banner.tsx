// Chakra imports
import { Flex, Text } from '@chakra-ui/react';
import { User } from '@omagize/api';

// Assets
import banner from '../assets/HomeBanner.png';

export default function Banner({ user }: { user: User }) {
  // Chakra Color Mode
  return (
    <Flex
      display={{ base: 'none', '3sm': 'flex' }}
      direction="column"
      bg="brand.300"
      bgImage={{ md: banner }}
      bgSize="cover"
      py={{ base: '30px', md: '56px' }}
      px={{ base: '30px', md: '64px' }}
      borderRadius="30px"
    >
      <Text
        fontSize={{ base: '24px', xl: '34px' }}
        color="white"
        mb="14px"
        maxW="70%"
        fontWeight="700"
        lineHeight={{ base: '32px', md: '42px' }}
      >
        Welcome back, {user.username}
      </Text>
      <Text fontSize="md" color="#E3DAFF" maxW="70%" fontWeight="500" lineHeight="28px">
        Enter in this creative world. Create your own group and start chating!
      </Text>
    </Flex>
  );
}
