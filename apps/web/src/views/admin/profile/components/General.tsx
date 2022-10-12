// Chakra imports
import { SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import Information from 'views/admin/profile/components/Information';
import { useColors } from 'variables/colors';
import { useLoginQuery } from 'api/AccountAPI';

// Assets
export default function GeneralInformation(props: { [x: string]: any }) {
  // Chakra Color Mode
  const { textColorPrimary, textColorSecondary } = useColors();
  const cardShadow = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.12)',
    'unset'
  );
  const { account, user } = useLoginQuery().data;

  return (
    <Card {...props}>
      <Text
        color={textColorPrimary}
        fontWeight="bold"
        fontSize="2xl"
        mt="10px"
        mb="4px"
      >
        General Information
      </Text>
      <Text color={textColorSecondary} fontSize="md" me="26px" mb="40px">
        Some details of Your Account
      </Text>
      <SimpleGrid columns={{ base: 1, xl: 2 }} gap="20px">
        <Information
          boxShadow={cardShadow}
          title="Email Address"
          value={account.email}
        />
        <Information
          boxShadow={cardShadow}
          title="Created At"
          value={new Date(user.createdAt).toLocaleString()}
        />
      </SimpleGrid>
    </Card>
  );
}
