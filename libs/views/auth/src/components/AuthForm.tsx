import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { useColors } from '@omagize/ui/theme';
import { ReactNode } from 'react';

export function AuthForm({
  title,
  description,
  children,
}: {
  title: string;
  description?: string | ReactNode;
  children: ReactNode;
}) {
  const { textColorPrimary: textColor, textColorSecondary } = useColors();

  return (
    <>
      <Box me="auto">
        <Heading color={textColor} fontSize="36px" mb="10px">
          {title}
        </Heading>
        <Text mb="36px" ms="4px" color={textColorSecondary} fontWeight="400" fontSize="md">
          {description}
        </Text>
      </Box>
      <Flex
        zIndex="2"
        direction="column"
        w={{ base: '100%', md: '420px' }}
        maxW="100%"
        background="transparent"
        borderRadius="15px"
        mx={{ base: 'auto', lg: 'unset' }}
        me="auto"
        mb={{ base: '20px', md: 'auto' }}
      >
        {children}
      </Flex>
    </>
  );
}
