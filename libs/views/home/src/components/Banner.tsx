// Chakra imports
import { Button, ButtonGroup, Flex, Text } from '@chakra-ui/react';
import { User } from '@omagize/api';

// Assets
import banner from '../assets/HomeBanner.png';

export default function Banner({ user }: { user: User }) {
  // Chakra Color Mode
  return (
    <Flex
      direction="column"
      bgImage={banner}
      bgSize="cover"
      py={{ base: '30px', md: '56px' }}
      px={{ base: '30px', md: '64px' }}
      borderRadius="30px"
    >
      <Text
        fontSize={{ base: '24px', md: '34px' }}
        color="white"
        mb="14px"
        maxW={{
          base: '100%',
          md: '64%',
          lg: '46%',
          xl: '70%',
          '2xl': '50%',
          '3xl': '42%',
        }}
        fontWeight="700"
        lineHeight={{ base: '32px', md: '42px' }}
      >
        Welcome back, {user.username}
      </Text>
      <Text
        fontSize="md"
        color="#E3DAFF"
        maxW={{
          base: '100%',
          md: '64%',
          lg: '40%',
          xl: '56%',
          '2xl': '46%',
          '3xl': '34%',
        }}
        fontWeight="500"
        lineHeight="28px"
      >
        Enter in this creative world. Create your own group and start chating!
      </Text>
      <ButtonGroup mt="40px" gap="10px">
        <Button
          bg="white"
          color="black"
          _hover={{ bg: 'whiteAlpha.900' }}
          _active={{ bg: 'white' }}
          _focus={{ bg: 'white' }}
          fontWeight="500"
          fontSize="14px"
          py="20px"
          px="27"
        >
          Discover now
        </Button>
        <Button variant="link" color="white" fontSize="sm" fontWeight="500">
          Watch video
        </Button>
      </ButtonGroup>
    </Flex>
  );
}
