// Chakra imports
import { Flex, FlexProps, Heading, VStack } from '@chakra-ui/react';

// Custom components
import { OmagizeLogo } from 'components/icons/Icons';

export function SidebarBrand(props: FlexProps) {
  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      bg="brand.400"
      rounded="lg"
      {...props}
    >
      <VStack align="center" my="32px" color="white">
        <OmagizeLogo w="80px" h="80px" my="-30px" />
        <Heading m={0}>Omagize</Heading>
      </VStack>
    </Flex>
  );
}

export default SidebarBrand;
