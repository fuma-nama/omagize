import { HStack, Avatar } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useColors } from 'variables/colors';

export function MentionEntity(props: { avatar?: string; children: ReactNode }) {
  const { brand } = useColors();
  const avatar = props.avatar;

  return (
    <HStack
      as="span"
      bg={brand}
      rounded="full"
      color="white"
      px={2}
      py={1}
      fontWeight="600"
      display="inline-flex"
      fontSize="sm"
      cursor="pointer"
    >
      <Avatar src={avatar} w={5} h={5} />
      {props.children}
    </HStack>
  );
}
