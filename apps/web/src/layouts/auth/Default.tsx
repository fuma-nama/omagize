// Chakra imports
import { Box, Center, Flex, Grid, Icon, Text } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAuth';
import ThemeToggle from 'components/fields/ThemeToggle';
// Custom components
import { NavLink } from 'react-router-dom';
// Assets
import { FaChevronLeft } from 'react-icons/fa';

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
        mx="auto"
        pt={{ sm: '50px', md: '0px' }}
        px={{ lg: '30px', xl: '0px' }}
        ps={{ xl: '70px' }}
        justifyContent="start"
        direction="column"
      >
        <NavLink
          to="/admin"
          style={() => ({
            width: 'fit-content',
            marginTop: '40px',
          })}
        >
          <Flex
            align="center"
            ps={{ base: '25px', lg: '0px' }}
            pt={{ lg: '0px', xl: '0px' }}
            w="fit-content"
          >
            <Icon
              as={FaChevronLeft}
              me="12px"
              h="13px"
              w="8px"
              color="secondaryGray.600"
            />
            <Text ms="0px" fontSize="sm" color="secondaryGray.600">
              Back to Simmmple
            </Text>
          </Flex>
        </NavLink>
        <Box flex={1} mt={{ base: '40px', md: '14vh' }} mb="120px">
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
