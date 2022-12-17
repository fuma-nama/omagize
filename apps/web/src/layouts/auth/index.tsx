import { Outlet } from 'react-router-dom';
// Chakra imports
import { Box, useColorModeValue } from '@chakra-ui/react';

// Custom Chakra theme
export default function Auth() {
  // states and functions
  const authBg = useColorModeValue('white', 'navy.900');
  document.documentElement.dir = 'ltr';
  return (
    <Box
      h="full"
      overflow="auto"
      bg={authBg}
      float="right"
      minHeight="100vh"
      height="100%"
      position="relative"
      w="100%"
    >
      <Outlet />
    </Box>
  );
}
