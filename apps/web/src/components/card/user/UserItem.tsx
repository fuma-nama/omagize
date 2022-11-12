import {
  Avatar,
  Flex,
  HStack,
  StackProps,
  Text,
  useToken,
} from '@chakra-ui/react';
import { useColors } from '../../../variables/colors';
import Card, { TagCard } from '../Card';
import FadeImage from '../utils/FadeImage';
import { User } from '@omagize/api';
import { CustomCardProps } from 'theme/theme';

export default function UserItem({
  user,
  ...props
}: { user: User } & CustomCardProps) {
  const [brand] = useToken('color', ['brand.400']);
  const { textColorPrimary } = useColors();
  const image = user.bannerUrl ?? user.avatarUrl;

  return (
    <Card overflow="hidden" pos="relative" {...props}>
      <FadeImage
        direction="to left"
        src={image}
        placeholder={brand}
        percent={60}
        opacity={50}
      />

      <HStack gap="5px" pos="relative" align="start">
        <Avatar name={user.username} src={user.avatarUrl} variant="normal" />
        <Flex direction="column">
          <Text color={textColorPrimary} fontSize="xl" fontWeight="bold">
            {user.username}
          </Text>
          <Text color={textColorPrimary}>{user.description}</Text>
        </Flex>
      </HStack>
    </Card>
  );
}

export function SmallUserItem({ user, ...props }: { user: User } & StackProps) {
  const { textColorPrimary, textColorSecondary, globalBg } = useColors();
  return (
    <TagCard overflow="hidden" pos="relative" bg={globalBg} {...props}>
      <Avatar name={user.username} src={user.avatarUrl} variant="normal" />
      <Flex direction="column">
        <Text color={textColorPrimary} fontSize="xl" fontWeight="bold">
          {user.username}
        </Text>
        <Text color={textColorSecondary}>{user.description}</Text>
      </Flex>
    </TagCard>
  );
}

export function UserItemSkeleton() {
  return <></>;
}
