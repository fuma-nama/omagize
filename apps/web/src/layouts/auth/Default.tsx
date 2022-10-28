// Chakra imports
import { Box, Center, Flex, Grid, HStack, Text } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAuth';
import ThemeToggle from 'components/fields/ThemeToggle';
// Custom components
import { OmagizeLogo } from 'components/icons/Icons';

function AuthIllustration(props: {
  children: JSX.Element | string;
  illustrationBackground: string;
}) {
  const { children, illustrationBackground } = props;
  // Chakra color mode
  return (
    <Grid
      position="relative"
      minH="full"
      templateColumns={{ base: '1fr', lg: '1fr 1fr', xl: '1fr 0.8fr' }}
    >
      <Flex
        w="full"
        p={{ base: '30px', xl: '50px' }}
        justifyContent="start"
        direction="column"
      >
        <HStack>
          <OmagizeLogo w={8} h={8} />
          <Text fontWeight="600">Omagize</Text>
        </HStack>
        <Box mx="auto" flex={1} mt={{ base: '40px', md: '14vh' }} mb="120px">
          {children}
        </Box>
      </Flex>
      <Box
        display={{ base: 'none', lg: 'block' }}
        h="full"
        bgImg={illustrationBackground}
        bgSize="cover"
        borderBottomLeftRadius="200px"
      />
      <Center pos="absolute" bottom={{ base: '15px', xl: '30px' }} w="full">
        <Box w="1313px" maxW="full" px="30px">
          <Footer />
        </Box>
      </Center>
      <ThemeToggle />
    </Grid>
  );
}

export default AuthIllustration;
