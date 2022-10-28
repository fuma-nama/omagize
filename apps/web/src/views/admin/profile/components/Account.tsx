import {
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useLoginQuery } from '@omagize/api';
import CustomCard from 'components/card/Card';
import { ReactNode } from 'react';
import { useColors } from 'variables/colors';

export function AccountSettings(props: {}) {
  const { account } = useLoginQuery().data;

  return (
    <CustomCard>
      <Text fontSize="2xl" fontWeight="600">
        Account Settings
      </Text>
      <Flex direction="column" gap={2} mt={2}>
        <Block text="Email">
          <HStack>
            <Input variant="main" value={account.email} disabled />
            <Button variant="brand">Reset</Button>
          </HStack>
        </Block>

        <Block text="Password">
          <ButtonGroup>
            <Button variant="brand">Forgot</Button>
            <Button>Reset</Button>
          </ButtonGroup>
        </Block>
      </Flex>
    </CustomCard>
  );
}

function Block({ text, children }: { text: string; children: ReactNode }) {
  const { textColorSecondary } = useColors();
  const bg = useColorModeValue('white', 'navy.700');

  return (
    <CustomCard bg={bg} my={2}>
      <Text color={textColorSecondary} fontWeight="500" mb={2}>
        {text}
      </Text>
      {children}
    </CustomCard>
  );
}
