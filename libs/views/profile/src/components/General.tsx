// Chakra imports
import { SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';
// Custom components
import { firebase } from '@omagize/api';
import { useSelfUser } from '@omagize/data-access-api';
import { Card } from '@omagize/ui/components';
import { useColors } from '@omagize/ui/theme';
import Information from './Information';

// Assets
export default function GeneralInformation(props: { [x: string]: any }) {
  // Chakra Color Mode
  const { textColorPrimary, textColorSecondary } = useColors();
  const cardShadow = useColorModeValue('0px 18px 40px rgba(112, 144, 176, 0.12)', 'unset');
  const user = useSelfUser();
  const auth = firebase.auth.currentUser;

  return (
    <Card {...props}>
      <Text color={textColorPrimary} fontWeight="bold" fontSize="2xl" mt="10px" mb="4px">
        General Information
      </Text>
      <Text color={textColorSecondary} fontSize="md" me="26px" mb="40px">
        Some details of Your Account
      </Text>
      <SimpleGrid columns={{ base: 1, xl: 2 }} gap="20px">
        <Information boxShadow={cardShadow} title="Email Address" value={auth?.email} />
        <Information
          boxShadow={cardShadow}
          title="Created At"
          value={new Date(user.createdAt).toLocaleString()}
        />
        <Information boxShadow={cardShadow} title="User ID" value={user.id} />
      </SimpleGrid>
    </Card>
  );
}
